const { Router } = require("express");
const path = require("path");
const multer = require("multer");
const jimp = require("jimp");

const IMAGE_WIDTH = jimp.AUTO;
const IMAGE_HEIGHT = 480;

const MIME_TYPE_EXTENSION = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/svg": "svg",
};

const app = Router();

const admin = require("./src/firebase");
const upload = multer({
  dest: path.resolve(__dirname, "tmp"),
});

app.post("/image", upload.single("image"), async (req, res) => {
  if (
    !req.file ||
    (req.file && req.file.mimetype && !MIME_TYPE_EXTENSION[req.file.mimetype])
  ) {
    res.status(400);
    return res.end();
  }
  let extension = MIME_TYPE_EXTENSION[req.file.mimetype];
  try {
    let file = req.file;
    let fileName = `${Date.now()}-${file.filename}.${extension}`;
    let absolutePath = file.path;
    let code = req.body.code;
    let output = `${file.destination}/${fileName}`;
    let protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    let image = await jimp.read(absolutePath);
    let { height, width } = image.bitmap;
    let white = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);
    let black = await jimp.loadFont(jimp.FONT_SANS_16_BLACK);
    if (
      (IMAGE_HEIGHT != jimp.AUTO && height > IMAGE_HEIGHT) ||
      (IMAGE_WIDTH != jimp.AUTO && width > IMAGE_WIDTH)
    ) {
      await image.resize(IMAGE_WIDTH, IMAGE_HEIGHT);
    }
    await image.quality(80);
    await image.print(black, 11, 19, `OMG#${code}`);
    await image.print(black, 9, 21, `OMG#${code}`);
    await image.print(black, 11, 21, `OMG#${code}`);
    await image.print(black, 9, 19, `OMG#${code}`);
    await image.print(white, 10, 20, `OMG#${code}`);

    await image.write(output);
    res.json({
      path: `${protocol}://${req.headers.host}/${fileName}`,
    });
  } catch (e) {
    res.status(500);
    console.error(e);
  }
  res.end();
});

app.get("/status", (req, res) => {
  res.json({
    serverTime: req.serverTime,
  });
});

module.exports = app;
