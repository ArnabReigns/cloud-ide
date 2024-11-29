import { Button, Stack } from "@mui/material";
import React, { useContext } from "react";
import { appContext } from "../context/AppContexts";

const Dev = () => {
	const ctx = useContext(appContext);
	return (
		<Stack>
			<Button
				size="small"
				color="primary"
				fullWidth
				sx={{
					width: "fit-content",
				}}
				onClick={() => ctx.connectToSocket(5000)}
			>
				Connect to dev socket
			</Button>
		</Stack>
	);
};

export default Dev;
