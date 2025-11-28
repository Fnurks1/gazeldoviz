'use client';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Anlık Döviz Kurları
            </h2>
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">CANLI</span>
              </div>
            </div>
          </div>

          <div className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <iframe 
              src="https://anlikaltinfiyatlari.com/doviz" 
              className="w-full border-0"
              style={{ height: '1200px', minHeight: '800px' }}
              title="Anlık Döviz Kurları"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
