import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { WorkoutService } from '../database/workoutService';

export default function ActiveWorkout({ route, navigation }: any) {
  const { sessionId, exerciseId, exerciseName } = route.params;
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState<{weight: number, reps: number}[]>([]);

  const handleAddSet = async () => {
    if (!weight || !reps) return;
    
    await WorkoutService.addSet(sessionId, exerciseId, parseFloat(weight), parseInt(reps));
    setSets([...sets, { weight: parseFloat(weight), reps: parseInt(reps) }]);
    setWeight('');
    setReps('');
  };

  const handleFinish = async () => {
    await WorkoutService.finishSession(sessionId);
    Alert.alert("Success", "Workout saved!");
    navigation.navigate('Home');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Training: {exerciseName}</Text>
      
      <View style={styles.inputRow}>
        <TextInput 
          placeholder="Weight (kg)" 
          style={styles.input} 
          keyboardType="numeric" 
          value={weight}
          onChangeText={setWeight}
        />
        <TextInput 
          placeholder="Reps" 
          style={styles.input} 
          keyboardType="numeric" 
          value={reps}
          onChangeText={setReps}
        />
        <Button title="Add Set" onPress={handleAddSet} />
      </View>

      <View style={styles.history}>
        {sets.map((s, index) => (
          <Text key={index} style={styles.setRow}>
            Set {index + 1}: {s.weight}kg x {s.reps}
          </Text>
        ))}
      </View>

      <Button title="Finish Workout" color="green" onPress={handleFinish} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginVertical: 20 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  input: { borderBottomWidth: 1, width: '30%', padding: 5 },
  history: { marginVertical: 20 },
  setRow: { fontSize: 16, paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: '#eee' }
});