import { MedusaService } from "@medusajs/framework/utils"
import VariantImage from "./models/variant-image"

type CreateVariantImageInput = {
  product_variant_id: string
  orientation: "square" | "portrait" | "landscape" | "full"
  url: string
}

export default class VariantImageService extends MedusaService({
  VariantImage,
}) {
  /** Fetch all images for a given product variant */
  async getImagesByVariant(variantId: string) {
    return this.listVariantImages({ product_variant_id: [variantId] })
  }

  /** Add a new image to a variant */
  async addVariantImage(data: CreateVariantImageInput) {
    return this.createVariantImages(data)
  }

  /** Remove an image by its ID */
  async removeVariantImage(id: string) {
    return this.deleteVariantImages(id)
  }
}
