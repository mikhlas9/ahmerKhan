export default function Tearsheets() {
  const tearsheets = [
    {
      id: 1,
      title: "Love Jihad Investigation",
      publication: "The Guardian",
      year: 2022,
      image: "/magazine-layout-journalism.jpg",
    },
    {
      id: 2,
      title: "Muslims Losing Rights in Assam",
      publication: "Vice News",
      year: 2022,
      image: "/news-layout-editorial.jpg",
    },
    {
      id: 3,
      title: "Rohingya Refugee Stories",
      publication: "Vice News",
      year: 2021,
      image: "/refugee-humanitarian-story.jpg",
    },
    {
      id: 4,
      title: "A School Under Metro Bridge",
      publication: "RFI",
      year: 2017,
      image: "/education-story-layout.jpg",
    },
    {
      id: 5,
      title: "Nepal Earthquake Coverage",
      publication: "Vice",
      year: 2015,
      image: "/disaster-journalism-photos.jpg",
    },
    {
      id: 6,
      title: "Kashmir Floods Documentation",
      publication: "Al Jazeera",
      year: 2014,
      image: "/natural-disaster-photography.jpg",
    },
  ]

  return (
    <section id="tearsheets" className="py-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">Tearsheets</h2>
        <p className="text-gray-600 font-light mb-12 text-lg">
          Published work and features across international media outlets
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tearsheets.map((sheet) => (
            <div key={sheet.id} className="group overflow-hidden bg-gray-200 cursor-pointer">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={sheet.image || "/placeholder.svg"}
                  alt={sheet.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 bg-white">
                <h3 className="font-light text-sm tracking-tight mb-2">{sheet.title}</h3>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>{sheet.publication}</span>
                  <span>{sheet.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
