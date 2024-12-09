import { StyleSheet, View, TextInput, FlatList } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top + 20 }}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Profil</ThemedText>
      </ThemedView>

      <ThemedText>Username</ThemedText>
      <TextInput style={{ backgroundColor: "white" }} />
      <ThemedText>Password</ThemedText>
      <TextInput style={{ backgroundColor: "white" }} />

      <FlatList
        data={[
          { key: 'Devin' },
          { key: 'Dan' },
          { key: 'Dominic' },
          { key: 'Jackson' },
          { key: 'James' },
          { key: 'Joel' },
          { key: 'John' },
          { key: 'Jillian' },
          { key: 'Jimmy' },
          { key: 'Julie' },
        ]}
        renderItem={({ item }) => <ThemedText style={styles.item}>{item.key}</ThemedText>} />

    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: 40,
    padding: 20,
  },

  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  }
});
