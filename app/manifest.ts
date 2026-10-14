import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LeafLens",
    short_name: "LeafLens",
    description: "Photograph a leaf and get a diagnosis and a fix.",
    start_url: "/",
    display: "standalone",
    background_color: "#08170f",
    theme_color: "#08170f",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
