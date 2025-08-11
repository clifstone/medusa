import { model } from "@medusajs/framework/utils"

export const ProductGallery = model.define("product_gallery", {
  id: model.id().primaryKey(),
  product_id: model.text(), // FK value to the product (no cross-module relationship)
  orientation: model.enum([
    "square",
    "portrait",
    "landscape",
    "full",
  ]),
  url: model.text(),
})

export default ProductGallery
