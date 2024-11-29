import { createRoot } from "react-dom/client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import AppContexts from "./context/AppContexts.jsx";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
	palette: {
		primary: {
			main: "#287F71",
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					fontStyle: "normal",
					textTransform: "none",
				},
				containedPrimary: {
					backgroundColor: "#287F71",
				},
			},
			defaultProps: {
				variant: "contained",
			},
			variants: [
				{
					props: {
						variant: "new-variant",
					},
					style: {},
				},
			],
		},
	},
});

createRoot(document.getElementById("root")).render(
	<GoogleOAuthProvider clientId="737563207335-t0krcot2dieno7qodb9o3ej7u9e7iga4.apps.googleusercontent.com">
		<AppContexts>
			<BrowserRouter>
				<ThemeProvider theme={theme}>
					<App />
				</ThemeProvider>
			</BrowserRouter>
		</AppContexts>
	</GoogleOAuthProvider>
);
