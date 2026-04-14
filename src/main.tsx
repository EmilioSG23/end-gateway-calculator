/**
 * @file Application entry point.
 *
 * @remarks
 * Mounts the React application into the `#root` DOM node with
 * {@link https://react.dev/reference/react/StrictMode | StrictMode} enabled
 * to surface potential issues during development.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
