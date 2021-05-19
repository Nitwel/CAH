from .game import Game

class House:

	def __init__(self):
		self.games = {}

	def get_game(self, game_name):
		if(game_name in self.games):
			return self.games[game_name]
		else:
			game = Game(game_name)
			self.games[game_name] = game
			return game
	
	def game_exists(self, game_name):
		return game_name in self.games

	def get_game_of_player(self, sid) -> Game:
		return next(iter(filter(lambda room: room.has_player(sid), self.games.values())), None)

