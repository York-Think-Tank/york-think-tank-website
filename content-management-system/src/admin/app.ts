import logo from "./extensions/white_bulb.png";

export default {
  config: {
    auth: {
      logo,
    },

    menu: {
      logo,
    },

    
    theme: {
  light: {
    colors: {
      // Primary brand colour (Gold)
      primary100: "#faf8f0",
      primary200: "#ebe8e7",
      primary500: "#febd59",
      primary600: "#febd59",
      primary700: "#e5a84a",

      buttonPrimary500: "#febd59",
      buttonPrimary600: "#e5a84a",

      // Secondary brand colour (Burgundy)
      secondary500: "#9a0002",
      secondary600: "#9a0002",

      warning500: "#febd59",
      warning600: "#febd59",

      danger500: "#9a0002",
      danger600: "#9a0002",

      // Surfaces
      neutral0: "#faf8f0",
      neutral100: "#ebe8e7",
      neutral150: "#d0d0d0",
      neutral200: "#c5a3a4",

      // Text
      neutral800: "#030200",
      neutral900: "#030200",
    },
  },

  dark: {
    colors: {
      // Gold remains the primary highlight
      primary500: "#febd59",
      primary600: "#febd59",
      primary700: "#e5a84a",

      buttonPrimary500: "#febd59",
      buttonPrimary600: "#e5a84a",

      // Burgundy used for destructive actions
      danger500: "#9a0002",
      danger600: "#9a0002",

      // Dark surfaces
      neutral0: "#030200",
      neutral100: "#181515",
      neutral150: "#2a2525",
      neutral200: "#3a3434",

      // Text
      neutral800: "#ebe8e7",
      neutral900: "#faf8f0",
    },
  },
},

    translations: {
      en: {
        "app.components.LeftMenu.navbrand.title": "York Think Tank",

        "Auth.form.welcome.title": "York Think Tank CMS",

        "Auth.form.welcome.subtitle":
          "Sign in to publish work to the website :)",
      },
    },

    tutorials: false,

    notifications: {
      releases: false,
    },
  },

  bootstrap() {},
};