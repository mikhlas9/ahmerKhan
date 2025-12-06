"use client"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-black">

      {/* Hero section with portrait */}
      <section className="py-7 md:py-16 px-8 flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-4xl w-full space-y-12">
          {/* Name and title */}
          <div className="text-center space-y-6">
            <h1 className="text-7xl md:text-8xl font-bold tracking-wider leading-tight ">AHMER KHAN</h1>
            <p className="text-[14px] leading-[25px] font-[400] tracking-widest text-gray-600 uppercase">
              Filmmaker & Investigative Journalist
            </p>

          </div>

          {/* Professional portrait */}
          <div className="relative w-full h-80 md:h-[720px] rounded-sm overflow-hidden shadow-lg">
            <Image src="/images/image.png" alt="Ahmer Khan portrait" fill className="object-cover" priority />
          </div>


          {/* Brief bio */}
          <div className="text-center space-y-6 text-size-26px font-weight-400 leading-relaxed text-gray-700">
            <p>
              I am an award-winning independent multi-media journalist documenting
              conflict, human rights, and resilience across South Asia. <br />
              Born and raised in the heart of conflict, I found my purpose in telling
              stories that matter.<br />

              From capturing the struggles of the displaced to exposing human rights
              violations, my journey as a journalist has been about shedding light on the
              unseen. Whether through reporting, filmmaking, or investigative
              storytelling, I believe in the power of truth to spark change.<br />

              Every frame, every word, and every story I tell is a testament to resilience,
              justice, and the voices that refuse to be silenced.<br />
            </p>
            <p className="text-gray-500">Emmy nominated | Al Jazeera | BBC | DCE Director</p>
          </div>

          {/* Scroll indicator */}
          <div className="flex justify-center pt-1">
            <div className="text-center text-sm font-light text-gray-400">
              <div className="animate-bounce">↓</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
