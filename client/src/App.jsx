import React, { useContext, useEffect } from "react";
import "./app.scss";
import { Box, Stack } from "@mui/material";
import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import PageNotFound from "./pages/PageNotFound";
import api from "../utils/api";
import { appContext } from "./context/AppContexts";
import Appbar from "./components/Appbar";
import Sidebar from "./components/Sidebar";
import Editor from "./pages/Editor";
import Bases from "./pages/Bases";
import Flex from "./components/utils/Flex";
import Home from "./pages/Home";
import Dev from "./pages/Dev";

const WithAppbar = () => {
	return (
		<Flex alignItems={"stretch"} gap={0}>
			<Sidebar />
			<Stack flex={1}>
				<Appbar />
				<Box p={6} flex={1}>
					<Outlet />
				</Box>
			</Stack>
		</Flex>
	);
};

const PrivateLayouts = () => {
	const ctx = useContext(appContext);

	if (ctx.user) return <Outlet />;
};

const PublicLayout = () => {
	const ctx = useContext(appContext);

	if (ctx.user) return <Navigate to={"/~"} />;

	return <Outlet />;
};

const App = () => {
	const navigate = useNavigate();
	const ctx = useContext(appContext);

	useEffect(() => {
		api.get("me")
			.then((res) => {
				console.groupCollapsed("user details");
				console.log(res.data);
				console.groupEnd();
				ctx.setUser(res.data);
			})
			.catch(() => {
				navigate("/login");
			});
	}, []);

	return (
		<Box bgcolor={"#EBECED"} height={"100vh"}>
			<Routes>
				<Route element={<PrivateLayouts />}>
					<Route element={<WithAppbar />}>
						<Route path="/~" element={<Dashboard />} />
						<Route path="/bases" element={<Bases />} />
						<Route path="/test" element={<Dev />} />
						<Route path="*" element={<PageNotFound />} />
					</Route>
					<Route path="/:userid/:codebase" element={<Editor />} />
				</Route>
				<Route element={<PublicLayout />}>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<LoginPage />} />
				</Route>
			</Routes>
		</Box>
	);
};

export default App;
