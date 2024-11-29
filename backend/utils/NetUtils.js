const net = require("net");

function getAvailablePort(startPort, endPort) {
	const checkPort = (port) => {
		return new Promise((resolve) => {
			const server = net.createServer();

			server.unref();
			server.on("error", () => resolve(false)); // Port is in use
			server.listen(port, () => {
				server.close();
				resolve(true); // Port is available
			});
		});
	};

	const checkPorts = async () => {
		for (let port = startPort; port <= endPort; port++) {
			const isAvailable = await checkPort(port);
			if (isAvailable) {
				return port; // Return the first available port
			}
		}
		return null; // No available port found
	};

	return checkPorts();
}

module.exports = {
	getAvailablePort,
};
