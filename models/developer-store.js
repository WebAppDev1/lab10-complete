'use strict';

import logger from '../utils/logger.js';
import JsonStore from './json-store.js';


const developerStore = {
  
  store: new JsonStore('./models/developer-store.json', { developers: [] }),
  collection: 'developers',

  // function to get all of the playlists
  getAllDevelopers() {
    return this.store.findAll(this.collection);
  },

};

// export the playlistStore object so it can be used elsewhere
export default developerStore;
