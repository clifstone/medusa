// File: src/api/store/products/[product_id]/images/[image_id]/route.ts
import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import VariantImageService from "../../../../../../modules/variant-image/service"
import { VARIANT_IMAGE_MODULE } from "../../../../../../modules/variant-image"

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { image_id } = req.params
  const svc = req.scope.resolve<VariantImageService>(VARIANT_IMAGE_MODULE)
  await svc.deleteProductImage(image_id)
  res.status(204).send()
}
