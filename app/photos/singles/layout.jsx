import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Singles",
  description: "Single photographs by Ahmer Khan, capturing moments and stories.",
  url: "/photos/singles",
})

export default function SinglesLayout({ children }) {
  return <>{children}</>
}
