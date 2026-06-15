import { StyleSheet, Text, View } from 'react-native';

import { useTapCount } from './_layout';

export default function CounterScreen() {
  const count = useTapCount();

  return (
    <View style={styles.container}>
      <Text style={styles.count} allowFontScaling={false} numberOfLines={1} adjustsFontSizeToFit>
        {count}
      </Text>
      <Text style={styles.label}>TAPS</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  count: {
    color: '#FFFFFF',
    fontSize: 220,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: -4,
    textAlign: 'center',
  },
  label: {
    color: '#5A5A5E',
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 8,
    marginTop: 8,
  },
});
