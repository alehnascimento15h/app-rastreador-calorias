'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import { Language } from '@/lib/types';

export default function SplashScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

  const languages = [
    { code: 'pt' as Language, name: 'Português', flag: '🇧🇷' },
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'hi' as Language, name: 'हिन्दी', flag: '🇮🇳' },
  ];

  const handleContinue = () => {
    if (selectedLanguage) {
      localStorage.setItem('language', selectedLanguage);
      router.push('/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-3xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-2xl">
          <span className="text-4xl font-bold text-white">AI</span>
        </div>
        <h1 className="text-5xl font-bold text-white mb-2">AI BR</h1>
        <p className="text-xl text-gray-400">Rastreador de Calorias</p>
      </div>

      {/* Language Selection Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-2xl">
            <Globe className="w-8 h-8 text-emerald-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
          Selecione seu idioma
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Select your language • अपनी भाषा चुनें
        </p>

        {/* Language Options */}
        <div className="space-y-3 mb-8">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300 ${
                selectedLanguage === lang.code
                  ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-cyan-50 shadow-lg scale-105'
                  : 'border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{lang.flag}</span>
                <span className={`text-lg font-semibold ${
                  selectedLanguage === lang.code ? 'text-emerald-700' : 'text-gray-700'
                }`}>
                  {lang.name}
                </span>
              </div>
              {selectedLanguage === lang.code && (
                <div className="p-1 bg-emerald-500 rounded-full">
                  <Check className="w-5 h-5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedLanguage}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
            selectedLanguage
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-xl hover:shadow-2xl hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continuar • Continue • जारी रखें
        </button>
      </div>

      {/* Footer */}
      <p className="mt-8 text-gray-500 text-sm">
        Powered by AI Technology
      </p>
    </div>
  );
}
