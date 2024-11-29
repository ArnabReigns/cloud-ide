import React, { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import api from "../../utils/api";

const appContext = createContext();

const AppContexts = ({ children }) => {
	const [user, setUser] = useState(null);
	const [socket, setSocket] = useState(null);
	const [openCreatePopup, setOpenCreatePopup] = useState(false);
	const [lastOnline, setLastOnline] = useState();

	useEffect(() => {
		if (user) {
			api.get("/user-activity");
			const interval = setInterval(() => {
				api.get("/user-activity").then((e) => {
					setLastOnline(Date.now());
				});
			}, 5 * 60 * 1000);
		}

		return () => {
			clearInterval(interval);
		};
	}, []);

	useEffect(() => {
		if (user) {
			setLastOnline(user.lastActive);
		}
	}, [user]);

	function connectToSocket(port, cb = () => {}) {
		if (port) {
			if (socket) socket.disconnect();

			console.log("connecting to socket:" + port);
			const _socket = io("http://localhost:" + port);
			setSocket(_socket);
			localStorage.setItem("connected_socket_port", port);
			_socket.on("connect", () => {
				console.log("socket connection established");
				cb();
			});
		}
	}

	function socketDisconnect() {
		if (socket) socket.disconnect();
		setSocket(null);
	}

	const value = {
		user,
		setUser,
		connectToSocket,
		socket,
		socketDisconnect,
		setOpenCreatePopup,
		openCreatePopup,
		lastOnline,
	};

	return <appContext.Provider value={value}>{children}</appContext.Provider>;
};

export { appContext };
export default AppContexts;
