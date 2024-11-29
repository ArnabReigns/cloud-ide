const express = require("express");
const User = require("../models/UserModel");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Register a new user
router.post("/register", async (req, res) => {
	const { fullName, username, email, password } = req.body;

	try {
		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ message: "Username already exists" });
		}

		const newUser = new User({ fullName, username, email, password });
		await newUser.save();

		res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error registering user", error });
	}
});

// Login a user
router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	try {
		const user = await User.findOne({ username });
		if (!user) {
			return res.status(400).json({ message: "User not found" });
		}

		const isMatch = await user.comparePassword(password);
		if (isMatch) {
			// Generate JWT token
			const token = jwt.sign(
				{ userId: user._id, username: user.username },
				process.env.JWT_SECRET,
				{ expiresIn: "7d" }
			);

			// Set HTTP-only cookie
			res.cookie("token", token, {
				httpOnly: true,
				sameSite: "lax", // restricts cookie to same site
				maxAge: 604800000,
			});

			return res.status(200).json({ message: "Login successful" });
		} else {
			return res.status(400).json({ message: "Invalid credentials" });
		}
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Error logging in", error });
	}
});

router.get("/logout", (req, res) => {
	res.clearCookie("token", {
		httpOnly: true,
		sameSite: "lax",
		maxAge: 0, // This will expire the cookie
	});

	return res.status(200).json({ message: "Logout successful" });
});

module.exports = router;
