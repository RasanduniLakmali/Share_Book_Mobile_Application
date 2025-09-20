import React from 'react'
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <Stack screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: 'white' },
      animation: 'slide_from_right',
      headerTitleStyle: { fontSize: 20, fontWeight: 'bold', color: '#1E40AF' },
      headerTintColor: '#1E40AF',
    }}>
      <Stack.Screen 
      name="login" 
      options={{ title: 'Login' }}
      />
      <Stack.Screen name="register"
       options={{ title: 'SignUp Page' }} />
    </Stack>
  );
};

export default AuthLayout;
