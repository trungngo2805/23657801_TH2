module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@constants': './src/constants',
          '@hooks': './src/hooks',
          '@services': './src/services',
          '@stores': './src/stores',
          '@navigation': './src/navigation',
          '@components': './src/components',
          '@screens': './src/screens',
        },
      },
    ],
  ],
};