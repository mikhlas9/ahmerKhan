import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Awards & Recognition",
  description: "Awards and recognition received by Ahmer Khan for outstanding work in investigative journalism, documentary filmmaking, and multimedia storytelling.",
  url: "/awards",
})

export default function AwardsLayout({ children }) {
  return <>{children}</>
}

