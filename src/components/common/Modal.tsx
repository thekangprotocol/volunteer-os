import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
}) => {
  const { theme } = useApp();
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className={`fixed inset-0 transition-opacity duration-300 ${
          isDark ? 'bg-black/80 backdrop-blur-md' : 'bg-black/40 backdrop-blur-md'
        }`}
      />

      {/* Modal Box */}
      <div
        className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-3xl border p-6 md:p-8 shadow-2xl transition-all duration-300 z-10 ${
          isDark 
            ? 'bg-zinc-950 text-white border-zinc-800 shadow-black' 
            : 'bg-white text-zinc-950 border-zinc-200 shadow-2xl'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-6 right-6 p-2 rounded-full border transition-colors ${
            isDark 
              ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700' 
              : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:text-black hover:border-zinc-300'
          }`}
          aria-label="Close Modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        {(title || subtitle) && (
          <div className="mb-6 pr-8">
            {title && (
              <h2 className="text-xl md:text-2xl font-light tracking-tight">{title}</h2>
            )}
            {subtitle && (
              <p className="text-xs font-mono opacity-60 mt-1">{subtitle}</p>
            )}
          </div>
        )}

        {/* Body Content */}
        {children}
      </div>
    </div>
  );
};
