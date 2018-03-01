# Realtime Quiz Application

# Project Description:

The quiz app will be a web game which would allow 2 players to connect to a quiz and play against each other.
A game consists of multiple rounds, in each round a random movie/song will be displayed and players have to guess the year in which it was released. The questions would be of the following types:
A song/ movie poster would be displayed and the player has to guess the year in which it was release.
A part of the song/movie would be played and the user has to guess its name
Each correct answer will be rewarded positive point and wrong answer will lead to negative point or zero point. The player with the most points at the end wins!
# Functionalities:

User has to register a new account with the application. User has an option to sign up using his gmail account.
Once User logs in login, s/he can either join an existing game or start a new one. 
If he creates a new game, he will have to provide the session with a unique name (so that another user can join the session) and invite friends. 
When a minimum of 2 players is reached then the game will start. As soon as the game starts, a movie/song would be displayed with corresponding question, and the user needs to guess the correct answer within a limited time frame. A timer will be shown for user to keep track of remaining time.
After the round is complete the user is shown the final score with the winner of that round.

# Web Dev Area list:

OAUTH/SSO/API usage::  It asks for permissions - google oauth.

Performance testing:: We have deployed client and server side mocha tests for correct working
    
Software engineering:: 
code review:- Used Github code review, 
Deployment:- Google Compute Engine

Realtime features: Will embed youtube videos and get it to autoload. Will have to synchronise the videos across players using web socket or server sent events

Back end storage:: Used mLab which is a Database-as-a-Service for MongoDB

# Continuous deployment

## Deployment on Google Compute Engine (Current deployment method)
1. We first created a virtual machine instance(instance-1) 

2. We created a domain name(quizapp.tk) for our application using “dot tk” website
3. We then set the external IP address of our VM as the target on the “DNS management for quizapp.tk” page and then go back to the compute engine and open the ssh shell of our VM.

4. Now we clone the git repository of our app on the cloud and installed redis using the command “sudo apt-get install redis-server” and other npm dependencies using  “npm install”
5. Now run “npm start”
6. Now we have our app running on cloud
7. Open a web browser and go to quizapp.tk:3000, you can see the app running

# Steps to run the application:(Deployment Instructions)
1. To deploy by yourself follow the above instructions 
2. We already have a running instance deployed on the cloud, contact us so that we can start it and then you just open the browser and go to the following url: “quizapp.tk:3000” to run the app


# Contribution

Aakash Barve

Rachita Gupta 

Sreetama Banerjee








