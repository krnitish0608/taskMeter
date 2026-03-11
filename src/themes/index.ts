export const lightTheme = {
  colors: {
    primary: '#007AFF',
    background: '#FFFFFF',
    surface: '#F2F2F2',
    text: '#000000',
    textSecondary: '#666666',
    border: '#CCCCCC',
    error: '#FF3B30',
    success: '#34C759',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
};

export const darkTheme = {
  colors: {
    primary: '#0A84FF',
    background: '#000000',
    surface: '#1C1C1E',
    text: '#FFFFFF',
    textSecondary: '#CCCCCC',
    border: '#38383A',
    error: '#FF453A',
    success: '#30D158',
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
};

export type Theme = typeof lightTheme;