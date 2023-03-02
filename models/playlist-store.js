'use strict';

import logger from '../utils/logger.js';
import JsonStore from './json-store.js';
import cloudinary from 'cloudinary';

import { createRequire } from "module";
const require = createRequire(import.meta.url);

try {
  const env = require("../.data/.env.json");
  cloudinary.config(env.cloudinary);
}
catch(e) {
  logger.info('You must provide a Cloudinary credentials file - see README.md');
  process.exit(1);
}

const playlistStore = {

  store: new JsonStore('./models/playlist-store.json', { playlistCollection: [] }),
  collection: 'playlistCollection',

  getAllPlaylists() {
    return this.store.findAll(this.collection);
  },
  
  getPlaylist(id) {
    return this.store.findOneBy(this.collection, (collection => collection.id === id));
  },
  
  removeSong(id, songId) {
    const arrayName = "songs";
    this.store.removeItem(this.collection, id, arrayName, songId);
  },
  
  removePlaylist(id) {
    const playlist = this.getPlaylist(id);
    this.store.removeCollection(this.collection, playlist);
  },
  
  removeAllPlaylists() {
    this.store.removeAll(this.collection);
  },
  
  async addPlaylist(playlist, response) {
    function uploader(){ 
      return new Promise(function(resolve, reject) {  
        cloudinary.uploader.upload(playlist.picture.tempFilePath,function(result,err){
          if(err){console.log(err);}
          resolve(result);
        });
      });
    } 
    let result = await uploader();
    logger.info('cloudinary result', result);
    playlist.picture = result.url;
      
    this.store.addCollection(this.collection, playlist);
    response();
  },
  
  addSong(id, song) {
    const arrayName = "songs";
    this.store.addItem(this.collection, id, arrayName, song);
  },
  
  editSong(id, songId, updatedSong) {
    const arrayName = "songs";
    this.store.editItem(this.collection, id, songId, arrayName, updatedSong);
  },
  
  getUserPlaylists(userid) {
    return this.store.findBy(this.collection, (playlist => playlist.userid === userid));
  },

};

export default playlistStore;