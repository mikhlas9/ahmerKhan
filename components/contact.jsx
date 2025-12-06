export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 bg-white">
      <div className="max-w-2xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight">Get in Touch</h2>
          <p className="text-gray-600 font-light text-lg">
            Available for commissions, collaborations, and speaking engagements
          </p>
        </div>

        <div className="space-y-4 text-lg">
          <a
            href="mailto:ahmer@ahmerkhan.com"
            className="inline-block hover:text-gray-600 transition-colors border-b border-black pb-2"
          >
            CONTACT@AHMERKHAN.COM
          </a>
        </div>

        <div className="space-y-4 text-sm text-gray-600">
          <p>Based in Kashmir | Available for international assignments</p>
        </div>

        <div className="pt-12 border-t border-gray-200 flex justify-center gap-8 text-sm">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 transition-colors"
          >
            TWITTER
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 transition-colors"
          >
            INSTAGRAM
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-600 transition-colors"
          >
            LINKEDIN
          </a>
        </div>

        <div className="text-xs text-gray-500 pt-8">
          <p>© 2025 Ahmer Khan. All rights reserved.</p>
        </div>
      </div>
    </section>
  )
}
