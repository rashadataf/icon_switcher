/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { Button, StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { AppIcon, iconToName, useAppIcon } from './src/hooks/useAppIcon';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const { current, pending, error, setIcon, reset } = useAppIcon();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
      <Text>Current: {current ?? 'primary'}</Text>
      {pending ? <Text>Changing…</Text> : null}
      {error ? <Text>Error: {String((error as Error)?.message ?? error)}</Text> : null}

      <View style={{ height: 12 }} />
      <Button title="Primary" onPress={() => reset()} />
      <Button title="Alternate" onPress={() => setIcon(iconToName(AppIcon.Alt))} />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
