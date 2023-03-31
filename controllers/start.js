'use strict';

// import all required modules
import logger from '../utils/logger.js';
import playlistStore from '../models/playlist-store.js';
import accounts from './accounts.js';


// create start object
const start = {

  // index method - responsible for creating and rendering the view
  index(request, response) {
 
    // display confirmation message in log
    const loggedInUser = accounts.getCurrentUser(request);
    logger.info('start rendering');
    
    // app statistics calculations
 if(loggedInUser){
    const playlists = playlistStore.getAllPlaylists();

    let numPlaylists = playlists.length;

    let numSongs = 0;

    for (let item of playlists) {
       numSongs += item.songs.length;
    }
   let average = 0;
   if (numPlaylists > 0) {
    average = numSongs / numPlaylists;
    average = average.toFixed(2);
   }
   
     
    let currentLargest = 0;
    let largestPlaylistTitle = "";
    for (let playlist of playlists) {
      if (playlist.songs.length > currentLargest) {
        currentLargest = playlist.songs.length;
      }
      
      
    }
    for (let playlist of playlists) {
      if (playlist.songs.length === currentLargest) {
            largestPlaylistTitle += playlist.title + ", ";
      }
    }
    
    let currentSmallest = 1;
    if (numPlaylists > 0) {
      currentSmallest = playlists[0].songs.length;
    } 
    let smallestPlaylistTitle = "";

    for (let playlist of playlists) {
      if (playlist.songs.length < currentSmallest) {
        currentSmallest = playlist.songs.length;
      }
    }
    for (let playlist of playlists) {
      if (playlist.songs.length === currentSmallest) {
        smallestPlaylistTitle += playlist.title + ", ";
      }
    }
       
    // create view data object (contains data to be sent to the view e.g. page title)
    const viewData = {
      title: "Welcome to the Playlist App!",
      totalPlaylists: numPlaylists,
      totalSongs: numSongs,
      average: average,
      largest: largestPlaylistTitle,
      smallest: smallestPlaylistTitle,
      fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
      picture: loggedInUser.picture
    };


    // render the start view and pass through the data
    response.render('start', viewData);
 }
    else response.redirect('/')
  },
};

// export the start module
export default start;
