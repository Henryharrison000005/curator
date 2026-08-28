import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider, theme } from "antd";
import { store } from "./store/store.js";

const accent = "#ccff00";
const darkBg = "#0a0a0a";
const darkSurface = "#141414";
const darkSurface2 = "#1e1e1e";
const darkBorder = "#2a2a2a";
const cream = "#f5f0e8";
const muted = "#9a938a";

const antdTheme = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: accent,
    colorInfo: accent,
    colorSuccess: "#4ade80",
    colorWarning: "#f5a524",
    colorError: "#ff4d4d",
    colorLink: accent,
    colorText: cream,
    colorTextSecondary: muted,
    colorBgContainer: darkSurface,
    colorBgElevated: darkSurface2,
    colorBgLayout: darkBg,
    colorBorder: darkBorder,
    colorBorderSecondary: darkBorder,
    borderRadius: 2,
    fontFamily: '"Archivo", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
    fontSize: 14,
    controlHeight: 36,
    wireframe: true,
  },
  components: {
    Button: {
      colorPrimary: accent,
      colorPrimaryHover: "#b8e600",
      algorithm: true,
      fontWeight: 600,
      defaultBg: darkSurface2,
      defaultBorderColor: "#3a3a3a",
      defaultColor: cream,
    },
    Table: {
      colorBgContainer: darkSurface,
      headerBg: darkSurface2,
      headerColor: cream,
      headerSplitColor: darkBorder,
      rowHoverBg: darkSurface2,
      borderColor: darkBorder,
      colorText: cream,
    },
    Tabs: {
      inkBarColor: accent,
      itemSelectedColor: accent,
      itemHoverColor: "#f5f0e8",
      itemColor: muted,
      cardBg: darkSurface,
    },
    Card: {
      colorBgContainer: darkSurface,
      colorBorderSecondary: darkBorder,
    },
    Modal: {
      contentBg: darkSurface,
      headerBg: darkSurface,
      titleColor: cream,
    },
    Input: {
      colorBgContainer: darkSurface2,
      colorBorder: darkBorder,
      activeBorderColor: accent,
      hoverBorderColor: "#3a3a3a",
      colorText: cream,
      colorTextPlaceholder: "#6b6560",
    },
    Select: {
      colorBgContainer: darkSurface2,
      colorBorder: darkBorder,
      optionSelectedBg: darkSurface2,
      optionActiveBg: darkSurface2,
    },
    Tag: {
      colorBgContainer: darkSurface2,
    },
    Descriptions: {
      colorBgContainer: darkSurface,
      labelColor: muted,
      colorText: cream,
    },
    Message: {
      contentBg: darkSurface,
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
