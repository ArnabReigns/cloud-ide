import React, { useContext, useEffect } from "react";
import { appContext } from "../context/AppContexts";

const useSocket = () => {
	const ctx = useContext(appContext);

	return { socket: ctx.socket, connectToSocket: ctx.connectToSocket };
};

export default useSocket;
