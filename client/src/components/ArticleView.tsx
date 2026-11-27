import { StyleSheet } from 'react-native';
import { WebView, type WebViewNavigation } from 'react-native-webview';

import { colors } from '@/constants/theme';
import { site } from '@/data/site';
import { renderDocument, type PageContent } from '@/utils/extract';

type ArticlePage = Extract<PageContent, { kind: 'article' }>;

/** Android / iOS: render the extracted article in a WebView. Link taps go to `onLink`. */
export function ArticleView({ page, onLink }: { page: ArticlePage; onLink: (url: string) => void }) {
  const onNavigate = (req: WebViewNavigation) => {
    const target = req.url;
    if (!target || target.startsWith('about:') || target.startsWith('data:')) return true;
    if (target === site.url + '/' && req.navigationType !== 'click') return true; // initial baseUrl load
    onLink(target);
    return false;
  };

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: renderDocument(page), baseUrl: site.url + '/' }}
      onShouldStartLoadWithRequest={onNavigate}
      setSupportMultipleWindows={false}
      style={styles.web}
    />
  );
}

const styles = StyleSheet.create({
  web: { flex: 1, backgroundColor: colors.background },
});
