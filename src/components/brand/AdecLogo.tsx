import React, { useState } from 'react';
import { brandConfig } from '@/config/brand';
import { cn } from '@/lib/utils';

interface AdecLogoProps {
  className?: string;
  imgClassName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'card' | 'plain';
}

export const AdecLogo: React.FC<AdecLogoProps> = ({
  className,
  imgClassName,
  size = 'md',
  variant = 'plain',
}) => {
  const [imageError, setImageError] = useState(false);

  // Tailles agrandies pour une visibilité optimale et nette
  const sizeClasses = {
    sm: 'h-8 sm:h-9 max-w-[120px]',
    md: 'h-12 sm:h-14 max-w-[190px]',
    lg: 'h-16 sm:h-20 max-w-[260px]',
    xl: 'h-24 sm:h-28 max-w-[320px]',
  };

  const cardPadding = {
    sm: 'px-3 py-1.5 rounded-xl',
    md: 'px-6 py-3 rounded-2xl shadow-sm',
    lg: 'px-8 py-4 rounded-3xl shadow-md',
    xl: 'px-10 py-5 rounded-3xl shadow-lg',
  };

  // Logo SVG de secours vectoriel et haute définition
  const FallbackLogo = () => (
    <div className="flex items-center justify-center font-sans select-none">
      <svg
        viewBox="0 0 180 65"
        className={cn('w-auto h-full', sizeClasses[size])}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Arc gris courbé traversant */}
        <path
          d="M 18 42 Q 75 52 160 24"
          stroke="#94A3B8"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Accent orange sur la barre du A */}
        <path
          d="M 42 27 Q 52 24 62 26"
          stroke="#EA580C"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Texte Adec */}
        <text
          x="14"
          y="46"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="46"
          fill="#139BD7"
          letterSpacing="-1.5"
        >
          Adec
        </text>
      </svg>
    </div>
  );

  const content = imageError ? (
    <FallbackLogo />
  ) : (
    <img
      src={brandConfig.logoUrl}
      alt={brandConfig.orgName}
      onError={() => setImageError(true)}
      className={cn(
        'w-auto object-contain transition-all duration-200 block drop-shadow-xs',
        sizeClasses[size],
        imgClassName
      )}
      loading="eager"
    />
  );

  if (variant === 'card') {
    return (
      <div
        className={cn(
          'inline-flex items-center justify-center bg-white border border-white/80 transition-transform duration-200',
          cardPadding[size],
          className
        )}
      >
        {content}
      </div>
    );
  }

  return <div className={cn('inline-flex items-center justify-center', className)}>{content}</div>;
};
