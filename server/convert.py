import requests
import os
import json

langs = ["en"]
decks = ["Base","CAHe1","CAHe2","CAHe3","CAHe4","CAHe5","CAHe6","greenbox","90s","Box","fantasy","food","science","www","hillary","trumpvote","trumpbag","xmas2012","xmas2013","PAXE2013","PAXP2013","PAXE2014","PAXEP2014","PAXPP2014","PAX2015","HOCAH","reject","reject2","Canadian","misprint","apples","crabs","matrimony","c-tg","c-admin","c-anime","c-antisocial","c-equinity","c-homestuck","c-derps","c-doctorwho","c-eurovision","c-fim","c-gamegrumps","c-golby","GOT","CAHgrognards","HACK","Image1","c-ladies","c-imgur","c-khaos","c-mrman","c-neindy","c-nobilis","NSFH","c-northernlion","c-ragingpsyfag","c-stupid","c-rt","c-rpanons","c-socialgamer","c-sodomydog","c-guywglasses","c-vewysewious","c-vidya","c-xkcd"]

def convert(fromJson, lang):
    file_txt = open("./decks/{0}/all-data.txt".format(lang), "w+" if fromJson else "r+")
    for (i, deck) in enumerate(decks):
        file_json = open("./decks/{0}/{1}.json".format(lang, deck), "r+")
            
        text = file_json.read()
        
        if fromJson:
            jsonData = json.loads(text)

            black_cards = jsonData['blackCards']
            white_cards = jsonData['whiteCards']

            black_cards = map(lambda black_card: black_card['text'], black_cards)
            file_txt.write("\n".join(black_cards) + "\n+\n" + "\n".join(white_cards) + "\n\n")

        else:
            jsonOutput = {
                'blackCards': [],
                'whiteCards': []
            }

            jsonData = json.loads(text)
            black_cards_before = jsonData['blackCards']
            black_card_ids = list(map(lambda black_card: black_card['pick'], black_cards_before))
            txtData = file_txt.read()
            card_decks = txtData.split("\n\n")
            print(len(card_decks))
            cards = card_decks[i].split("\n+\n")
            print(deck)
            black_cards = cards[0].split("\n")
            white_cards = cards[1].split("\n")

            for (index, black_card) in enumerate(black_cards):
                jsonOutput['blackCards'].append({
                    'text': black_card,
                    'pick': black_card_ids[index]
                })
            jsonOutput['whiteCards'] = white_cards

            file_json.truncate(0)
            file_json.write(json.dumps(jsonOutput))


        file_json.close()
            
    file_txt.close()

convert(False, "de")