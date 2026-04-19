import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { LoginProvider } from "./context/LoginContext";
import { ScrollProvider } from "./context/ScrollContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <ScrollProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <LoginProvider>
          <App />
        </LoginProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ScrollProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
