import { defineConfig } from "cypress";

interface EndToEndConfigOptions extends Cypress.ConfigOptions {
  baseUrl?: string;
  apiUrl?: string;
  setupNodeEvents(
    on: Cypress.PluginEvents,
    config: Cypress.PluginConfigOptions
  ): void;
}

export default defineConfig({
  e2e: {
    baseUrl: process.env.REACT_APP_BASE_URL,
    apiUrl: process.env.REACT_APP_API_URL,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
} as Cypress.ConfigOptions<EndToEndConfigOptions>);
