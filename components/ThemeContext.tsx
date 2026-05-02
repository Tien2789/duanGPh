'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  name: string;
}

const THEMES: Record<string, ThemeConfig> = {
  default: {
    primary: '#8B0000',
    secondary: '#D4AF37',
    accent: '#FDF5E6',
    name: 'Dòng Tộc Việt',
  },
  nguyen: {
    primary: '#004d40',
    secondary: '#ffab00',
    accent: '#fff9c4',
    name: 'Họ Nguyễn',
  },
  tran: {
    primary: '#1a237e',
    secondary: '#c6ff00',
    accent: '#e8eaf6',
    name: 'Họ Trần',
  }
};

interface ThemeContextType {
  theme: ThemeConfig;
  setClan: (subdomain: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    if (typeof window === 'undefined') return THEMES.default;
    const hostname = window.location.hostname;
    if (hostname.includes('nguyen')) return THEMES.nguyen;
    if (hostname.includes('tran')) return THEMES.tran;
    return THEMES.default;
  });

  useEffect(() => {
    // This effect is not needed anymore for initialization, 
    // but we can keep it if we want to sync with hostname changes dynamically (rare)
    // or just remove it if subdomain is the only driver.
  }, []);

  const setClan = (subdomain: string) => {
    if (THEMES[subdomain]) {
      setTheme(THEMES[subdomain]);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setClan }}>
      <div style={{ 
        ['--color-son' as any]: theme.primary,
        ['--color-dong' as any]: theme.secondary,
        ['--color-xuyen' as any]: theme.accent,
      }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
