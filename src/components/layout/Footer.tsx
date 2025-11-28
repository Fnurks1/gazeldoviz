'use client';

import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const businessInfo = {
    name: process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Gazel Döviz',
    address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || 'Meşrutiyet Mah. Meşrutiyet Cd. Kök Çarşı ve İş Hanı No:2/82 Kızılay, Çankaya/Ankara',
    phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+90 312 418 45 67',
    email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'info@gazeldoviz.com',
    hours: process.env.NEXT_PUBLIC_WORKING_HOURS || 'Pazartesi - Cumartesi: 09:00 - 19:00',
  };

  const footerLinks = {
    company: [
      { name: 'Hakkımızda', href: '/hakkimizda' },
      { name: 'Kurumsal', href: '/kurumsal' },
      { name: 'İletişim', href: '/iletisim' },
    ],
    services: [
      { name: 'Döviz Alım-Satım', href: '/kurlar' },
    ],
    legal: [
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-currency rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">G</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {businessInfo.name}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Güvenilir ve hızlı döviz işlemleri için profesyonel çözüm ortağınız.
            </p>
            <div className="space-y-2">
              <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{businessInfo.address}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href={`tel:${businessInfo.phone}`} className="hover:text-primary-600">
                  {businessInfo.phone}
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href={`mailto:${businessInfo.email}`} className="hover:text-primary-600">
                  {businessInfo.email}
                </a>
              </div>
              <div className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{businessInfo.hours}</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Kurumsal
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              Hizmetler
            </h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} {businessInfo.name}. Tüm hakları saklıdır.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
