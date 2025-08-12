// File: src/modules/variant-image/service.ts
import { MedusaService } from "@medusajs/framework/utils"
import VariantImage from "./models/variant-image"
import ProductOrientedImage from "./models/product-gallery"

type Orientation = "square" | "portrait" | "landscape" | "full"

type CreateVariantImageInput = {
  product_variant_id: string
  orientation: Orientation
  url: string
}

type CreateProductImageInput = {
  product_id: string
  orientation: Orientation
  url: string
}

export default class VariantImageService extends MedusaService({
  VariantImage,
  ProductOrientedImage,
}) {
  // ===== Variant =====
  async getImagesByVariant(variantId: string) {
    return this.listVariantImages({ product_variant_id: [variantId] })
  }

  async addVariantImage(data: CreateVariantImageInput) {
    const created = await this.createVariantImages(data)
    return Array.isArray(created) ? created[0] : created
  }

  async removeVariantImage(id: string) {
    // works today for you, leaving as-is
    return this.deleteVariantImages([id])
  }

  // ===== Product =====
  async fetchProductImages(productId: string) {
    return this.listProductOrientedImages({ product_id: [productId] })
  }

  async createProductImage(data: CreateProductImageInput) {
    const created = await this.createProductOrientedImages(data)
    return Array.isArray(created) ? created[0] : created
  }

  async deleteProductImage(id: string) {
    // Some generators accept string[], others want a filter object.
    // Try ids array first, then gracefully fall back.
    try {
      return await this.deleteProductOrientedImages([id])
    } catch {
      return this.deleteProductOrientedImages({ id: [id] } as any)
    }
  }
}
