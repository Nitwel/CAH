from os import listdir
from os.path import isfile, join
import json
import pathlib

path = pathlib.Path(__file__).parent.absolute()

langs = [f for f in listdir(join(path, "decks")) if not isfile(join(path, "decks", f))]

for lang in langs:
    decks = [f for f in listdir(join(path, "decks", lang)) if isfile(join(path, "decks", lang, f))]

    for deck in decks:
        json_file = open("./decks/{0}/{1}".format(lang, deck), "r", encoding="utf-8")
        content = json.loads(json_file.read())
        json_file.close()

        if('blackCards' not in content):
            print("No blackCards in {0}/{1}".format(lang, deck) )
            continue
        
        if('whiteCards' not in content):
            print("No whiteCards in {0}/{1}".format(lang, deck) )
            continue
        

        last_black_text = "First"
        for black_card in content['blackCards']:
            if('text' not in black_card):
                print("No text in {0}/{1} blackCards next to {2}".format(lang, deck, last_black_text) )
                continue
            
            if('pick' not in black_card):
                print("No pick in {0}/{1} blackCard next to {2}".format(lang, deck, last_black_text) )
                continue

            if(black_card['text'].startswith(' ') or black_card['text'].endswith(' ')):
                black_card['text'] = black_card['text'].strip()
            
            last_black_text = black_card['text']

        for white_card in content['whiteCards']:
            if(white_card.startswith(' ') or white_card.endswith(' ')):
                white_card = white_card.strip()
            
        with open("./decks/{0}/{1}".format(lang, deck), "w", encoding='utf8') as json_file_updated:
            json.dump(content, json_file_updated, indent=4, ensure_ascii=False)