import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { store } from "./store/store.js";

const teal = "#0e8a86";

const theme = {
  token: {
    colorPrimary: teal,
    colorInfo: teal,
    colorLink: "#0e8a86",
    colorTextBase: "#0f1b2e",
    colorTextSecondary: "#5a6b85",
    colorBgLayout: "#f4f6fa",
    colorBorder: "#e5e9f0",
    colorBorderSecondary: "#e5e9f0",
    borderRadius: 10,
    fontFamily:
      '"Archivo", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  },
  components: {
    Button: {
      colorPrimary: teal,
      colorPrimaryHover: "#0fb5ae",
      fontWeight: 600,
    },
    Table: {
      headerBg: "#eef1f7",
      headerColor: "#16243f",
      headerSplitColor: "#e5e9f0",
      rowHoverBg: "#f0faf9",
    },
    Tabs: {
      inkBarColor: teal,
      itemSelectedColor: teal,
      itemHoverColor: "#0fb5ae",
    },
    Card: {
      colorBorderSecondary: "#e5e9f0",
    },
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <App />
      </ConfigProvider>
    </Provider>
  </BrowserRouter>
);
