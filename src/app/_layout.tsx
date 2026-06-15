import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Linking from 'expo-linking';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { createContext, useContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'nfc.tapCount';

const TapCountContext = createContext(0);
export const useTapCount = () => useContext(TapCountContext);

// Any URL on our own scheme means the app was opened from an NFC tag.
const isTapUrl = (url: string | null) => !!url && url.startsWith('nfcpoc1:');

// Read-increment-write against storage so the persisted value is always the
// source of truth, even across cold launches that each start a fresh process.
async function incrementStoredCount() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const next = (raw ? parseInt(raw, 10) || 0 : 0) + 1;
  await AsyncStorage.setItem(STORAGE_KEY, String(next));
  return next;
}

async function readStoredCount() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? parseInt(raw, 10) || 0 : 0;
}

export default function RootLayout() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;

    // Cold launch: figure out whether we were started by an NFC tap, after the
    // stored value has been loaded, so we never overwrite it with a stale base.
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      const value = isTapUrl(initialUrl)
        ? await incrementStoredCount()
        : await readStoredCount();
      if (active) setCount(value);
    })();

    // Warm taps: a new NFC intent arrives while the app is already running.
    const sub = Linking.addEventListener('url', async ({ url }) => {
      if (!isTapUrl(url)) return;
      const value = await incrementStoredCount();
      if (active) setCount(value);
    });

    return () => {
      active = false;
      sub.remove();
    };
  }, []);

  return (
    <TapCountContext.Provider value={count}>
      <StatusBar style="light" />
      <Slot />
    </TapCountContext.Provider>
  );
}
