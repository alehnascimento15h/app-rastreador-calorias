'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Sparkles } from 'lucide-react';
import { Language } from '@/lib/types';
import { getTranslation } from '@/lib/i18n';

export default function TestimonialsPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>('pt');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang) setLanguage(savedLang);
  }, []);

  const t = (key: string) => getTranslation(language, key as any);

  const testimonials = [
    {
      name: 'Maria Silva',
      avatar: '👩',
      rating: 5,
      text: t('testimonial1'),
    },
    {
      name: 'João Santos',
      avatar: '👨',
      rating: 5,
      text: t('testimonial2'),
    },
    {
      name: 'Ana Costa',
      avatar: '👩‍🦰',
      rating: 5,
      text: t('testimonial3'),
    },
  ];

  const handleStart = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-3xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{t('testimonials')}</h1>
          <p className="text-gray-400 text-lg">
            {language === 'pt' && 'Junte-se a milhares de pessoas que transformaram suas vidas'}
            {language === 'en' && 'Join thousands of people who transformed their lives'}
            {language === 'es' && 'Únete a miles de personas que transformaron sus vidas'}
          </p>
        </div>

        {/* Testimonials */}
        <div className="space-y-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-2xl p-6 transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">{testimonial.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{testimonial.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">50k+</div>
            <div className="text-gray-400 text-sm">
              {language === 'pt' && 'Usuários'}
              {language === 'en' && 'Users'}
              {language === 'es' && 'Usuarios'}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">4.9</div>
            <div className="text-gray-400 text-sm">
              {language === 'pt' && 'Avaliação'}
              {language === 'en' && 'Rating'}
              {language === 'es' && 'Calificación'}
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
            <div className="text-3xl font-bold text-white mb-2">2M+</div>
            <div className="text-gray-400 text-sm">
              {language === 'pt' && 'Refeições'}
              {language === 'en' && 'Meals'}
              {language === 'es' && 'Comidas'}
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          className="w-full py-5 rounded-2xl font-bold text-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
        >
          {t('startNow')}
        </button>

        <p className="text-center text-gray-500 text-sm mt-6">
          {language === 'pt' && '1 dia grátis • Cancele quando quiser'}
          {language === 'en' && '1 day free • Cancel anytime'}
          {language === 'es' && '1 día gratis • Cancela cuando quieras'}
        </p>
      </div>
    </div>
  );
}
