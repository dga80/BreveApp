import React from 'react';

interface PragmappLogoProps {
  className?: string;
  showText?: boolean;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  textColor?: string;
}

export const PragmappLogo: React.FC<PragmappLogoProps> = ({
  className = '',
  showText = true,
  showIcon = true,
  size = 'md',
  textColor = 'text-on-surface'
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-20 h-20'
  };

  const textSizes = {
    sm: 'text-base font-bold',
    md: 'text-xl font-bold',
    lg: 'text-3xl font-bold',
    xl: 'text-5xl font-bold'
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Isotipo Pragmapp */}
      {showIcon && (
        <svg
          className={`${iconSizes[size]} shrink-0`}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M15 15C15 23.2843 21.7157 30 30 30H45V45H15V15Z" fill="#80B395" />
          <path d="M48 15H65C78.8071 15 90 26.1929 90 40C90 53.8071 78.8071 65 65 65H48V15Z" fill="#005C55" />
          <path d="M15 48H45V90H30C21.7157 90 15 83.2843 15 75V48Z" fill="#0F766E" />
          <path d="M48 48H65C78.8071 48 90 59.1929 90 73C90 73 90 90 73 90H48V48Z" fill="#94C5A9" />
          <path d="M48 15L60 48L90 48L64 64L75 90L48 70L21 90L32 64L6 48L36 48L48 15Z" fill="#FFFFFF" />
        </svg>
      )}

      {/* Marca Nominativa */}
      {showText && (
        <span className={`font-heading tracking-tight ${textSizes[size]} ${textColor}`}>
          Pragmapp
        </span>
      )}
    </div>
  );
};
