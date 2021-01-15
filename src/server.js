const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function create(data) {
  const db = admin.database().ref('v0/blog_posts');
  const ref = await db.push();
  ref.set({
    _id: ref.key,
    ...data,
  });
  return ref.key;
}

app.post('/', (req, res) => {
  create(req.body)
    .then((_id) => {
      res.json({ _id, status: 'ok' });
    })
    .catch((err) => {
      res.json({ status: 'error', message: err.message });
    });
});

module.exports = app;
