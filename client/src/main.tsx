import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import 'react-calendar/dist/Calendar.css';
import { ErrorBoundary } from "./components/ErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
