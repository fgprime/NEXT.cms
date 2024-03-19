const fs = require("fs").promises;
const path = require("path");

const DATA_PATH = "data";

const fileModule = {
  read: async (path) => {
    try {
      return await fs.readFile(`${DATA_PATH}/${path}.json`);
    } catch (err) {
      console.log(err);
      return false;
    }
  },

  write: async (path, content) => {
    try {
      await fs.writeFile(`${DATA_PATH}/${path}.json`, content);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  },
};

module.exports = fileModule;
