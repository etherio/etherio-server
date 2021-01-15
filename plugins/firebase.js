import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBiSkxX_gfnqyhPath2vFwn2gjLclrFCtI',
  appId: '1:966040745442:web:2a83c08213721cdaacb5bb',
  authDomain: 'etherio-vue.firebaseapp.com',
  databaseURL: 'https://etherio-vue.firebaseio.com',
  measurementId: 'G-75S71S1TDQ',
  messagingSenderId: '966040745442',
  projectId: 'etherio-vue',
  storageBucket: 'etherio-vue.appspot.com',
};

export default function () {
  if (firebase.apps && firebase.apps.length) return firebase.app();
  return firebase.initializeApp(firebaseConfig);
}
