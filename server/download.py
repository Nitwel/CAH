import requests
import os

def load(card_deck):
    payload = {'decks[]': card_deck, 'type': 'JSON'}
    r = requests.post('https://crhallberg.com/cah/output.php', payload)
    return r.text

langs = ["en", "de"]
decks = ["Base","CAHe1","CAHe2","CAHe3","CAHe4","CAHe5","CAHe6","greenbox","90s","Box","fantasy","food","science","www","hillary","trumpvote","trumpbag","xmas2012","xmas2013","PAXE2013","PAXP2013","PAXE2014","PAXEP2014","PAXPP2014","PAX2015","HOCAH","reject","reject2","Canadian","misprint","apples","crabs","matrimony","c-tg","c-admin","c-anime","c-antisocial","c-equinity","c-homestuck","c-derps","c-doctorwho","c-eurovision","c-fim","c-gamegrumps","c-golby","GOT","CAHgrognards","HACK","Image1","c-ladies","c-imgur","c-khaos","c-mrman","c-neindy","c-nobilis","NSFH","c-northernlion","c-ragingpsyfag","c-stupid","c-rt","c-rpanons","c-socialgamer","c-sodomydog","c-guywglasses","c-vewysewious","c-vidya","c-xkcd"]

for deck in decks:

    text = load(deck)

    for lang in langs:
        os.rename("./decks/{0}/{1}.txt".format(lang, deck), "./decks/{0}/{1}.json".format(lang, deck))
        # file = open("./decks/{0}/{1}.txt".format(lang, deck), "w+")
        # file.write(text)
        # file.close()