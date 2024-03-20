const fsp = require("fs").promises;
const { existsSync } = require("fs");

const logger = require("./logger");

const DATA_PATH = "data";

const fileModule = {
  read: async (section, path, ressource) => {
    try {
      return await fsp.readFile(
        `${DATA_PATH}/${section}${path}/${ressource}.json`,
      );
    } catch (err) {
      logger.error(`Error reading file ${path}`, err);
      return false;
    }
  },

  write: async (section, path, ressource, content) => {
    const targetPath = `./${DATA_PATH}/${section}${path}`;
    try {
      if (!existsSync(targetPath)) {
        const dir = await fsp.mkdir(targetPath, { recursive: true });
        if (!dir)
          logger.error({
            message: "Directory was not created",
          });
      }
      await fsp.writeFile(`${targetPath}/${ressource}.json`, content);
      return true;
    } catch (err) {
      logger.error(`Error writing file ${targetPath}}`, err);
      return false;
    }
  },
};

module.exports = fileModule;
