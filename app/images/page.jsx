"use client"
import Image from "next/image"

export default function Images() {
  return (
    <main className="min-h-screen bg-white text-black">
      {/* Images Section */}
      <section className="py-10 md:py-16 px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* First Image */}
            <div className="relative w-full">
              <Image
                src="/images/img.jpeg"
                alt="Image 1"
                width={800}
                height={600}
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
            
            {/* Second Image */}
            <div className="relative w-full">
              <Image
                src="/images/img2.jpeg"
                alt="Image 2"
                width={800}
                height={600}
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

