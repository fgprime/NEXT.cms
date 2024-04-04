const fs = require("fs");
const { logger } = require("./logger");
const Ajv = require("ajv/dist/2020");
const ajv = new Ajv();
const RESULT = require("./file-result");
const SCHEMA_PATH = "schema";
const { READ_OPTIONS } = require("./file-options");
const { exit } = require("process");

//TODO: add test cases

const loadMetaSchema = (() => {
  try {
    const schema = fs.readFileSync(`${SCHEMA_PATH}/meta.json`, READ_OPTIONS);
    return JSON.parse(schema);
  } catch (err) {
    logger.error(`Error reading meta schema file`, err);
    exit(1);
  }
})();

const compileSchema = (schemaJson) => {
  try {
    return { validate: ajv.compile(schemaJson) };
  } catch (error) {
    logger.error(`Cannot compile schema`, error);
    return {
      validate: () => {
        return false;
      },
    };
  }
};

const metaSchema = (() => {
  const ms = loadMetaSchema;
  return compileSchema(loadMetaSchema);
})();

const schema = {
  validate: (data) => {
    return metaSchema.validate(data);
  },
};

module.exports = schema;
