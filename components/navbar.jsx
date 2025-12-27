'use client'
import { useState, useEffect } from 'react';
import { getAbout } from '@/lib/about';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [aboutData, setAboutData] = useState(null);
  const [photosDropdownOpen, setPhotosDropdownOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAbout();
        setAboutData(data);
      } catch (error) {
        console.error('Error loading about data:', error);
      }
    }
    fetchData();
  }, []);

  const menuItems = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT', href: '/about' },
    // { name: 'PROJECTS', href: '/projects' },
    { name: 'DOCUMENTARIES', href: '/documentaries' },
    { name: 'VIDEO REPORTS', href: '/video-reports' },
    { name: 'AWARDS', href: '/awards' },
    { name: 'TEARSHEETS', href: '/tearsheets' },
    { name: 'CONTACT', href: '/contact' },
  ];

  const photosSubmenu = [
    { name: 'STORIES', href: '/photos/stories' },
    { name: 'SINGLES', href: '/photos/singles' },
    { name: 'PORTRAITS', href: '/photos/portraits' },
    { name: 'MONOCHROME', href: '/photos/monochrome' },
  ];

  const name = aboutData?.name || 'AHMER KHAN';
  const title = aboutData?.title || 'Filmmaker & Investigative Journalist';

 return (
    <>
      <nav className="bg-white z-50 border-b border-gray-200 relative">
        <div className="w-full py-5 px-4 md:px-8 lg:px-16 xl:px-24 2xl:px-30">
          <div className="flex items-center justify-between w-full gap-4">
            {/* Left Side - Name and Subtitle */}
            <div className="flex flex-col items-center flex-shrink-0">
              <Link href="/" className="group">
                <h1 className="text-2xl md:text-2xl lg:text-4xl text-gray-700 text-black tracking-wider leading-tight text-center">
                  {name}
                </h1>
                {/* <p className="text-[9px] md:text-[10px] lg:text-sm text-gray-500 mt-1 font-normal leading-tight text-center">
                  {title}
                </p> */}
              </Link>
            </div>

            {/* Desktop Menu - Right Side */}
            <div className="hidden md:flex items-center space-x-2 md:space-x-3 lg:space-x-4 flex-nowrap flex-shrink">
              {menuItems.map((item) => {
                const isVideoReports = item.name === 'VIDEO REPORTS'
                return (
                  <div key={item.name} className="flex items-center">
                <Link
                  href={item.href}
                  className="text-[12px] md:text-[13px] font-weight-400 text-gray-700 hover:text-gray-900 transition-colors duration-200 leading-tight whitespace-nowrap"
                >
                  {item.name}
                    </Link>
                    {/* Photos Dropdown - Insert after VIDEO REPORTS */}
                    {isVideoReports && (
                      <div 
                        className="relative ml-2 md:ml-3 lg:ml-4 z-50 flex items-center"
                        onMouseEnter={() => setPhotosDropdownOpen(true)}
                        onMouseLeave={() => setPhotosDropdownOpen(false)}
                      >
                        <button className="text-[12px] md:text-[13px] font-weight-400 text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-pointer leading-tight whitespace-nowrap">
                          PHOTOS
                        </button>
                        <div 
                          className={`absolute top-full left-0 transition-all duration-200 ease-in-out z-[9999] ${
                            photosDropdownOpen 
                              ? 'opacity-100 visible translate-y-0' 
                              : 'opacity-0 invisible -translate-y-1 pointer-events-none'
                          }`}
                          style={{ paddingTop: '4px' }}
                        >
                          <div className="bg-white border border-gray-200 shadow-lg py-2 min-w-[150px]">
                            {photosSubmenu.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block px-4 py-2 text-[13px] font-weight-400 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                              >
                                {subItem.name}
                </Link>
              ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Hamburger Button */}
            <button
              onClick={() => {
                setIsOpen(!isOpen)
                if (isOpen) {
                  setPhotosDropdownOpen(false)
                }
              }}
              className="md:hidden pr-1 focus:outline-none"
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
          onClick={() => {
            setIsOpen(false)
            setPhotosDropdownOpen(false)
          }}
          className="absolute top-6 right-6 p-2 focus:outline-none z-50"
          aria-label="Close menu"
        >
          <div className="w-7 h-6 flex flex-col justify-center gap-1.5">
            <span className="block h-0.5 w-full bg-gray-800 rotate-45 translate-y-1" />
            <span className="block h-0.5 w-full bg-gray-800 -rotate-45 -translate-y-1" />
          </div>
        </button>

        <div
          className={`flex flex-col items-center justify-center h-full space-y-5 transition-all duration-300 ${
            isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {menuItems.map((item, index) => {
            const isVideoReports = item.name === 'VIDEO REPORTS'
            return (
              <div key={item.name} className="flex flex-col items-center">
            <Link
              href={item.href}
              onClick={() => setIsOpen(false)}
                  className="text-[20px] font-weight-400 text-gray-800 hover:text-gray-600 transition-colors duration-200"
              style={{
                fontFamily: 'Cabin, sans-serif'
              }}
            >
              {item.name}
                </Link>
                {/* Photos Dropdown - Insert after VIDEO REPORTS */}
                {isVideoReports && (
                  <div className="flex flex-col items-center space-y-3 mt-5">
                    <button
                      onClick={() => setPhotosDropdownOpen(!photosDropdownOpen)}
                      className="flex items-center gap-2 text-[20px] font-weight-400 text-gray-800 hover:text-gray-600 transition-colors duration-200"
                      style={{
                        fontFamily: 'Cabin, sans-serif'
                      }}
                    >
                      PHOTOS
                      <svg
                        className={`w-4 h-4 transition-transform duration-200 ${
                          photosDropdownOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    <div
                      className={`flex flex-col items-center space-y-3 overflow-hidden transition-all duration-300 ${
                        photosDropdownOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      {photosSubmenu.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          onClick={() => {
                            setIsOpen(false)
                            setPhotosDropdownOpen(false)
                          }}
                          className="text-[16px] font-weight-400 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                          style={{
                            fontFamily: 'Cabin, sans-serif'
                          }}
                        >
                          {subItem.name}
            </Link>
          ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

     
    </>
  );
}