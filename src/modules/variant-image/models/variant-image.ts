import { model } from "@medusajs/framework/utils"

// Define the VariantImage model without DML relationships
export const VariantImage = model.define("variant_image", {
  id: model.id().primaryKey(),
  product_variant_id: model.text(),
  orientation: model.enum([
    "square",
    "portrait",
    "landscape",
    "full",
  ]),
  url: model.text(),
})

export default VariantImage