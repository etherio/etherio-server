const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const app = express();
const STATIC_PATH = path.resolve("tmp");

const PORT = process.env.PORT || 8000;
const middleware = require("./src/middleware");
const router = require("./router");

app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(middleware(__dirname));

app.get("/", (req, res) => {
  res.status(101);
  res.end();
});

app.use(router);

app.use((req, res) => {
  const staticPath = path.join(STATIC_PATH, req.path);
  if (!fs.existsSync(staticPath)) {
    res.status(404);
    return res.end();
  }
  res.sendFile(staticPath);
});

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
