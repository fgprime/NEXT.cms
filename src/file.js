const fsp = require("fs").promises;
const { existsSync } = require("fs");

const logger = require("./logger");

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
      return false;
    }
  },

  write: async (section, path, resource, content) => {
    const targetPath = `./${DATA_PATH}/${section}${path}`;
    const targetResource = `${targetPath}/${resource}.json`;

    //TODO: check correct status code if write is not possible
    if (doesFileExist(targetResource)) {
      return false;
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
      return true;
    } catch (err) {
      logger.error(`Error writing file ${targetPath}}`, err);
      return false;
    }
  },

  update: async (section, path, resource, content) => {
    const targetPath = `./${DATA_PATH}/${section}${path}`;
    const targetResource = `${targetPath}/${resource}.json`;
    try {
      if (doesFileExist(targetResource)) {
        await fsp.writeFile(`${targetPath}/${resource}.json`, content);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      logger.error(`Error updating file ${targetResource}}`, err);
      return false;
    }
  },

  delete: async (section, path, resource) => {
    const targetResource = `./${DATA_PATH}/${section}${path}/${resource}.json`;
    try {
      if (doesFileExist(targetResource)) {
        await fsp.unlink(targetResource);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      logger.error(`Error deleting file ${targetResource}`, err);
      return false;
    }
  },
};

module.exports = fileModule;
