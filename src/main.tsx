import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Theme } from "@radix-ui/themes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme
      accentColor="crimson"
      panelBackground="translucent"
      appearance="dark"
    >
      <App />
    </Theme>
  </StrictMode>
);
