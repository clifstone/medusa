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
  /** ===== Variant Images ===== */
  async getImagesByVariant(variantId: string) {
    return this.listVariantImages({ product_variant_id: [variantId] })
  }

  async addVariantImage(data: CreateVariantImageInput) {
    const created = await this.createVariantImages(data)
    return Array.isArray(created) ? created[0] : created
  }

  async removeVariantImage(id: string) {
    return this.deleteVariantImages([id])
  }

  /** ===== Product Images ===== */
  async fetchProductImages(productId: string) {
    // NOTE: generated method name reflects the model alias 'ProductGallery'
    return this.listProductOrientedImages({ product_id: [productId] })
  }

  async createProductImage(data: CreateProductImageInput) {
    const created = await this.createProductOrientedImages(data)
    return Array.isArray(created) ? created[0] : created
  }

  async deleteProductImage(id: string) {
    return this.deleteProductOrientedImages([id])
  }
}
