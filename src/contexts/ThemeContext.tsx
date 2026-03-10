import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightTheme, darkTheme, Theme } from '../themes';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setSystemTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'app_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeType, setThemeType] = useState<'light' | 'dark' | 'system'>('system');
  const systemColorScheme = Appearance.getColorScheme();

  const getTheme = (): Theme => {
    if (themeType === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeType === 'dark' ? darkTheme : lightTheme;
  };

  const theme = getTheme();
  const isDark = theme === darkTheme;

  const toggleTheme = async () => {
    const newType = themeType === 'light' ? 'dark' : 'light';
    setThemeType(newType);
    await AsyncStorage.setItem(THEME_KEY, newType);
  };

  const setSystemTheme = async () => {
    setThemeType('system');
    await AsyncStorage.setItem(THEME_KEY, 'system');
  };

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme) {
        setThemeType(savedTheme as 'light' | 'dark' | 'system');
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      if (themeType === 'system') {
        // Force re-render by updating state, but since theme is computed, maybe not needed
        // But to trigger, perhaps use a dummy state
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