import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Print & Digital Features",
  description: "Investigative journalism and feature stories published in leading international publications, covering conflict, humanitarian issues, and human rights.",
  url: "/projects/print-digital-features",
})

export default function PrintDigitalFeaturesLayout({ children }) {
  return <>{children}</>
}

