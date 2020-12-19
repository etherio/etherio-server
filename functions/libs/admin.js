const admin = require("firebase-admin");

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-o1xrx%40${process.env.FIREBASE_PROJECT_ID}.iam.gserviceaccount.com`,
};

let app;

module.exports = {
  init() {
    if (app) {
      return;
    }

    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  },

  async getUserByToken(token) {
    let user = await this.verifyToken(token);
    return await this.getUser(user.uid);
  },

  async createCustomToken(uid, claims) {
    return await app.auth().createCustomToken(uid, claims);
  },

  async setCustomUserClaims(uid, claims) {
    return await app.auth().setCustomUserClaims(uid, claims);
  },

  async getUser(user_id) {
    return await app.auth().getUser(user_id);
  },

  async verifyToken(token) {
    return await app.auth().verifyIdToken(token);
  },
};
