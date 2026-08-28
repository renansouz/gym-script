import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { Exercise } from '../domain/types';

export default function ExerciseLibrary() {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const fetchExercises = async () => {
    const db = await SQLite.openDatabaseAsync('dale_db');
    const result = await db.getAllAsync<Exercise>('SELECT * FROM exercises ORDER BY name ASC');
    setExercises(result);
  };

  useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Exercise Library</Text>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemSubtitle}>{item.targetMuscle}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  item: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemName: { fontSize: 18, fontWeight: '600' },
  itemSubtitle: { fontSize: 14, color: '#666' },
});