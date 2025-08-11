import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import VariantImageService from "../../../../../modules/variant-image/service"
import { VARIANT_IMAGE_MODULE } from "../../../../../modules/variant-image"
import { z } from "zod"

const postSchema = z.object({
  orientation: z.enum(["square", "portrait", "landscape", "full"]),
  url: z.string().url(),
})

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { variant_id } = req.params
  const service = req.scope.resolve<VariantImageService>(VARIANT_IMAGE_MODULE)
  const images = await service.getImagesByVariant(variant_id)
  res.json({ images })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { variant_id } = req.params
  const validated = postSchema.parse(req.body)
  const service = req.scope.resolve<VariantImageService>(VARIANT_IMAGE_MODULE)
  const image = await service.addVariantImage({
    product_variant_id: variant_id,
    orientation: validated.orientation,
    url: validated.url,
  })
  res.status(201).json({ image })
}
