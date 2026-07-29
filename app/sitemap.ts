import type { MetadataRoute } from "next";

const BASE = "https://botapreco.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/rapidin",
    "/completao",
    "/historico",
    "/aprenda",
    "/sobre",
    "/como-funciona",
    "/faq",
    "/contato",
    "/privacidade",
    "/termos",
    "/cookies",
  ];

  return paths.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/aprenda" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/aprenda" ? 0.9 : 0.6,
  }));
}
