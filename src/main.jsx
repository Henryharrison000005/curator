import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import { store } from "./store/store.js";

const accent = "#c4622d";
const warmBg = "#faf7f2";
const warmSurface = "#ffffff";
const warmSurface2 = "#f4f1ec";
const warmBorder = "#e5e0d8";
const warmBorder2 = "#d4cfc6";
const espresso = "#2d2a24";
const muted = "#7a756d";

const antdTheme = {
  token: {
    colorPrimary: accent,
    colorInfo: accent,
    colorSuccess: "#5a8a3c",
    colorWarning: "#c49a2d",
    colorError: "#b83a2a",
    colorLink: accent,
    colorText: espresso,
    colorTextSecondary: muted,
    colorBgContainer: warmSurface,
    colorBgElevated: warmSurface,
    colorBgLayout: warmBg,
    colorBorder: warmBorder,
    colorBorderSecondary: warmBorder,
    borderRadius: 3,
    fontFamily: '"DM Sans", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
    fontSize: 14,
    controlHeight: 36,
  },
  components: {
    Button: {
      colorPrimary: accent,
      colorPrimaryHover: "#a85225",
      fontWeight: 600,
      defaultBg: warmSurface,
      defaultBorderColor: warmBorder,
      defaultColor: espresso,
    },
    Table: {
      colorBgContainer: warmSurface,
      headerBg: warmSurface2,
      headerColor: espresso,
      headerSplitColor: warmBorder,
      rowHoverBg: warmSurface2,
      borderColor: warmBorder,
      colorText: espresso,
    },
    Tabs: {
      inkBarColor: accent,
      itemSelectedColor: accent,
      itemHoverColor: espresso,
      itemColor: muted,
    },
    Card: {
      colorBgContainer: warmSurface,
      colorBorderSecondary: warmBorder,
    },
    Modal: {
      contentBg: warmSurface,
      headerBg: warmSurface,
      titleColor: espresso,
    },
    Input: {
      colorBgContainer: warmSurface,
      colorBorder: warmBorder,
      activeBorderColor: accent,
      hoverBorderColor: warmBorder2,
      colorText: espresso,
      colorTextPlaceholder: "#a6a199",
    },
    Select: {
      colorBgContainer: warmSurface,
      colorBorder: warmBorder,
      optionSelectedBg: warmSurface2,
      optionActiveBg: warmSurface2,
    },
    Tag: {
      colorBgContainer: warmSurface2,
    },
    Descriptions: {
      colorBgContainer: warmSurface,
      labelColor: muted,
      colorText: espresso,
    },
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <ConfigProvider theme={antdTheme}>
        <App />
      </ConfigProvider>
    </Provider>
  </BrowserRouter>
);
