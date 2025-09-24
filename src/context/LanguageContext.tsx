'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { detectLanguageFromLocation, supportedLanguages } from '@/lib/openai';
import { translations } from '@/data/translations';

interface LanguageContextType {
  currentLanguage: string;
  setLanguage: (language: string) => void;
  translate: (text: string) => Promise<string>;
  isLoading: boolean;
  translationCache: Map<string, string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<string>('Turkish');
  const [isLoading, setIsLoading] = useState(false);
  const [translationCache] = useState(new Map<string, string>());
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Detect user's location and set initial language
  useEffect(() => {
    if (!isClient) return; // Only run on client side

    const detectUserLanguage = async () => {
      try {
        // Check if user has a saved language preference first
        const savedLanguage = localStorage.getItem('masapp-language');
        if (savedLanguage && Object.keys(supportedLanguages).includes(savedLanguage)) {
          setCurrentLanguage(savedLanguage);
          return;
        }

        // Try to get user's country from IP
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const detectedLanguage = await detectLanguageFromLocation(data.country_code);
        
        setCurrentLanguage(detectedLanguage);
        localStorage.setItem('masapp-language', detectedLanguage);
      } catch (error) {
        console.error('Language detection failed:', error);
        // Fallback to Turkish
        setCurrentLanguage('Turkish');
        localStorage.setItem('masapp-language', 'Turkish');
      }
    };

    detectUserLanguage();
  }, [isClient]);

  const setLanguage = (language: string) => {
    setCurrentLanguage(language);
    localStorage.setItem('masapp-language', language);
    // Clear cache when language changes
    translationCache.clear();
    // Force re-render of all TranslatedText components
    window.dispatchEvent(new Event('languageChanged'));
  };

  const translate = async (text: string): Promise<string> => {
    // If current language is Turkish, return original text
    if (currentLanguage === 'Turkish') {
      return text;
    }

    // Check cache first
    const cacheKey = `${text}-${currentLanguage}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    setIsLoading(true);
    try {
      // Convert language name to translation key
      const languageMap: { [key: string]: string } = {
        'English': 'en',
        'German': 'de', 
        'Arabic': 'ar',
        'Russian': 'ru'
      };
      
      const languageKey = languageMap[currentLanguage] || 'en';
      
      // Check if we have a predefined translation
      if (translations[text] && translations[text][languageKey as keyof typeof translations[typeof text]]) {
        const translatedText = translations[text][languageKey as keyof typeof translations[typeof text]];
        translationCache.set(cacheKey, translatedText);
        return translatedText;
      }
      
      // Fallback to original text if no translation found
      translationCache.set(cacheKey, text);
      return text;
    } catch (error) {
      console.error('Translation failed:', error);
      // Return original text instead of "Translation failed"
      return text;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        translate,
        isLoading,
        translationCache,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
