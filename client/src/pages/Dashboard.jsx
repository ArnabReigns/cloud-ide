import React, { useContext, useEffect, useState } from "react";
import { appContext } from "../context/AppContexts";
import { Box, Button, Stack, Typography } from "@mui/material";
import Flex from "../components/utils/Flex";
import api from "../../utils/api";
import { format } from "timeago.js";
const Dashboard = () => {
	const [open, setOpen] = useState(false);
	const [user, setUser] = useState(null);
	const ctx = useContext(appContext);

	useEffect(() => {
		api.get("/me").then((res) => setUser(res.data));
		document.title = "Cloudbase | home";
	}, []);
	return (
		<Stack gap={1}>
			<Flex>
				<Button
					size="small"
					color="primary"
					disableElevation
					onClick={() => ctx.setOpenCreatePopup(true)}
				>
					Create CloudBase
				</Button>
			</Flex>

			{user && (
				<>
					<Typography mt={4} mb={1} fontSize={"1.1rem"}>
						Insights
					</Typography>

					<Flex gap={2}>
						<Stack
							sx={{
								p: 2,
								bgcolor: "white",
								borderRadius: 1,
								width: "15rem",
								boxShadow: "0 5px 10px -8px #0005",
								justifyContent: "center",
							}}
						>
							<Typography>Bases</Typography>
							<Typography fontSize={"2rem"}>
								{user?.bases?.length}/3
							</Typography>
						</Stack>
					</Flex>
				</>
			)}

			{/* dialogs */}
		</Stack>
	);
};

export default Dashboard;
