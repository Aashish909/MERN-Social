import DataUriParser from "datauri/parser.js";
import path from "path";

const getDataUrl = (file) => {
  const parser = new DataUriParser();

  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};

export default getDataUrl;
// This function takes a file path and returns a data URL representation of the file.
