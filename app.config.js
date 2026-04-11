const { expo } = require('./app.json');
const { withAndroidManifest } = require('expo/config-plugins');

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

const withStrippedLocationPermissions = (config) =>
  withAndroidManifest(config, (cfg) => {
    const manifest = cfg.modResults.manifest;
    manifest.$ = {
      ...manifest.$,
      'xmlns:tools': 'http://schemas.android.com/tools',
    };
    const toRemove = new Set([
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.FOREGROUND_SERVICE_LOCATION',
    ]);
    const existing = manifest['uses-permission'] || [];
    const kept = existing.filter((p) => !toRemove.has(p.$['android:name']));
    toRemove.forEach((name) => {
      kept.push({ $: { 'android:name': name, 'tools:node': 'remove' } });
    });
    manifest['uses-permission'] = kept;
    return cfg;
  });

module.exports = {
  ...expo,
  android: {
    ...expo.android,
    config: googleMapsApiKey
      ? {
          googleMaps: {
            apiKey: googleMapsApiKey,
          },
        }
      : undefined,
  },
  plugins: [...(expo.plugins || []), withStrippedLocationPermissions],
};
