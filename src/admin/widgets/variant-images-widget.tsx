import React, { useState, useEffect } from "react";
import { defineWidgetConfig } from "@medusajs/admin-sdk";
import type { DetailWidgetProps, AdminProductVariant } from "@medusajs/framework/types";
import { Container, Heading, Button, Input } from "@medusajs/ui";
import axios from "axios";

interface VariantImage {
  id: string;
  orientation: "square" | "portrait" | "landscape" | "full";
  url: string;
}

// TEMP for dev: replace with import.meta.env.VITE_PUBLISHABLE_API_KEY later
const PUBLISHABLE_KEY =
  "pk_146b556432988641bcc85b518bd38db7fc33a01d69e241e7c65288f3e93c149a";

const VariantImagesWidget: React.FC<DetailWidgetProps<AdminProductVariant>> = ({ data }) => {
  const variantId = data.id;
  const [images, setImages] = useState<VariantImage[]>([]);
  const [orientation, setOrientation] = useState<VariantImage["orientation"]>("square");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Load existing images for this variant
  useEffect(() => {
    axios
      .get(`/store/product-variants/${variantId}/images`, {
        headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
      })
      .then((res) => setImages(res.data.images))
      .catch((err) => {
        console.error("LOAD ERR", err?.response?.status, err?.response?.data || err);
      });
  }, [variantId]);

  const handleAdd = async () => {
    try {
      let finalUrl = url.trim();

      // If a file was chosen, upload via Admin Upload API (session-auth)
      if (!finalUrl && file) {
        const fd = new FormData();
        // Admin Upload API expects 'files' field (plural)
        fd.append("files", file);
        const up = await axios.post(`/admin/uploads`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
        finalUrl = up.data?.files?.[0]?.url || "";
      }

      if (!finalUrl) {
        window.alert("Provide a URL or choose a file");
        return;
      }

      const res = await axios.post(
        `/store/product-variants/${variantId}/images`,
        { orientation, url: finalUrl },
        { headers: { "x-publishable-api-key": PUBLISHABLE_KEY } }
      );
      setImages((prev) => [...prev, res.data.image]);
      setUrl("");
      setFile(null);
    } catch (err: any) {
      console.error("ADD ERR", err?.response?.status, err?.response?.data || err);
      window.alert("Failed to add image");
    }
  };

  const handleDelete = (id: string) =>
    axios
      .delete(`/store/product-variants/${variantId}/images/${id}`, {
        headers: { "x-publishable-api-key": PUBLISHABLE_KEY },
      })
      .then(() => setImages((prev) => prev.filter((img) => img.id !== id)))
      .catch((err) => {
        console.error("DELETE ERR", err?.response?.status, err?.response?.data || err);
      });

  return (
    <Container className="p-4">
      <Heading level="h3">Variant Images</Heading>

      <section>
        <header>
          <h4>Add new image</h4>
        </header>
        <div className="flex space-x-2 items-center">
          <select value={orientation} onChange={(e) => setOrientation(e.target.value as any)}>
            {["square", "portrait", "landscape", "full"].map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          <Input
            type="url"
            placeholder="https://… (optional if file chosen)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleAdd}>Add</Button>
        </div>
      </section>

      {images.length > 0 ? (
        images.map((img) => (
          <section key={img.id}>
            <header>
              <h5>{img.orientation}</h5>
            </header>
            <div className="flex items-center space-x-2">
              <img src={img.url} alt={img.orientation} className="h-12" />
              <Button variant="danger" onClick={() => handleDelete(img.id)}>
                Delete
              </Button>
            </div>
          </section>
        ))
      ) : (
        <p>No images yet for this variant.</p>
      )}
    </Container>
  )
};

export const config = defineWidgetConfig({
  zone: "product_variant.details.after",
});

export default VariantImagesWidget;