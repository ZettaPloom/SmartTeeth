const fs = require("fs");
const replace = require("replace-in-file");

module.exports = {
  editWiki(ruta, data) {
    fs.appendFile(ruta, data, function (err) {
      if (err) throw err;
    });
  },
  replaceWiki(ruta, old, replacement) {
    const options = {
      files: ruta,
      from: old,
      to: replacement,
    };
    try {
      const results = replace.sync(options);
      console.log("Replacement results:", results);
    } catch (error) {
      console.error("Error occurred:", error);
    }
  },
};
