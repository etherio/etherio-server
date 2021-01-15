process.env.NODE_ENV !== 'production' && require('dotenv').config();
const axios = require('axios').default;
const fs = require('fs');
const path = require('path');
const {
  GOOGLE_APPLICATION_CREDENTIALS,
  FIREBASE_ADMIN_URL,
  FIREBASE_ADMIN_TOKEN,
} = process.env;
const credentialPath = path.join(process.cwd(), GOOGLE_APPLICATION_CREDENTIALS);
if (!fs.existsSync(credentialPath)) {
  const url = `${FIREBASE_ADMIN_URL}?alt=media&token=${FIREBASE_ADMIN_TOKEN}`;
  axios(url).then(({ data }) =>
    fs.writeFileSync(credentialPath, JSON.stringify(data, null, 2), 'utf-8')
  );
}
