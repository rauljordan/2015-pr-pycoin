

#Import the necessary methods from tweepy library
from twitter import *
import os

#Variables that contains the user credentials to access Twitter API 
access_token = "268435708-b1lBMPBEWEqFr0yb0MiP6iAfEeVuVdTG9Jx188F1"
access_token_secret = "clMP8fBVxmIQ2cjD7EQOhdiYomQSYBIf9ifnD7WSJFyY7"
consumer_key = "DNYsEBSboxSzF73ijNvlKIIFZ"
consumer_secret = "jtLi3QYPZUXRW91BwQXZRfZnUvr0fUvnLCkWU9cYuCCOT9Wo7D"

MY_TWITTER_CREDS = os.path.expanduser('~/Desktop/Code/Python/Pycoin/app_credentials')

if not os.path.exists(MY_TWITTER_CREDS):
    oauth_dance("Pycoin", consumer_key, consumer_secret,
                MY_TWITTER_CREDS)

oauth_token, oauth_secret = read_token_file(MY_TWITTER_CREDS)

t = TwitterStream(auth=OAuth(
    oauth_token, oauth_secret, consumer_key, consumer_secret))

iterator = t.search('bitcoin')

for tweet in iterator:
    print tweet



