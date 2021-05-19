#!/usr/bin/env python3

import random

import eventlet
import socketio
import sys

from classes.house import House
from classes.player import Player

sio = socketio.Server(cors_allowed_origins='*')
app = socketio.WSGIApp(sio, static_files={
    '/': {'content_type': 'text/html', 'filename': 'index.html'}
})

house = House()


@sio.event
def connect(sid, environ):
    print('connect ', sid)
    sio.emit('event', {'response': 'my response'})


@sio.event
def my_message(sid, data):
    print('message ', data)


@sio.on("join")
def join(sid, data):
    name = data['name']
    lobby = data['lobby']

    game = house.get_game(lobby)
    disconnected_player = game.get_disconnected_player(name)

    if disconnected_player:
        sio.enter_room(sid, lobby)
        game.add_player(disconnected_player)
        game.update_sid(disconnected_player.sid, sid)
        disconnected_player.sid = sid
        sio.emit('player_join', {'name': disconnected_player.name}, lobby)
        host = game.get_player(game.host)

        players = []
        revealed = {}

        for player in [*game.players, *game.disconnected]:
            player_data = {'name': player.name, 'points': player.points }
            if player.reveal_pos or player.sid in game.placed_cards.keys(): player_data['placed'] = True
            player_data['connected'] = (player in game.players)
            players.append(player_data)

            if player.sid in game.revealed_players:
                revealed[player.reveal_pos] = game.placed_cards[player.sid]

        return {
            'players': players,
            'host': host.name,
            'points_to_win': game.points_to_win,
            'hand_size': game.hand_size,
            'card_decks': game.card_decks,
            'revealed': revealed,
            'hand': disconnected_player.hand,
            'black': game.black_card,
            'zar': game.get_zar().name,
        }

    if game.game_state != "Lobby":
        return {'error': 'Game already running.'}

    player = Player(sid, name)
    
    if not game.add_player(player):
        return {'error': 'Player name already exists.'}

    sio.enter_room(sid, lobby)

    sio.emit('player_join', {'name': player.name}, lobby)  # Sending new player information to other players
    host = game.get_player(game.host)

    return {
        'players': list(map(lambda p: {
            'name': p.name,
            'points': 0,
            'connected': p in game.players
        }, [*game.players, *game.disconnected])),
        'host': host.name,
        'points_to_win': game.points_to_win,
        'hand_size': game.hand_size,
        'card_decks': game.card_decks,
        'language': game.language
    }


@sio.on("start_game")
def start_game(sid):
    game = house.get_game_of_player(sid)
    if not game:
        return {'error': 'You are not in a lobby.'}

    if game.host != sid:
        return {'error': 'You are not the host.'}

    if len(game.players) < 3:
        return {'error': 'You need at least 3 players in the lobby.'}

    for player in game.players:
        player.hand = []

    game.start_game()

    for player in game.players:
        player.points = 0
        sio.emit('game_start', {'hand': player.hand, 'black': game.black_card, 'zar': game.get_zar().name}, to=player.sid)


@sio.on("place_cards")
def place_cards(sid, cards):
    game = house.get_game_of_player(sid)
    game.player_placed_cards(sid, cards)
    player = game.get_player(sid)

    sio.emit('cards_placed', player.name, room=game.name)


@sio.on("reveal")
def reveal_cards(sid, pos):
    game = house.get_game_of_player(sid)
    zar = game.get_zar()

    if zar.sid != sid:
        return {'error': 'You are not the zar.'}

    if not game.all_players_placed():
        return {'error': 'Not all players have placed their cards.'}

    players = list(filter(lambda p: p.sid != sid and not game.is_player_revealed(p.sid), game.players))

    if len(players) == 0:
        return {'error': 'All players are revealed.'}

    player = random.choice(players)

    game.player_revealed(player.sid)

    player.reveal_pos = pos
    
    sio.emit("cards_revealed", {'pos': pos, 'cards': game.placed_cards[player.sid]}, room=game.name)


