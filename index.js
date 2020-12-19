const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const app = express();

const PORT = process.env.PORT || 8000;
const middleware = require("./src/middleware");
const router = require("./router");

app.use(express.static(path.resolve("tmp")));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(middleware(__dirname));

app.get("/", (req, res) => {
  res.status(101);
  res.end();
});

app.use(router);

app.use((req, res) => {
  res.status(404);
  res.end();
});

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
