if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
const axios = require('axios').default;
const fs = require('fs');
const path = require('path');
const {
  GOOGLE_APPLICATION_CREDENTIALS,
  FIREBASE_ADMIN_URL,
  FIREBASE_ADMIN_TOKEN,
} = process.env;
const credentialPath = (process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(
  process.cwd(),
  GOOGLE_APPLICATION_CREDENTIALS
));

if (!fs.existsSync(credentialPath)) {
  axios(
    `${FIREBASE_ADMIN_URL}?alt=media&token=${FIREBASE_ADMIN_TOKEN}`
  ).then(({ data }) => fs.writeFileSync(credentialPath, JSON.stringify(data)));
}
