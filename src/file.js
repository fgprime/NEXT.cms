const fs = require("fs").promises;

const logger = require("./logger");

const DATA_PATH = "data";

const fileModule = {
  read: async (path) => {
    try {
      return await fs.readFile(`${DATA_PATH}/${path}.json`);
    } catch (err) {
      logger.error(`Error reading file ${path}`, err);
      return false;
    }
  },

  write: async (path, content) => {
    try {
      await fs.writeFile(`${DATA_PATH}/${path}.json`, content);
      return true;
    } catch (err) {
      logger.error(`Error writing file ${path}`, err);
      return false;
    }
  },
};

module.exports = fileModule;
