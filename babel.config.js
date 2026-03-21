module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { keepAwake: false }]],
    plugins: [require.resolve('react-native-reanimated/plugin')],
  };
};
