'use strict';

// import all required modules
import logger from '../utils/logger.js';
import playlistStore from '../models/playlist-store.js';
import accounts from './accounts.js';
import { v4 as uuidv4 } from 'uuid';


const playlist = {
  index(request, response) {
    const playlistId = request.params.id;
    logger.debug('Playlist id = ' + playlistId);
    const loggedInUser = accounts.getCurrentUser(request);
    
    let playlist = playlistStore.getPlaylist(playlistId)
    let totDuration = 0;
    for (let song of playlist.songs) {
        totDuration += parseFloat(song.duration)
    }
    const viewData = {
      title: 'Playlist',
      playlist: playlist,
      Duration: totDuration,
      fullname: loggedInUser.firstName + ' ' + loggedInUser.lastName,
      picture: loggedInUser.picture
    };
    response.render('playlist', viewData);
  },
  
    deleteSong(request, response) {
    const playlistId = request.params.id;
    const songId = request.params.songid;
    logger.debug(`Deleting Song ${songId} from Playlist ${playlistId}`);
    playlistStore.removeSong(playlistId, songId);
    response.redirect('/playlist/' + playlistId);
  },

  addSong(request, response) {
    const playlistId = request.params.id;
    const playlist = playlistStore.getPlaylist(playlistId);
    const newSong = {
     id: uuidv4(),
     title: request.body.title,
     artist: request.body.artist,
     genre: request.body.genre,
     duration: request.body.duration
    };
    playlistStore.addSong(playlistId, newSong);
    response.redirect('/playlist/' + playlistId);
  },
  
  updateSong(request, response) {
    const playlistId = request.params.id;
    const songId = request.params.songid;
    logger.debug("updating song " + songId);
    const updatedSong = {
      id: songId,
      title: request.body.title,
      artist: request.body.artist,
      genre: request.body.genre,
      duration: request.body.duration
    };
    playlistStore.editSong(playlistId, songId, updatedSong);
    response.redirect('/playlist/' + playlistId);
  }




};

export default playlist;

