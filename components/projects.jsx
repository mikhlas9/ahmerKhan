"use client"

import { useState } from "react"

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const projects = [
    {
      id: 1,
      title: "India Burning",
      outlet: "Vice News",
      year: 2020,
      category: "filmography",
      description: "Emmy-nominated film documenting communal violence in India",
      image: "/india-conflict-documentary.jpg",
    },
    {
      id: 2,
      title: "Inside India's COVID Hell",
      outlet: "Vice News",
      year: 2021,
      category: "filmography",
      description: "Emmy-nominated investigation into India's pandemic crisis",
      image: "/covid-pandemic-healthcare.jpg",
    },
    {
      id: 3,
      title: "Love Jihad",
      outlet: "TRT World",
      year: 2021,
      category: "filmography",
      description: "Exposé on a deadly religious conspiracy theory in India",
      image: "/social-conflict-investigation.jpg",
    },
    {
      id: 4,
      title: "Defending Kashmir",
      outlet: "Various",
      year: 2020,
      category: "filmography",
      description: "Human Rights Press Award-winning short film",
      image: "/kashmir-conflict-journalism.jpg",
    },
    {
      id: 5,
      title: "The Vaccine Divide",
      outlet: "The Intercept",
      year: 2021,
      category: "filmography",
      description: "Investigation into vaccine inequality during COVID-19",
      image: "/vaccine-global-health.jpg",
    },
    {
      id: 6,
      title: "Fighting to Save the Last Trams of India",
      outlet: "SCMP Films",
      year: 2022,
      category: "filmography",
      description: "Documentary on Kolkata's historic tram system",
      image: "/kolkata-trams-india-heritage.jpg",
    },
  ]

  const filteredProjects =
    selectedCategory === "all" ? projects : projects.filter((p) => p.category === selectedCategory)

  return (
    <section id="filmography" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-light mb-12 tracking-tight">Filmography</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group cursor-pointer">
              <div className="overflow-hidden bg-gray-100 mb-4 aspect-video">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-light tracking-tight hover:text-gray-600 transition-colors">
                  {project.title}
                </h3>
                <div className="flex justify-between text-sm text-gray-600 font-light">
                  <span>{project.outlet}</span>
                  <span>{project.year}</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
