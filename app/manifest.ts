import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ananá Payroll - Web3 Payroll Automation",
    short_name: "Ananá Payroll",
    description:
      "Build trust between employers and employees through transparent smart contracts. Automate payments, earn yield, and revolutionize payroll with blockchain technology.",
    start_url: "/",
    display: "standalone",
    background_color: "#F2E2C4",
    theme_color: "#2A190F",
    icons: [
      {
        src: "/icon-pwa-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-pwa-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
