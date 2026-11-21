import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

// No StrictMode: it would start every live call twice in development.
createRoot(document.getElementById("root")!).render(<App />);
