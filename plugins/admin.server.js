import admin from 'firebase-admin';

const serviceAccount = require('~/service-account.json');

export default function () {
  if (admin.apps && admin.apps.length) return admin.app();
  return admin.initializeApp(serviceAccount);
}
