import admin from 'firebase-admin';
import { firebaseConfig } from './firebase';

const serviceAccount = require('~/service-account.json');

export default function ({ app }) {
  app.database = admin.database;
  if (admin.apps && admin.apps.length) return;
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: firebaseConfig.databaseURL,
    storageBucket: firebaseConfig.storageBucket,
  });
}
