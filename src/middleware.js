const fs = require("fs");
const path = require("path");

module.exports = (root) => {
  const serverTimeFile = path.resolve(root, "cached", ".serverTime");

  if (!fs.existsSync(serverTimeFile)) {
    fs.writeFileSync(serverTimeFile, Date.now().toString(), "utf-8");
  }

  const serverTime = parseInt(fs.readFileSync(serverTimeFile));

  return (req, res, next) => {
    res.setHeader("X-Server-Time", serverTime);
    res.serverTime = req.serverTime = serverTime;
    return next();
  };
};
