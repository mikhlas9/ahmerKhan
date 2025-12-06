import { Twitter, Instagram, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { 
      name: 'X (Twitter)', 
      icon: Twitter, 
      href: 'https://twitter.com',
      ariaLabel: 'Follow on X (Twitter)'
    },
    { 
      name: 'Instagram', 
      icon: Instagram, 
      href: 'https://instagram.com',
      ariaLabel: 'Follow on Instagram'
    },
    { 
      name: 'LinkedIn', 
      icon: Linkedin, 
      href: 'https://linkedin.com',
      ariaLabel: 'Connect on LinkedIn'
    },
    { 
      name: 'Vimeo', 
      icon: ({ className }) => (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M23 7s-.2-1.4-.9-2c-.8-.8-1.7-.8-2.1-.9C17.3 4 12 4 12 4s-5.3 0-8 .1c-.4.1-1.3.1-2.1.9-.7.6-.9 2-.9 2S1 8.7 1 10.4v1.6c0 1.7.1 3.4.1 3.4s.2 1.4.9 2c.8.8 1.9.8 2.4.9 1.7.1 7.6.2 7.6.2s5.3 0 8-.2c.4-.1 1.3-.1 2.1-.9.7-.6.9-2 .9-2s.1-1.7.1-3.4v-1.6c0-1.7-.1-3.4-.1-3.4z"/>
          <path d="m10 15 5.2-3L10 9v6z"/>
        </svg>
      ),
      href: 'https://vimeo.com',
      ariaLabel: 'Watch on Vimeo'
    },
    { 
      name: 'Email', 
      icon: Mail, 
      href: 'mailto:contact@ahmerkhan.com',
      ariaLabel: 'Send an email'
    },
  ];



  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-8">
       

          {/* Social Icons */}
          <div className="flex gap-6 items-center">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  aria-label={social.ariaLabel}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>

          

          {/* Copyright */}
          <div className="text-xs font-light text-gray-500 text-center">
            © {currentYear} Ahmer Khan. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}