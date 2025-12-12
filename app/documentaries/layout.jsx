import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Documentaries",
  description: "Documentary films and video journalism exploring critical stories, human rights issues, and social justice across South Asia.",
  url: "/documentaries",
})

export default function DocumentariesLayout({ children }) {
  return <>{children}</>
}

