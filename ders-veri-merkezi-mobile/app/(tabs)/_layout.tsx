
import { Stack } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1e1b4b',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Ders Veri Merkezi',
          headerShown: true,
        }}
      />

      <Stack.Screen
        name="explore"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
