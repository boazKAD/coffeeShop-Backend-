const cloudinary = require("cloudinary").v2;
// import cloudinary from "cloudinary".

cloudinary.config({
  cloud_name:
    process.env.NODE_ENV === "production"
      ? process.env.CLOUDINARY_NAME_PROD
      : process.env.CLOUDINARY_NAME,
  api_key:
    process.env.NODE_ENV === "production"
      ? process.env.CLOUDINARY_API_KEY_PROD
      : process.env.CLOUDINARY_API_KEY,
  api_secret:
    process.env.NODE_ENV === "production"
      ? process.env.CLOUDINARY_API_SECRET_PROD
      : process.env.CLOUDINARY_API_SECRET,
});
export default cloudinary;
