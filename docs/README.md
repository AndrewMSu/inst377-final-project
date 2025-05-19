# inst377-final-project
# Title: Powder Tracker

## Description:
The purpose of this project is to create a website where you are able to find fresh snow for skiers. It has a couple of features which include searching for resorts based on their city. Another feature is that you are able to find major resorts based on their region which is based on the PeakRankings website. Also you are able to add new resort locations based on their longitude and latitude. This is the new location page. Finally there is a map of the current snowfall movements in the U.S.

## Description of Target Browsers
This application can only be a website. The browsers that were tested were chrome, brave, and safari.

## Developer Manual Link:
[Link to the Developer Manual below](#Developer-Manual:)

# Developer Manual:
## Overview
This will help any further developer get off the ground and start working on improving the project as there is always stuff to work on.

## How to install your application and all dependencies
1. First clone the github repository
   - Use git clone SSH
2. Download npm and node.js
   - Follow this link for your system https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/ 
3. Install all dependencies
   - npm init
   - npm install @supabase/supabase-js
   - npm install body-parser
   - npm install express
   - npm install nodemon
   - npm install dotenv
## How to run your application on a server
1. Start the code
   - npm start
2. Access application
   - localhost:3000 

## How to run any tests you have written for your software
You can test the code you have written by running the local host and seeing if the new function you created works.

## The API for your server application
1. GET: Gets all the database data for the resorts.
   - Endpoint: /FinalProject
2. POST: Added the new data in the database for the resorts.
   - Endpoint: /FinalProject

## Known bugs and a road-map for future development
Known Bugs
   - Some of the locations of the regions are not the most accurate as they come from the cities given by peakRankings.
   - The openWeather API does not always give the correct city name or no name at all if you add in your own longitude and latitude.
Future Development
   - Some developments would be to make the locations more accurate to get the best readings of the current weather conditions.
   - Make it where it will always say what the city name is.
   - Add a function which allows the users to add the new location and then allow developers to make a decision if they want to add it to the region tab to create more community.
   - Also for the search function you do not have to click on the state for the city you are looking for but just go straight to the weather report. 


