import React, { useEffect, useState } from 'react';
import { PragmappLogo } from './PragmappLogo';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFade(true);
    }, 1200);

    const timer2 = setTimeout(() => {
      onFinish();
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  return (
    <div
      onClick={onFinish}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface transition-opacity duration-300 cursor-pointer ${
        fade ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center space-y-4 text-center px-4">
        <div className="p-6 bg-surface-container-lowest rounded-3xl shadow-lg border border-surface-container-highest flex items-center justify-center">
          <PragmappLogo size="xl" showText={false} />
        </div>

        <div>
          <h1 className="font-heading font-bold text-3xl sm:text-4xl text-on-surface tracking-tight">
            Pragmapp
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant font-medium mt-1">
            Consultoría & Terapia Breve Estratégica
          </p>
        </div>

        <div className="pt-6 flex items-center space-x-1.5">
          <span className="w-2.5 h-2.5 bg-primary rounded-full animate-ping"></span>
        </div>
      </div>

      <div className="absolute bottom-6 text-[11px] text-on-surface-variant/60 font-medium">
        Terapia Breve Estratégica • Maribel Martínez Domínguez
      </div>
    </div>
  );
};
