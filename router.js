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

const upload = multer({
  dest: path.resolve(__dirname, "tmp"),
});

app.post("/image", upload.single("image"), async (req, res) => {
  let ext =
    req.file && req.file.mimetype && MIME_TYPE_EXTENSION[req.file.mimetype];
  let code = req.body.code;

  if (!req.file || !ext) {
    let errors = [];
    if (!req.file) errors.push("Required to upload an image");
    if (!ext) errors.push("Unsupported image type");
    res.json({ errors });
    res.status(400);
    return res.end();
  }
  try {
    let { filename, path, destination } = req.file;
    let fileName = `${Date.now()}-${filename}.${ext}`;
    let output = `${destination}/${fileName}`;
    let protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    let image = await jimp.read(path);
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
    if (code) {
      await image.print(black, 11, 19, `OMG#${code}`);
      await image.print(black, 9, 21, `OMG#${code}`);
      await image.print(black, 11, 21, `OMG#${code}`);
      await image.print(black, 9, 19, `OMG#${code}`);
      await image.print(white, 10, 20, `OMG#${code}`);
    }
    await image.write(output);
    res.json({
      path: `${protocol}://${req.headers.host}/${fileName}`,
    });
  } catch (e) {
    res.status(500);
    res.json({
      error: "Failed to optimize image",
    });
    console.error(e);
  }
  res.end();
});

app.get("/status", (req, res) => {
  res.json({
    startTime: req.startTime,
    expiredOn: req.expiredOn,
  });
});

app.get("/timestamp", (req, res) => {
  res.json(JSON.stringify(Date.now()));
});

module.exports = app;
