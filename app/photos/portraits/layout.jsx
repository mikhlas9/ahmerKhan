import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Portraits",
  description: "Portrait photography by Ahmer Khan, capturing human stories and cultural narratives.",
  url: "/photos/portraits",
})

export default function PhotosPortraitsLayout({ children }) {
  return <>{children}</>
}
