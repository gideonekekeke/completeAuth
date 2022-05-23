const cloudinary = require("cloudinary").v2;
cloudinary.config({
	cloud_name: "giddy",
	api_key: "478564868449943",
	api_secret: "50RMyR-bHCqJu6lPYHdsWXsw_AQ",
	secure: true,
});

module.exports = cloudinary;
