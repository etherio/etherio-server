const fs = require("fs");
const path = require("path");
const admin = require("firebase-admin");

require("dotenv").config();

const privateKeyFile = path.resolve(__dirname, "../private.key");

const FIREBASE_CONFIG = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PROJECT_KEY_ID,
  private_key: fs.readFileSync(privateKeyFile, "utf-8"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509,
};

module.exports = admin.initializeApp(FIREBASE_CONFIG);
