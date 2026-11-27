import { router } from 'expo-router';
import { Alert, Linking } from 'react-native';

import { site } from '@/data/site';

/** Open a website page (article, category…) inside the app on the Page screen. */
export function openPage(url: string) {
  if (url.startsWith(site.url)) {
    router.push({ pathname: '/page', params: { url } });
  } else {
    openExternal(url);
  }
}

/** Open an external app link: email, phone, maps, social apps. */
export async function openExternal(url: string) {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert('Unable to open', 'No app on this device can handle this action.');
  }
}
