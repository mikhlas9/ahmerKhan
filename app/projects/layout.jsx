import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Projects",
  description: "Documenting conflict, resilience, and human stories through investigative journalism and visual storytelling.",
  url: "/projects",
})

export default function ProjectsLayout({ children }) {
  return <>{children}</>
}

