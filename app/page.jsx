"use client"
import Image from "next/image"

export default function Home() {
  return (
    <main className="w-full bg-white">
      <div className="relative w-full" style={{ height: 'calc(100vh - 100px)' }}>
        <Image 
          src="/images/home.jpeg" 
          alt="Home" 
          fill 
          className="object-contain" 
          priority 
        />
      </div>
    </main>
  )
}
