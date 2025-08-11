import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import VariantImageService from "../../../../../../modules/variant-image/service"
import { VARIANT_IMAGE_MODULE } from "../../../../../../modules/variant-image"

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { image_id } = req.params
  const service = req.scope.resolve<VariantImageService>(VARIANT_IMAGE_MODULE)
  await service.removeVariantImage(image_id)
  res.status(204).send()
}