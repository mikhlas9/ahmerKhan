import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Contact",
  description: "Get in touch with Ahmer Khan for media inquiries, collaboration opportunities, or speaking engagements.",
  url: "/contact",
})

export default function ContactLayout({ children }) {
  return <>{children}</>
}

