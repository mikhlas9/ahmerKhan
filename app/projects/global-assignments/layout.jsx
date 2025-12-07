import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Global Assignments",
  description: "International reporting assignments covering conflict zones, humanitarian crises, and human rights stories across South Asia and beyond.",
  url: "/projects/global-assignments",
})

export default function GlobalAssignmentsLayout({ children }) {
  return <>{children}</>
}

