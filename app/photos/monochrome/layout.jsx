import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Monochrome",
  description: "Monochrome photography by Ahmer Khan, capturing timeless moments in black and white.",
  url: "/photos/monochrome",
})

export default function MonochromeLayout({ children }) {
  return <>{children}</>
}
