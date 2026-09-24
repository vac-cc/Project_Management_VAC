import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { installPreviewApi } from "./preview/mockApi";

if (import.meta.env.VITE_PREVIEW) installPreviewApi();

createRoot(document.getElementById("root")!).render(<App />);
