import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/ui/Button';
import { Filter, Plus } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

export default function ExpenseScreen() {
  return (
    <View style={styles.container}>
      <ThemedView style={styles.content}>
        <ThemedText type="title">Expenses!</ThemedText>
      </ThemedView>

      <Button onPress={() => {}} buttonStyle={styles.filterButton} Icon={Filter} />

      <Button onPress={() => {}} buttonStyle={styles.addButton} Icon={Plus} />
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
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  content: {
    backgroundColor: "#88FF88",
    flex: 1,
    flexGrow: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
  addButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 50,
    elevation: 4,
  },
  filterButton: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    backgroundColor: '#000000',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 50,
    elevation: 4,
  }
});
