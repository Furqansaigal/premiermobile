import React from 'react';
import { Phone, Mail, Instagram, Clock } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer-surface border-t border-border-subtle text-text-muted font-sans text-xs pt-12 sm:pt-16 pb-10 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 pb-12 sm:pb-16 border-b border-border-subtle text-left">
          
          {/* Left Column */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center">
              <Logo variant="horizontal" />
            </div>

            <p className="text-text-muted font-light leading-relaxed max-w-sm pt-2 text-xs">
              Mobile auto detailing serving San Antonio, New Braunfels, Boerne, Austin, and surrounding areas. Established in 2024. Specializing in luxury vehicle detailing and commercial fleet services.
            </p>

            <div className="flex items-center gap-2 pt-2" aria-label="Premier Mobile social media">
              <a
                href="https://www.instagram.com/premiermobile.tx/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Premier Mobile on Instagram"
                title="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-pink-400 transition-colors hover:border-pink-400/60 hover:bg-pink-500/10"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61592722244241"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Premier Mobile on Facebook"
                title="Facebook"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-blue-500 transition-colors hover:border-blue-500/60 hover:bg-blue-500/10"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.03 4.388 11.03 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97H15.83c-1.491 0-1.956.928-1.956 1.88v2.271h3.328l-.532 3.49h-2.796v8.437C19.612 23.103 24 18.103 24 12.073Z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@premiermobile.tx?_r=1&_t=ZP-98zn0xiNXpP"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Premier Mobile on TikTok"
                title="TikTok"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-cyan-400 transition-colors hover:border-cyan-400/60 hover:bg-cyan-500/10"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 1 1-2.88-2.88c.38 0 .74.08 1.07.22V9.48a6.38 6.38 0 0 0-1.07-.09A6.34 6.34 0 1 0 15.68 15.67V8.87a8.28 8.28 0 0 0 4.91 1.6V7.02a4.85 4.85 0 0 1-1-.33Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Middle Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-heading font-semibold mb-4">
              COMPANY
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#packages"
                  onClick={(e) => { e.preventDefault(); scrollToSection('packages'); }}
                  className="hover:text-accent-text transition-colors cursor-pointer"
                >
                  Packages & Pricing
                </a>
              </li>
              <li>
                <a
                  href="#areas"
                  onClick={(e) => { e.preventDefault(); scrollToSection('areas'); }}
                  className="hover:text-accent-text transition-colors cursor-pointer"
                >
                  Service Areas
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  onClick={(e) => { e.preventDefault(); scrollToSection('faq'); }}
                  className="hover:text-accent-text transition-colors cursor-pointer"
                >
                  FAQ & Guarantees
                </a>
              </li>
            </ul>
          </div>

          {/* Right Contact */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-[10px] uppercase tracking-[0.2em] text-heading font-semibold mb-4">
              CONTACT
            </h4>
            <ul className="space-y-2.5 text-text-secondary">
              <li className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-accent-text mt-0.5 shrink-0" />
                <div className="text-xs">
                  <span className="text-text-muted block text-[10px] uppercase tracking-wider">Customer Bookings</span>
                  <a href="tel:2105806738" className="text-heading hover:text-accent-text font-bold transition-colors">
                    (210) 580-6738
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <Phone className="w-3.5 h-3.5 text-accent-text mt-0.5 shrink-0" />
                <div className="text-xs">
                  <span className="text-text-muted block text-[10px] uppercase tracking-wider">Business & Contract Inquiries</span>
                  <a href="tel:2109944918" className="text-heading hover:text-accent-text font-bold transition-colors">
                    (210) 994-4918
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <Mail className="w-3.5 h-3.5 text-accent-text mt-0.5 shrink-0" />
                <div className="text-xs">
                  <span className="text-text-muted block text-[10px] uppercase tracking-wider">Official Email</span>
                  <a href="mailto:premier@premiermobiletexas.com" className="text-heading hover:text-accent-text font-bold transition-colors">
                    premier@premiermobiletexas.com
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2 pt-1 text-text-muted text-[11px]">
                <Clock className="w-3.5 h-3.5 text-accent-text" />
                <span>Mon–Sun : 7am – 8pm</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-text-faint text-[11px]">
          <p>© {new Date().getFullYear()} Premier Mobile Detailing. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-medium">
            <a
              href="https://www.instagram.com/devforge_studio/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent-text text-text-muted transition-colors cursor-pointer underline underline-offset-4 decoration-border-strong hover:decoration-accent"
            >
              Made By DevForge Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
