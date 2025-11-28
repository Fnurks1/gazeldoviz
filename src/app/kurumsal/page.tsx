'use client';

import { Building2, FileText, Shield, Award, CheckCircle } from 'lucide-react';

export default function CorporatePage() {
  const companyInfo = [
    { label: 'Ünvan', value: 'GAZEL DÖVİZ VE ALTIN SINIRLI YETKİLİ MÜESSESE A.Ş.' },
    { label: 'Yetki Tipi', value: 'B GRUBU SINIRLI YETKİLİ MÜESSESE' },
    { label: 'Adres', value: 'Meşrutiyet Mah. Meşrutiyet Cd. Kök Çarşısı ve İş Hanı No:2/82 Kızılay, Çankaya/Ankara' },
    { label: 'Mersis No', value: '0389193588100001' },
    { label: 'Türü', value: 'ANONİM ŞİRKET' },
    { label: 'Sicil Müdürlüğü', value: 'ANKARA TİCARET SİCİL MÜDÜRLÜĞÜ' },
    { label: 'E-Posta', value: 'info@gazeldoviz.com', type: 'email' },
    { label: 'Telefon', value: '0 312 417 84 81', type: 'phone' },
    { label: 'Oda', value: 'ANKARA TİCARET VE SANAYİ ODASI' },
    { label: 'Oda Sicil', value: '519144' },
    { label: 'Vergi Dairesi', value: 'MİTHATPAŞA' },
    { label: 'Vergi No', value: '3891935881' },
  ];

  const certifications = [
    {
      icon: Shield,
      title: 'TCMB Yetkisi',
      description: 'Türkiye Cumhuriyet Merkez Bankası tarafından yetkilendirilmiş döviz bürosuyuz.',
    },
    {
      icon: Award,
      title: 'Resmi Kayıt',
      description: 'Ankara Ticaret Sicil Müdürlüğü nezdinde kayıtlı ve denetlenen firmayız.',
    },
    {
      icon: CheckCircle,
      title: 'Yasal Uyumluluk',
      description: 'Tüm işlemlerimiz yasal düzenlemelere ve standartlara uygun olarak gerçekleştirilir.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Kurumsal Bilgiler
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-primary-600 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Resmi kayıtlar ve kurumsal kimlik bilgilerimiz
          </p>
        </div>

        {/* Corporate Info Card */}
        <div className="mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6">
              <div className="flex items-center space-x-3">
                <Building2 className="w-8 h-8 text-white" />
                <h2 className="text-3xl font-bold text-white">
                  Resmi Bilgiler
                </h2>
              </div>
            </div>
            
            <div className="p-8">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {companyInfo.map((info, index) => (
                      <tr 
                        key={index}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="py-4 px-6 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap bg-gray-50 dark:bg-gray-900/50 w-1/3">
                          {info.label}
                        </td>
                        <td className="py-4 px-6 text-gray-900 dark:text-white">
                          {info.type === 'email' ? (
                            <a 
                              href={`mailto:${info.value}`}
                              className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center space-x-2"
                            >
                              <span>{info.value}</span>
                            </a>
                          ) : info.type === 'phone' ? (
                            <a 
                              href={`tel:${info.value.replace(/\s/g, '')}`}
                              className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center space-x-2"
                            >
                              <span>{info.value}</span>
                            </a>
                          ) : (
                            <span className="font-medium">{info.value}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start space-x-3">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>Not:</strong> Yukarıdaki bilgiler resmi kayıtlara dayanmaktadır. 
                    Herhangi bir değişiklik olması durumunda lütfen bizi bilgilendiriniz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications & Compliance */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Yetki ve Sertifikalar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => {
              const Icon = cert.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-card p-6 text-center hover:shadow-card-hover transition-all hover:-translate-y-1"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {cert.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {cert.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legal Notice */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl shadow-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4 flex items-center">
            <FileText className="w-7 h-7 mr-3" />
            Yasal Uyarı
          </h3>
          <div className="space-y-3 text-gray-200">
            <p>
              • Gazel Döviz ve Altın Sınırlı Yetkili Müessese A.Ş., 5549 sayılı Suç Gelirlerinin Aklanmasının Önlenmesi Hakkında Kanun kapsamında faaliyetlerini yürütmektedir.
            </p>
            <p>
              • Müşterilerimizin kimlik tespiti ve işlem kayıtları yasal düzenlemeler çerçevesinde tutulmaktadır.
            </p>
            <p>
              • Tüm döviz alım-satım işlemleri Türkiye Cumhuriyet Merkez Bankası düzenlemelerine uygun olarak gerçekleştirilmektedir.
            </p>
            <p className="text-sm text-gray-300 mt-4">
              Bu sayfa son güncellenme tarihi: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
