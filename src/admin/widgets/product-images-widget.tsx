import React, { useEffect, useState } from "react"
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { DetailWidgetProps } from "@medusajs/framework/types"
import { Container, Heading, Button, Input } from "@medusajs/ui"
import axios from "axios"

interface ProductImage {
  id: string
  orientation: "square" | "portrait" | "landscape" | "full"
  url: string
}

// TODO: replace with import.meta.env.VITE_PUBLISHABLE_API_KEY later
const PUBLISHABLE_KEY =
  "pk_146b556432988641bcc85b518bd38db7fc33a01d69e241e7c65288f3e93c149a"

const ProductImagesWidget: React.FC<DetailWidgetProps<{ id: string }>> = ({ data }) => {
  const productId = data.id
  const [images, setImages] = useState<ProductImage[]>([])
  const [orientation, setOrientation] = useState<ProductImage["orientation"]>("square")
  const [url, setUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    axios
      .get(`/store/products/${productId}/images`, {
        headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
      })
      .then((res) => setImages(res.data.images))
      .catch((err) => console.error("PRODUCT IMAGES LOAD ERR", err?.response?.status, err?.response?.data || err))
  }, [productId])

  const handleAdd = async () => {
    try {
      let finalUrl = url

      // Prefer upload if a file is provided and URL is empty
      if (!finalUrl && file) {
        const fd = new FormData()
        // Admin Upload API expects "files"
        fd.append("files", file)
        const up = await axios.post(`/admin/uploads`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
          // admin session cookie authenticates this request
        })
        // Try common shapes returned by the file module
        finalUrl =
          up.data?.files?.[0]?.url ??
          up.data?.uploads?.[0]?.url ??
          up.data?.file?.url ??
          up.data?.url
      }

      if (!finalUrl) {
        window.alert("Provide a URL or choose a file")
        return
      }

      const res = await axios.post(
        `/store/products/${productId}/images`,
        { orientation, url: finalUrl },
        { headers: { "x-publishable-api-key": PUBLISHABLE_KEY } }
      )

      setImages((prev) => [...prev, res.data.image])
      setUrl("")
      setFile(null)
    } catch (err: any) {
      console.error("PRODUCT IMAGE ADD ERR", err?.response?.status, err?.response?.data || err)
      window.alert("Failed to add image")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/store/products/${productId}/images/${id}`, {
        headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
      })
      setImages((prev) => prev.filter((img) => img.id !== id))
    } catch (err: any) {
      console.error("PRODUCT IMAGE DELETE ERR", err?.response?.status, err?.response?.data || err)
      window.alert("Failed to remove image")
    }
  }

  return (
    <Container className="p-4">
      <Heading level="h3">Product Images</Heading>

      <section className="mb-3">
        <h4>Add new image</h4>
        <div className="flex space-x-2 items-center">
          <select value={orientation} onChange={(e) => setOrientation(e.target.value as any)}>
            {["square", "portrait", "landscape", "full"].map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          <Input
            type="url"
            placeholder="https://…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />

          <Button onClick={handleAdd}>Add</Button>
        </div>
      </section>

      {images.length ? (
        images.map((img) => (
          <section key={img.id} className="mb-3">
            <h5>{img.orientation}</h5>
            <div className="flex items-center space-x-2">
              <img src={img.url} alt={img.orientation} className="h-12" />
              <Button variant="danger" onClick={() => handleDelete(img.id)}>Delete</Button>
            </div>
          </section>
        ))
      ) : (
        <p>No images yet for this product.</p>
      )}
    </Container>
  )
}

// Inject on the product detail page
export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductImagesWidget
