'use client'
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'HOME', href: '/' },
    { name: 'PROJECTS', href: '/projects' },
    { name: 'AWARDS', href: '/awards' },
    { name: 'PORTRAITS', href: '/portraits' },
    { name: 'TEARSHEETS', href: '/tearsheets' },
    { name: 'CONTACT', href: '/contact' },
  ];

 return (
    <>
      <nav className=" bg-white z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between w-full">
           

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8 mx-auto">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-[13px] font-weight-400 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden pr-2 focus:outline-none ml-auto"
              aria-label="Toggle menu"
            >
              <div className="w-7 h-6 flex flex-col justify-center gap-1.5">
                <span
                  className={`block h-0.5 w-full bg-gray-800 transition-all duration-300 ease-in-out origin-center ${
                    isOpen ? 'rotate-45 translate-y-2' : 'rotate-0'
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-gray-800 transition-all duration-300 ease-in-out ${
                    isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
                  }`}
                />
                <span
                  className={`block h-0.5 w-full bg-gray-800 transition-all duration-300 ease-in-out origin-center ${
                    isOpen ? '-rotate-45 -translate-y-2' : 'rotate-0'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay with Close Button */}
      <div
        className={`fixed inset-0 bg-white z-40 md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 p-2 focus:outline-none z-50"
          aria-label="Close menu"
        >
          <div className="w-7 h-6 flex flex-col justify-center gap-1.5">
            <span className="block h-0.5 w-full bg-gray-800 rotate-45 translate-y-1" />
            <span className="block h-0.5 w-full bg-gray-800 -rotate-45 -translate-y-1" />
          </div>
        </button>

        <div
          className={`flex flex-col items-center justify-center h-full space-y-8 transition-all duration-500 ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {menuItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`text-[20px] font-weight-400 text-gray-800 hover:text-gray-600 transition-all duration-300 ${
                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
              style={{
                transitionDelay: isOpen ? `${index * 50 + 150}ms` : '0ms',
                fontFamily: 'Cabin, sans-serif'
              }}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>

     
    </>
  );
}