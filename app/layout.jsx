import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { generateMetadata as generateSEOMetadata } from "@/lib/seo"

export const metadata = generateSEOMetadata({
  title: "Ahmer Khan",
  description: "Award-winning Multimedia Journalist & Filmmaker.",
  url: "/",
})

export const viewport = {
  themeColor: "#ffffff",
  userScalable: "no",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-black font-sans antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
