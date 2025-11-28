'use client';

import { Shield, TrendingUp, Users, Award, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: 'Güvenilirlik',
      description: 'Kurulduğumuz günden bu yana, güvenilir işlem anlayışı ve müşteri memnuniyeti ilkelerimizden ödün vermeden faaliyet göstermekteyiz.',
    },
    {
      icon: TrendingUp,
      title: 'Profesyonellik',
      description: 'Alanında uzman ve deneyimli personeliyle kurumsal ve bireysel müşterilerimize profesyonel hizmet sunmaktayız.',
    },
    {
      icon: Users,
      title: 'Müşteri Odaklılık',
      description: 'Müşteri memnuniyeti bizim için en önemli değerdir. Her zaman şeffaf, güvenilir ve avantajlı çözümler sunarız.',
    },
    {
      icon: Award,
      title: 'Kalite',
      description: 'Üstün hizmet kalitesi anlayışımızla, döviz alım satımında sektörün öncü markası olmayı hedefliyoruz.',
    },
    {
      icon: Target,
      title: 'Yenilikçilik',
      description: 'Teknolojiyi hizmet kalitemize entegre eder, finansal piyasalardaki gelişmeleri yakından takip ederiz.',
    },
    {
      icon: Heart,
      title: 'Müşteri Memnuniyeti',
      description: 'En doğru kurları, en hızlı hizmeti ve en güvenli işlem ortamını sağlayarak ilk tercih edilen marka olmak amacındayız.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Hakkımızda
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto mb-8"></div>
        </div>

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card p-8 md:p-12 mb-12">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">Gazel Döviz</span>, 
              tüm dünya ülkelerine ait para birimlerinin alım ve satımında faaliyet gösteren, 
              <span className="font-semibold"> güvenilir ve yenilikçi</span> bir döviz hizmet kuruluşudur.
            </p>
            
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
              Firmamız; kurumsal ve bireysel müşterilerine, alanında uzman ve deneyimli personeliyle 
              <span className="font-semibold"> profesyonel hizmet</span> sunmaktadır.
            </p>
            
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
              Kurulduğumuz günden bu yana, 
              <span className="font-semibold"> üstün hizmet kalitesi, güvenilir işlem anlayışı ve müşteri memnuniyeti</span> ilkelerimizden 
              ödün vermeden faaliyet göstermekteyiz.
            </p>
            
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg p-6 my-8 border-l-4 border-primary-600">
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                🎯 Amacımız
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Müşterilerimize <span className="font-semibold">en doğru kurları</span>, 
                <span className="font-semibold"> en hızlı hizmeti</span> ve 
                <span className="font-semibold"> en güvenli işlem ortamını</span> sağlayarak 
                döviz alım satımında <span className="font-semibold text-primary-600 dark:text-primary-400">ilk tercih edilen marka</span> olmaktır.
              </p>
            </div>
            
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              <span className="font-bold text-primary-600 dark:text-primary-400">Gazel Döviz</span> olarak, 
              finansal piyasalardaki gelişmeleri yakından takip eder, teknolojiyi hizmet kalitemize entegre eder ve 
              müşterilerimize her zaman <span className="font-semibold">şeffaf, güvenilir ve avantajlı çözümler</span> sunarız.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Değerlerimiz
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 hover:shadow-card-hover transition-all hover:-translate-y-1"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>


      </div>
    </div>
  );
}
