import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Films & Documentaries",
  description: "Documentary films and video journalism exploring critical stories, human rights issues, and social justice across South Asia.",
  url: "/projects/films-documentaries",
})

export default function FilmsDocumentariesLayout({ children }) {
  return <>{children}</>
}

