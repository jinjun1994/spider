import pymongo
# https://api.mongodb.com/python/current/tutorial.html
# mongo -u jinjun -p jj044019 149.248.5.21/admin
# mongodbUri = 'mongodb://jinjun:jj044019@149.248.5.21/admin'

# client = pymongo.MongoClient(mongodbUri)
client = pymongo.MongoClient()
db = client.weibo
print(db)
a = db.user.find_one()
print(a)