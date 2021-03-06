import { css } from "@emotion/react";
import { createTheme } from "@material-ui/core";

import { colors, palette } from "./colors";

const fontFamily = `
-apple-system, 
BlinkMacSystemFont,
"Segoe UI",
Roboto,
"Hiragino Sans",
"Noto Sans CJK JP",
sans-serif,
"Apple Color Emoji",
"Segoe UI Emoji",
"Segoe UI Symbol",
"Noto Sans Emoji"
`;

const muiTheme = createTheme({
  typography: {
    fontFamily,
  },
  palette,
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: "lg",
      },
    },
    MuiDialog: {
      defaultProps: {
        maxWidth: "lg",
      },
    },

    MuiLink: {
      defaultProps: {
        target: "_blank",
        rel: "noopener",
      },
    },
    MuiTooltip: {
      defaultProps: {
        placement: "top",
        disableInteractive: true,
      },
    },
    MuiSnackbar: {
      defaultProps: {
        autoHideDuration: 5000,
        anchorOrigin: { vertical: "top", horizontal: "right" },
      },
    },
    MuiTabs: {
      defaultProps: {
        indicatorColor: "primary",
      },
    },
    MuiCheckbox: {
      defaultProps: {
        color: "primary",
      },
    },
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },

    MuiCssBaseline: {
      styleOverrides: {
        "@global": {
          body: {
            overflowY: "hidden",
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        color: "inherit",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          minWidth: 0,
          fontWeight: 400,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: "auto",
          marginRight: 16,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "rgba(30, 30, 35)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(30, 30, 35)",
        },
      },
    },
  },
});

const isFirefox =
  process.browser && window.navigator.userAgent.includes("Firefox");

const acrylic = isFirefox
  ? css`
      background: rgba(60, 60, 70, 0.95) !important;
    `
  : css`
      background: rgba(60, 60, 70, 0.6) !important;
      backdrop-filter: blur(8px) !important;
    `;

const darkAcrylic = isFirefox
  ? css`
      background: rgba(30, 30, 35, 0.98) !important;
    `
  : css`
      background: rgba(30, 30, 35, 0.85) !important;
      backdrop-filter: blur(8px) !important;
    `;

const swappable = css`
  border-radius: 4px;

  img {
    pointer-events: none;
  }

  &.droppable {
    box-shadow: 0px 0px 2px 2px ${colors.droppable};
  }

  &.dragging {
    opacity: 0.3;
  }
`;

const styles = {
  acrylic,
  darkAcrylic,
  swappable,
};

const theme = { ...muiTheme, colors, styles };

export type Theme = typeof theme;

export default theme;
