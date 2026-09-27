import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { initDatabase } from './src/database/init';
import { WorkoutService } from './src/database/workoutService';
import ExerciseLibrary from './src/screens/ExerciseLibrary';
import ActiveWorkout from './src/screens/ActiveWorkout';
import { View, Button, Text } from 'react-native';

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to DALE</Text>
      <Button 
        title="Start Empty Workout" 
        onPress={async () => {
          const id = await WorkoutService.startSession('1');
          navigation.navigate('ActiveWorkout', { 
            sessionId: id, 
            exerciseId: '1', 
            exerciseName: 'Bench Press' 
          });
        }} 
      />
      <Button title="View Library" onPress={() => navigation.navigate('Library')} />
    </View>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initDatabase().then(() => setReady(true));
  }, []);

  if (!ready) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ActiveWorkout" component={ActiveWorkout} />
        <Stack.Screen name="Library" component={ExerciseLibrary} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}