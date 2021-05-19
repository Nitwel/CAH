import json
import random
from typing import List
from .player import Player
from .deck_loader import load_decks

class Game:

    def __init__(self, name):

        self.game_state = "Lobby" # Lobby / Game
        self.players: List[Player] = []
        self.disconnected: List[Player] = []
        self.host = None
        self.card_decks = []
        self.placed_cards = {}
        self.revealed_players = []
        self.black_card = None
        self.zar = 0
        self.name = name
        self.hand_size = 7
        self.points_to_win = 5
        self.language = "en"
        self.card_decks = ["Base"]

    def get_card_decks(self):
        decks = load_decks(self.card_decks, self.language)

        self.black_cards: list = decks['black_cards']
        self.white_cards: list = decks['white_cards']
        random.shuffle(self.black_cards)
        random.shuffle(self.white_cards)

    def draw_black(self):
        self.black_card = self.black_cards.pop(0)
        self.black_cards.append(self.black_card)

    def draw_white(self, amount = 1):
        choosen_cards = self.white_cards[:amount]
        del self.white_cards[:amount]
        self.white_cards += choosen_cards
        return choosen_cards
    
    def start_game(self):
        self.disconnected = []
        self.game_state = "Game"
        self.get_card_decks()
        self.start_round()

    def start_round(self):
        
        self.draw_black()
        self.next_zar()
        self.revealed_players = []
        self.placed_cards = {}

        for player in self.players:
            player.reveal_pos = None
            player.deleted_card = False
            player.hand += self.draw_white(self.hand_size - len(player.hand))
            
    def addPoint(self, sid):
        for player in self.players:
            if player.sid == sid:
                player.points += 1
                break

    def end_game(self):
        self.game_state = "Lobby"
        self.placed_cards = {}
        self.revealed_players = []
        self.black_card = None
        self.zar = 0
        self.disconnected = []

    def get_player(self, sid) -> Player:
        return next(filter(lambda p: p.sid == sid, self.players), None)

    def get_player_with_name(self, name) -> Player:
        return next(filter(lambda p: p.name == name, self.players), None)
    
    def get_player_with_pos(self, pos) -> Player:
        return next(filter(lambda p: p.reveal_pos == pos, self.players), None)

    def get_disconnected_player(self, name):
        return next(filter(lambda p: p.name == name ,self.disconnected), None)
    
    def remove_player(self, sid):
        player = self.get_player(sid)
        if player:
            if self.players.index(player) <= self.zar:
                self.zar = (self.zar - 1) % (len(self.players) - 1)

            self.players.remove(player)
            if self.host == player.sid and len(self.players) > 0:
                self.host = self.players[0].sid
            if self.game_state == "Game":
                self.disconnected.append(player)
        return player

    def add_player(self, player: Player):
        if player in self.disconnected:
            self.disconnected.remove(player)

        if self.has_player_with_name(player.name):
            return False
        if len(self.players) == 0:
            self.host = player.sid

        if not self.has_player(player.sid):
            self.players.append(player)
        return True

    def next_zar(self):
        self.zar = (self.zar + 1) % len(self.players)
        return self.zar
      
    def has_player(self, sid):
        return len(list(filter( lambda p: p.sid == sid, self.players))) > 0

    def has_player_with_name(self, name):
        return len(list(filter( lambda p: p.name == name, self.players))) > 0

    def player_placed_cards(self, sid, cards):
        self.placed_cards[sid] = cards
        player = self.get_player(sid)
        for card in cards:
            if(card in player.hand):
                player.hand.remove(card)

    def all_players_placed(self):
        return len(self.players) - 1 == len(self.placed_cards)

    def all_cards_revealed(self):
        return len(self.players) - 1 == len(self.revealed_players)

    def player_won_game(self):
        for player in self.players:
            if player.points >= self.points_to_win:
                return player
        return None

    def get_zar(self) -> Player:
        return self.players[self.zar]
    
    def player_revealed(self, sid):
        self.revealed_players.append(sid)
    
    def is_player_revealed(self, sid):
        return sid in self.revealed_players

    def update_sid(self, old_sid, new_sid):
        if old_sid in self.placed_cards.keys():
            self.placed_cards[new_sid] = self.placed_cards[old_sid]
            del self.placed_cards[old_sid]
        if old_sid in self.revealed_players:
            self.revealed_players.remove(old_sid)
            self.revealed_players.append(new_sid)

    def to_json(self):
        return {
            'name': self.name,
            'players': [player.to_json() for player in self.players],
            'host': self.host,
            'card_decks': self.card_decks,
            'placed_cards': self.placed_cards,
            'revealed_players': self.revealed_players,
            'black_card': self.black_card,
            'zar': self.zar,
            'hand_size': self.hand_size,
            'points_to_win': self.points_to_win,
            'disconnected': [player.to_json() for player in self.disconnected],
            'language': self.language,
            'black_cards': self.black_cards,
            'white_cards': self.white_cards
        }