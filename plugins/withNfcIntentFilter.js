const { withAndroidManifest, AndroidConfig } = require('expo/config-plugins');

// Adds an NFC NDEF_DISCOVERED intent filter to MainActivity so that tapping an
// NFC tag holding a `nfcpoc1://...` URI cold-launches the app. The built-in
// Expo `intentFilters` config can't express this because it always prepends
// `android.intent.action.` to the action name, which is wrong for NFC actions.
const NFC_ACTION = 'android.nfc.action.NDEF_DISCOVERED';
const SCHEME = 'nfcpoc1';

module.exports = function withNfcIntentFilter(config) {
  return withAndroidManifest(config, (cfg) => {
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(cfg.modResults);
    const activity = (app.activity || []).find(
      (a) => a.$['android:name'] === '.MainActivity'
    );
    if (!activity) return cfg;

    activity['intent-filter'] = activity['intent-filter'] || [];
    const exists = activity['intent-filter'].some((f) =>
      (f.action || []).some((a) => a.$['android:name'] === NFC_ACTION)
    );
    if (!exists) {
      activity['intent-filter'].push({
        action: [{ $: { 'android:name': NFC_ACTION } }],
        category: [{ $: { 'android:name': 'android.intent.category.DEFAULT' } }],
        data: [{ $: { 'android:scheme': SCHEME } }],
      });
    }
    return cfg;
  });
};
