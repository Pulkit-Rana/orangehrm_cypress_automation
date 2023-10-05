const { defineConfig } = require("cypress")

module.exports = defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  extraSmall: {
    viewportWidth: 375,
    viewportHeight: 667,
  },
  small: {
    viewportWidth: 390,
    viewportHeight: 844,
  },
  medium: {
    viewportWidth: 1280,
    viewportHeight: 960,
  },
  large: {
    viewportWidth: 1600,
    viewportHeight: 900,
  },
  screenshotsFolder: "Test/screenshots",
  videosFolder: "Test/videos",
  fixturesFolder: "Test/fixtures",
  e2e: {
    baseUrl: "https://opensource-demo.orangehrmlive.com/",
    specPattern: "Test/testcases/**/*",
    supportFile: "Test/support/e2e.js",
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
  env: {
    info: "real secret keys should be long and random",
    userName: "Admin",
    password:
      "96684d31cb9371a511890953aec9f4359c7e32ee00935bf687a0c7e28899766abaaca7b1bdef9dcd018409dd1d8b9866BXaTXTWmWOY4I3N5MX0d7g==",
  },
})
