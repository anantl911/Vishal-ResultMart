require('dotenv').config();

const { initializeApp } = require('firebase/app');
const { getDatabase } = require('firebase/database');
const { getStorage } = require('firebase/storage');

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.FB_DB_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSender: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

module.exports = { storage, db };
