import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Portraits",
  description: "Portrait photography and country projects by Ahmer Khan, capturing human stories and cultural narratives across South Asia.",
  url: "/portraits",
})

export default function PortraitsLayout({ children }) {
  return <>{children}</>
}

