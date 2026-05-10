import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@/App";
import { ThemeProvider } from "@/components/theme-provider";
import { Web3Provider } from "@/providers/web3-provider";
import "@/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Web3Provider>
        <App />
      </Web3Provider>
    </ThemeProvider>
  </StrictMode>,
);
