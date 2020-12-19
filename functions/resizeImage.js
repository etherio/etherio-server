const fs = require("fs");
const os = require("os");
const jimp = require("jimp");
const { v4: uuid } = require("uuid");

const IMAGE_WIDTH = jimp.AUTO;
const IMAGE_HEIGHT = 480;

exports.handler = async (request) => {
  let statusCode = 200;
  let headers = {
    "content-type": "application/json;charset=UTF-8",
    "access-control-allow-origin": "*",
  };
  let response = {};
  // try {
  let data = JSON.parse(request.body);
  m = data.image.match(/^data:([A-Za-z+-\/]+);base64,(.+)$/);
  if (m && m.length !== 3)
    return {
      statusCode: 400,
      headers,
      body: "invalid data",
    };
  let path = os.tmpdir() + uuid() + ".jpg";
  let mime = m[1];
  let image = Buffer.from(m[2], "base64");
  let blackFont = await jimp.loadFont(jimp.FONT_SANS_16_BLACK);
  let whiteFont = await jimp.loadFont(jimp.FONT_SANS_16_WHITE);
  image = await jimp.read(image);
  let { height, width } = image.bitmap;
  if (
    (IMAGE_HEIGHT != jimp.AUTO && height > IMAGE_HEIGHT) ||
    (IMAGE_WIDTH != jimp.AUTO && width > IMAGE_WIDTH)
  ) {
    await image.resize(IMAGE_WIDTH, IMAGE_HEIGHT);
  }
  await image.quality(80);
  await image.print(blackFont, 11, 19, "#" + data.code);
  await image.print(blackFont, 9, 21, "#" + data.code);
  await image.print(blackFont, 11, 21, "#" + data.code);
  await image.print(blackFont, 9, 19, "#" + data.code);
  await image.print(whiteFont, 10, 20, "#" + data.code);
  await image.writeAsync(path);
  image = fs.readFileSync(path, "base64");
  fs.unlinkSync(path);
  return {
    headers: {
      ...headers,
      "content-length": image.length,
    },
    statusCode,
    body: JSON.stringify(`data:${mime};base64,${image}`),
  };
  // } catch (e) {
  //   // console.error(e);
  //   statusCode = 500;
  //   response.error = "Unable to process an image";
  // }
  return {
    headers,
    statusCode,
    body: JSON.stringify(response),
  };
};
