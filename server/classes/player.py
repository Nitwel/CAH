class Player:

    def __init__(self, sid, name, points = 0, spec = False):
        self.sid = sid
        self.name = name
        self.hand = []
        self.points = points
        self.spectator = spec
        self.deleted_card = False
        self.reveal_pos = None

    def to_json(self):
        return {
            'sid': self.sid,
            'name': self.name,
            'hand': self.hand,
            'points': self.points,
            'spectator': self.spectator,
            'deleted_card': self.deleted_card
        }