import React, { useContext, useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
// Supports weights 400-800
import "@fontsource-variable/syne";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { appContext } from "../context/AppContexts";
import Flex from "../components/utils/Flex";
import BgImg from "../assets/bg.jpg";
import logo from "../assets/logo.png";

const LoginPage = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const ctx = useContext(appContext);

	const navigate = useNavigate();

	function login() {
		api.post("auth/login/", {
			username,
			password,
		})
			.then(() => {
				api.get("me").then((res) => {
					console.groupCollapsed("user details");
					console.log(res.data);
					console.groupEnd();
					ctx.setUser(res.data);
					if (window.location.pathname == "/") navigate("/~");
				});
			})
			.catch((err) => console.log(err));
	}

	return (
		<Flex height={"100vh"}>
			<Box
				color={"white"}
				flex={1}
				height={"100vh"}
				overflow={"hidden"}
				position={"relative"}
			>
				<Stack
					sx={{
						alignItems: "center",
						position: "absolute",
						height: "100%",
						width: "100%",
						bgcolor: "#000000a0",
						p: 4,
					}}
				>
					<Flex mr={"auto"}>
						<img src={logo} height={30} />
						<Typography
							fontWeight={500}
							fontSize={"1.2rem"}
							color={"white"}
						>
							Cloud<span style={{ color: "#1baa92" }}>Base</span>
						</Typography>
					</Flex>

					<Stack
						flex={1}
						pb={10}
						alignItems={"center"}
						justifyContent={"center"}
					>
						<Typography
							fontFamily={"'Syne Variable', cursive"}
							fontSize={"3rem"}
							width={"80%"}
							// textAlign={"center"}
							lineHeight={1.1}
						>
							Where Your Ideas Take Flight in the Cloud
						</Typography>

						<Flex
							width={"80%"}
							mt={5}
							sx={{
								color: "#d1cecedb",
							}}
						>
							<Stack gap={3}>
								<Flex>
									Create, test, and launch seamlessly from
									your browser
								</Flex>
								<Flex>
									Work together in real-time with our
									Multiplayer feature
								</Flex>
							</Stack>
							<Stack gap={3}>
								<Flex>
									Enhance your workflow with smart assistance
									from Cloudbase AI.
								</Flex>
								<Flex>
									Connect with a vibrant community of top-tier
									developers
								</Flex>
							</Stack>
						</Flex>
					</Stack>
				</Stack>
				<img
					src={BgImg}
					height={"100%"}
					width={"100%"}
					style={{
						objectFit: "cover",
					}}
				/>
			</Box>
			<Stack
				flex={1.1}
				alignItems={"center"}
				justifyContent={"center"}
				bgcolor={"white"}
				height={"100vh"}
			>
				<Stack
					gap={1}
					sx={{
						width: "min(30rem, 90%)",
					}}
				>
					<Typography fontSize={'1.4rem'} mb={2} fontWeight={500}>Log in to your account</Typography>
					<TextField
						variant="filled"
						label="Username"
						type="text"
						onChange={(e) => setUsername(e.target.value)}
					/>
					<TextField
						variant="filled"
						label="Password"
						type="text"
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Button disableElevation fullWidth variant="contained" onClick={login}>
						Login
					</Button>
				</Stack>
			</Stack>
		</Flex>
	);
};

export default LoginPage;
