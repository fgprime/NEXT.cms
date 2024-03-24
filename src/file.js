const fsp = require("fs").promises;
const { existsSync } = require("fs");
const logger = require("./logger");

const RESULT = require("./file-result");
const DATA_PATH = "data";

function doesFileExist(path) {
  try {
    if (!existsSync(path)) {
      return false;
    } else {
      return true;
    }
  } catch (err) {
    logger.error(`Error checking esitance of file ${path}`, err);
    return false;
  }
}

const fileModule = {
  read: async (section, path, ressource) => {
    try {
      return await fsp.readFile(
        `${DATA_PATH}/${section}${path}/${ressource}.json`,
      );
    } catch (err) {
      logger.error(`Error reading file ${path}`, err);
      return RESULT.error;
    }
  },

  write: async (section, path, resource, content) => {
    const targetPath = `./${DATA_PATH}/${section}${path}`;
    const targetResource = `${targetPath}/${resource}.json`;

    if (doesFileExist(targetResource)) {
      return RESULT.exist;
    }

    try {
      if (!existsSync(targetPath)) {
        const dir = await fsp.mkdir(targetPath, { recursive: true });
        if (!dir)
          logger.error({
            message: "Directory was not created",
          });
      }
      await fsp.writeFile(`${targetPath}/${resource}.json`, content);
      return RESULT.success;
    } catch (err) {
      logger.error(`Error writing file ${targetPath}}`, err);
      return RESULT.error;
    }
  },

  update: async (section, path, resource, content) => {
    const targetPath = `./${DATA_PATH}/${section}${path}`;
    const targetResource = `${targetPath}/${resource}.json`;
    try {
      if (doesFileExist(targetResource)) {
        await fsp.writeFile(`${targetPath}/${resource}.json`, content);
        return RESULT.success;
      } else {
        return RESULT.error;
      }
    } catch (err) {
      logger.error(`Error updating file ${targetResource}}`, err);
      return RESULT.error;
    }
  },

  delete: async (section, path, resource) => {
    const targetResource = `./${DATA_PATH}/${section}${path}/${resource}.json`;
    try {
      if (doesFileExist(targetResource)) {
        await fsp.unlink(targetResource);
        return RESULT.success;
      } else {
        return RESULT.error;
      }
    } catch (err) {
      logger.error(`Error deleting file ${targetResource}`, err);
      return RESULT.error;
    }
  },
};

module.exports = fileModule;
