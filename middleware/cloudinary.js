const cloudinary = require("cloudinary");
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
  cloud_name: "dsz9ubikh",
  api_key: "357398264329839",
  api_secret: "usTT2ILkqMDm-TCt6X7E9xupa94",
});

module.exports = cloudinary;
