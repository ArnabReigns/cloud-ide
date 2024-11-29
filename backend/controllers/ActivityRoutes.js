const express = require("express");
const User = require("../models/UserModel");
const router = express.Router();

router.get("/", async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		if (user) {
			user.lastActive = new Date();
			await user.save();
			console.log("Updated last activity for " + req.user.username);
			res.status(200).json({ status: "Activity updated" });
		} else {
			res.status(404).send({ error: "User not found" });
		}
	} catch (error) {
		console.error("Error updating activity:", error);
		res.status(500).send({ error: "Server Error" });
	}
});

// Function to check inactive users
const checkInactiveUsers = async () => {
	try {
		const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);
		const inactiveUsers = await User.find({
			lastActive: { $lt: twentyMinutesAgo },
		});

		// Trigger the function for each inactive user
		inactiveUsers.forEach((user) => {
			// Replace this with your desired action
			console.log(
				`User ${user._id} is inactive for more than 20 minutes.`
			);
			// YourFunction(user); // Call your function here
		});
	} catch (error) {
		console.error("Error checking inactive users:", error);
	}
};

// Set the interval to run the check every 15 minutes
// setInterval(checkInactiveUsers, 15 * 60 * 1000);

module.exports = router;