@sio.on("winner_selected")
def winner(sid, pos):
    game = house.get_game_of_player(sid)

    if game.get_zar().sid != sid:
        return {'error': 'You are not the zar.'}

    if not game.all_cards_revealed():
        return {'error': 'Not all cards are revealed.'}

    winning_player = game.get_player_with_pos(pos)

    if not winning_player:
        return {'error': 'Player with name ' + name + ' not found.'}

    winning_player.points += 1

    if winning_player.points >= game.points_to_win:
        game.end_game()

        points = {}
        for player in game.players:
            points[player.name] = player.points
        sio.emit('game_end', points, room=game.name)
    else:
        pos = {}
        for player in game.players:
            pos[player.reveal_pos] = player.name

        game.start_round()
        for player in game.players:
            sio.emit('next_round', {
                'hand': player.hand,
                'black': game.black_card,
                'zar': game.get_zar().name,
                'winner': winning_player.name,
                'pos': pos
            }, to=player.sid)

@sio.on("change_settings")
def change_settings(sid, settings):
    game = house.get_game_of_player(sid)

    if game.get_zar().sid != sid:
        return {'error': 'You are not the zar.'}
    
    if game.game_state != "Lobby":
        return {'error': 'Settings can only be canged in the lobby.'}

    if settings['card_decks']:
        game.card_decks = settings['card_decks']

    if settings['points_to_win']:
        game.points_to_win = settings['points_to_win']

    if settings['hand_size']:
        game.hand_size = settings['hand_size']
    
    if settings['language']:
        game.language = settings['language']

    sio.emit('settings_changed', settings, room=game.name)

    return {'info': 'The settings have been changed.'}

@sio.on("delete_card")
def delete_card(sid, card):
    game = house.get_game_of_player(sid)

    if not game:
        return {'error': 'You are not in a game.'}

    player = game.get_player(sid)

    if player.deleted_card:
        return {'error': 'You already deleted a card.'}

    if card not in player.hand:
        return {'error': 'The card does not exist in your hand.'}

    player.hand.remove(card)
    player.deleted_card = True

@sio.on("games")
def games(sid, password):
    if(password != 'Umpa Lumpas'):
        return {'error': 'Wrong password.'}

    return [game.to_json() for game in house.games.values()]

@sio.on("players")
def players(sid, password):
    if(password != 'Umpa Lumpas'):
        return {'error': 'Wrong password.'}

    return [player.to_json() for game in house.games.values() for player in game.players]


@sio.on("leave")
def leave(sid):
    disconnect(sid)

@sio.event
def disconnect(sid):
    for game in house.games.values():
        if game.has_player(sid):
            sio.leave_room(sid, game.name)

            if len(game.players) == 1:
                del house.games[game.name]
                return

            zar = game.get_zar()
            player = game.remove_player(sid)
            sio.emit('host', game.get_player(game.host).name, game.name)
            sio.emit('player_leave', player.name, game.name)

            if game.game_state == "Lobby": return
                
            if len(game.players) < 3:
                game.end_game()
                points = {}
                for player in game.players:
                    points[player.name] = player.points
                    sio.emit('game_end', points, room=game.name)
            elif player == zar:
                game.start_round()
                for player in game.players:
                    sio.emit('next_round', {
                        'hand': player.hand,
                        'black': game.black_card,
                        'zar': game.get_zar().name,
                        'winner': ''
                    }, to=player.sid)




if __name__ == '__main__':
    if(len(sys.argv) > 1 and sys.argv[1] == 'dev'):
        eventlet.wsgi.server(eventlet.listen(('', 5000)), app)
    else:
        eventlet.wsgi.server(eventlet.wrap_ssl(eventlet.listen(('', 5000)), certfile='cert.crt', keyfile='private.key', server_side=True), app)
