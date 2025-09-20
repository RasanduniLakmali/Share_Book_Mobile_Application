import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { resetPassword } from '../../services/authService';

const ForgotPasswordComponent = () => {
  const [showInput, setShowInput] = useState(false);
  const [email, setEmail] = useState("");

  const handleResetPassword = async () => {
    if (!email) return Alert.alert("Error", "Please enter your email");

    try {
      await resetPassword(email);
      Alert.alert("Success", "Password reset email sent. Check your inbox!");
      setEmail("");
      setShowInput(false);
    } catch (err: any) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to send password reset email");
    }
  };

  return (
    <View className="items-end mb-6 w-full">
      {!showInput ? (
        <TouchableOpacity onPress={() => setShowInput(true)}>
          <Text className="text-amber-600 font-semibold">Forgot Password?</Text>
        </TouchableOpacity>
      ) : (
        <View className="w-full mt-4">
          <TextInput
            className="border border-amber-200 rounded-2xl px-4 py-3 mb-3"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity
            className="bg-amber-500 rounded-2xl py-3"
            onPress={handleResetPassword}
          >
            <Text className="text-white text-center font-bold">Send Reset Email</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ForgotPasswordComponent;
