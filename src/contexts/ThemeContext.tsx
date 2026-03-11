import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { mmkvStorage } from '@core/storage/mmkv';
import { lightTheme, darkTheme, Theme } from '../themes';
import { STORAGE_KEYS } from '@core/constants';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setSystemTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const savedTheme = mmkvStorage.getString(STORAGE_KEYS.THEME) as
    | 'light'
    | 'dark'
    | 'system'
    | undefined;
  const [themeType, setThemeType] = useState<'light' | 'dark' | 'system'>(
    savedTheme ?? 'system',
  );
  const systemColorScheme = Appearance.getColorScheme();

  const getTheme = (): Theme => {
    if (themeType === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeType === 'dark' ? darkTheme : lightTheme;
  };

  const theme = getTheme();
  const isDark = theme === darkTheme;

  const toggleTheme = () => {
    const newType = themeType === 'light' ? 'dark' : 'light';
    setThemeType(newType);
    mmkvStorage.setString(STORAGE_KEYS.THEME, newType);
  };

  const setSystemTheme = () => {
    setThemeType('system');
    mmkvStorage.setString(STORAGE_KEYS.THEME, 'system');
  };

  useEffect(() => {
    const subscription = Appearance.addChangeListener(() => {
      if (themeType === 'system') {
        // Force re-render by toggling a state update
        setThemeType('system');
      }
    });
    return () => subscription?.remove();
  }, [themeType]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setSystemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};