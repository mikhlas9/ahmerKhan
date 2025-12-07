import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Tearsheets",
  description: "Published work in leading international publications including National Geographic, The Guardian, BBC, Al Jazeera, and prestigious documentary film festivals.",
  url: "/tearsheets",
})

export default function TearsheetsLayout({ children }) {
  return <>{children}</>
}

