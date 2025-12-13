import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "About",
  description: "Ahmer Khan is a multimedia journalist, filmmaker, and photographer who has spent over a decade documenting politics, conflict, migration, and humanitarian crises across South Asia.",
  url: "/about",
})

export default function AboutLayout({ children }) {
  return <>{children}</>
}
