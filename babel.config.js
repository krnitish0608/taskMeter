module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@app': './src/app',
          '@config': './src/config',
          '@core': './src/core',
          '@modules': './src/modules',
          '@navigation': './src/navigation',
          '@themes': './src/themes',
        },
      },
    ],
  ],
};
