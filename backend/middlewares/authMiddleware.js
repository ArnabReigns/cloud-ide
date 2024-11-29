const jwt = require("jsonwebtoken");
const User = require("../models/UserModel"); // Adjust the path as necessary

const authMiddleware = async (req, res, next) => {
	const token = req.cookies.token;

	try {
		const token = req.cookies.token;

		if (!token) {
			return res
				.status(401)
				.json({ message: "No token provided, authorization denied" });
		}

		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Fetch the user by ID
		const user = await User.findById(decoded.userId).select("-password"); // Exclude password from the returned user object

		if (!user) {
			return res
				.status(401)
				.json({ message: "User not found, authorization denied" });
		}

		// Attach the user object to the request object
		req.user = user;
		next();
	} catch (error) {
		res.status(401).json({
			message: "Invalid token, authorization denied",
			error,
		});
	}
};

module.exports = authMiddleware;
