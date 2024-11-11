import MeCab
wakati = MeCab.Tagger("-Owakati")
result = wakati.parse("pythonが大好きです").split()
print(result)

tagger = MeCab.Tagger()
print(tagger.parse("pythonが大好きです"))