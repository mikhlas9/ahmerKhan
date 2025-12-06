export default function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16 px-6 bg-white">
      <div className="max-w-4xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-light tracking-tight text-balance">AHMER KHAN</h1>
          <p className="text-lg md:text-xl text-gray-600 font-light tracking-wide">MULTIMEDIA JOURNALIST & FILMMAKER</p>
          <p className="text-sm text-gray-500 tracking-wide">INVESTIGATIVE STORYTELLER | SOUTH ASIA</p>
        </div>

        <p className="text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto font-light">
          Award-winning journalist covering conflict, humanitarian crisis, human rights and migration in South Asia
          through film and visual storytelling.
        </p>

        <div className="pt-8">
          <a
            href="#about"
            className="inline-block text-sm tracking-wider hover:text-gray-600 transition-colors border-b border-black pb-2"
          >
            EXPLORE WORK
          </a>
        </div>
      </div>
    </section>
  )
}
