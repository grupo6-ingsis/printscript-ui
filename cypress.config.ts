import { defineConfig } from "cypress";
import dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  e2e: {
    setupNodeEvents(_, config) {
      config.env = process.env
      return config
    },
    experimentalStudio: true,
    baseUrl: process.env.FRONTEND_URL ?? "http://localhost",
      viewportWidth: 1600,   // Increase width
      viewportHeight: 1300,  // Increase height
  },
});
