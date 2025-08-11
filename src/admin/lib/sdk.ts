import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
  baseUrl: "/", // same-origin in dev
  auth: { type: "session" }
})
