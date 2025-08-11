import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { z } from "zod"
import VariantImageService from "../../../../../modules/variant-image/service"
import { VARIANT_IMAGE_MODULE } from "../../../../../modules/variant-image"

const Body = z.object({
  orientation: z.enum(["square", "portrait", "landscape", "full"]),
  url: z.string().url(),
})

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { product_id } = req.params
  const svc = req.scope.resolve<VariantImageService>(VARIANT_IMAGE_MODULE)

  const images = await svc.fetchProductImages(product_id)
  res.json({ images })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { product_id } = req.params
  const svc = req.scope.resolve<VariantImageService>(VARIANT_IMAGE_MODULE)

  const { orientation, url } = Body.parse(req.body)

  const image = await svc.createProductImage({
    product_id,
    orientation,
    url,
  })

  res.status(201).json({ image })
}
