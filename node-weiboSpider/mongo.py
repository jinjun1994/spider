import pymongo
# https://api.mongodb.com/python/current/tutorial.html
# mongo -u jinjun -p jj044019 149.248.5.21/admin
mongodbUri = 'mongodb://jinjun:jj044019@149.248.5.21/admin'

client = pymongo.MongoClient(mongodbUri)
db = client.spider
print(db)
a = db.test.find_one()
print(a)