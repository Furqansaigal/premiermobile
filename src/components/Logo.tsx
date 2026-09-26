import React from 'react';
import { useTheme } from '../context/ThemeContext';
import logoInk from '../assets/logo-mark-ink.png';
import logoCream from '../assets/logo-mark-cream.png';

interface LogoProps {
  variant?: 'full' | 'horizontal' | 'icon' | 'badge';
  className?: string;
  iconOnlyClass?: string;
  textColor?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'horizontal',
  className = '',
  iconOnlyClass = 'w-10 h-10',
}) => {
  const { theme } = useTheme();
  const logoSrc = theme === 'light' ? logoInk : logoCream;

  if (variant === 'icon') {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden rounded-md border border-accent/30 bg-card p-1.5 ${iconOnlyClass} ${className}`}>
        <img
          src={logoSrc}
          alt="Premier Mobile Auto Detail"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <img
          src={logoSrc}
          alt="Premier Mobile Professional Auto Detail"
          className="h-16 sm:h-20 w-auto object-contain max-w-xs"
        />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <img
          src={logoSrc}
          alt="Premier Mobile Professional Auto Detail"
          className="w-64 sm:w-80 md:w-96 h-auto object-contain"
        />
      </div>
    );
  }

  // Default 'horizontal' variant for navbar & footer
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoSrc}
        alt="Premier Mobile Professional Auto Detail"
        className="h-9 sm:h-11 w-auto object-contain"
      />
    </div>
  );
};
