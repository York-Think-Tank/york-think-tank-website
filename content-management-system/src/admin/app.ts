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
        "Auth.form.welcome.subtitle": "Sign in to publish work to the website :)",
        "Auth.form.button.login.strapi": "Log in via YTT CMS",
        "Auth.form.register.subtitle": "Credentials are only used to authenticate in YTT CMS. All saved data will be stored in your database.",
        "Settings.application.strapi-version": "YTT CMS version",
        "Settings.application.strapiVersion": "YTT CMS version",
        "Settings.permissions.users.listview.header.subtitle": "All the users who have access to the YTT CMS admin panel",
        "app.components.BlockLink.blog.content": "Read the latest news about YTT CMS and the ecosystem.",
        "app.components.BlockLink.cloud": "YTT CMS Cloud",
        "app.components.BlockLink.cloud.content": "Fully-managed cloud hosting for your YTT CMS project.",
        "app.components.BlockLink.documentation.content": "Discover the essential concepts, guides and instructions.",
        "app.components.BlockLink.tutorial.content": "Follow step-by-step instructions to use and customize YTT CMS.",
        "app.components.FreeTrialWelcomeModal.description1": "For the next 30 days, you will have full access to advanced features like Content History, Releases and Single Sign-On (SSO) – everything you need to explore the power of YTT CMS.",
        "app.components.NpsSurvey.banner-title": "How likely are you to recommend YTT CMS to a friend or colleague?",
        "components.AutoReloadBlocker.description": "Run YTT CMS with one of the following commands:",
        "notification.ee.warning.over-.message": "Add seats to {licenseLimitStatus, select, OVER_LIMIT {invite} AT_LIMIT {re-enable}} Users. If you already did it but it's not reflected in YTT CMS yet, make sure to restart your app.",
        "notification.version.update.message": "A new version of YTT CMS is available!",
        "global.plugins.sentry.description": "Send YTT CMS error events to Sentry.",
        "tours.overview.strapiCloud.label": "Deploy your application to YTT CMS Cloud",
        "HomePage.widget.deploy-now.description": "Deploy with YTT CMS Cloud",
      },
    },
    tutorials: false,

    notifications: {
      releases: false,
    },
  },

  bootstrap() {
    document.title = "York Think Tank CMS";
  },
};