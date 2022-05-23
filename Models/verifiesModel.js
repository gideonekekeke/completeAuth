const mongoose = require("mongoose");
const verifySchema = mongoose.Schema(
	{
		token: {
			type: String,
		},
		userID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "users",
		},
	},
	{ timestamps: true },
);

module.exports = mongoose.model("verifies", verifySchema);
