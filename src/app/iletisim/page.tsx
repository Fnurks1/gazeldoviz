'use client';

import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  const businessInfo = {
    name: process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Gazel Döviz',
    address: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || 'Meşrutiyet Mah. Meşrutiyet Cd. Kök Çarşı ve İş Hanı No:2/82 Kızılay, Çankaya/Ankara',
    phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || '+90 312 418 45 67',
    email: process.env.NEXT_PUBLIC_BUSINESS_EMAIL || 'info@gazeldoviz.com',
    hours: process.env.NEXT_PUBLIC_WORKING_HOURS || 'Pazartesi - Cumartesi: 09:00 - 19:00',
    lat: parseFloat(process.env.NEXT_PUBLIC_BUSINESS_LAT || '39.9208'),
    lng: parseFloat(process.env.NEXT_PUBLIC_BUSINESS_LNG || '32.8541'),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            İletişim
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Sorularınız için bize ulaşın. Size en kısa sürede geri dönüş yapacağız.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Info Cards */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 hover:shadow-card-hover transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Adres
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {businessInfo.address}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 hover:shadow-card-hover transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Telefon
            </h3>
            <a
              href={`tel:${businessInfo.phone}`}
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              {businessInfo.phone}
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 hover:shadow-card-hover transition-shadow">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              E-posta
            </h3>
            <a
              href={`mailto:${businessInfo.email}`}
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              {businessInfo.email}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Google Maps */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card overflow-hidden">
            <div className="h-96">
              <iframe
                src="https://maps.google.com/maps?q=39.9208,32.8541&hl=tr&z=18&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Gazel Döviz Konumu - Meşrutiyet Mah. Kızılay, Ankara"
              />
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-8">
            <div className="flex items-center mb-6">
              <Clock className="w-6 h-6 text-primary-600 dark:text-primary-400 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Çalışma Saatleri
              </h2>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Pazartesi:</span>
                <span className="font-medium text-gray-900 dark:text-white">09:00 - 19:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Salı:</span>
                <span className="font-medium text-gray-900 dark:text-white">09:00 - 19:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Çarşamba:</span>
                <span className="font-medium text-gray-900 dark:text-white">09:00 - 19:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Perşembe:</span>
                <span className="font-medium text-gray-900 dark:text-white">09:00 - 19:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Cuma:</span>
                <span className="font-medium text-gray-900 dark:text-white">09:00 - 19:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Cumartesi:</span>
                <span className="font-medium text-gray-900 dark:text-white">09:00 - 19:00</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                <span className="text-gray-600 dark:text-gray-400">Pazar:</span>
                <span className="font-medium text-red-600 dark:text-red-400">Kapalı</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
