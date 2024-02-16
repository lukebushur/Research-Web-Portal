from dotenv import load_dotenv
import os

load_dotenv() 

from pymongo import MongoClient
def get_database():

   # Provide the mongodb atlas url to connect python to mongodb using pymongo
   CONNECTION_STRING = os.getenv("MONGO_URI") 
 
   # Create a connection using MongoClient.
   client = MongoClient(CONNECTION_STRING)
 
   return client
  
# This is added so that many files can reuse the function get_database()
if __name__ == "__main__":   
  
   # Get the database
   dbname = get_database()[os.getenv("DATABASE")]
