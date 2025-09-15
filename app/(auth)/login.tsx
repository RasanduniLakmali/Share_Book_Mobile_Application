import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { login } from '../../services/authService';

const LoginScreen = () => {
  const router = useRouter();
  
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async () => {
     if (!email || !password) {
      setError('Please fill in all fields')
      return
  };

  setIsLoading(true);
  setError('');

  try{
    await login(email, password);
    router.push('../home');
  }catch(error){
    if (error instanceof Error) {
        setError(error.message || 'Login failed. Please try again.')
      } else {
        setError('Login failed. Please try again.')
      }
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

 

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-16">
            <View className="items-center">
              <View className="flex-row items-center mb-6">
                <BookOpen color="white" size={48} />
                <Text className="text-4xl font-bold text-white ml-3">ShareBook</Text>
              </View>
              <Text className="text-xl text-white text-center opacity-90 mb-2">
                Welcome Back!
              </Text>
              <Text className="text-lg text-white text-center opacity-75">
                Sign in to continue your reading journey
              </Text>
            </View>
          </View>

          {/* Login Form */}
          <View className="px-6 py-8">
            <Text className="text-2xl font-bold text-gray-800 text-center mb-8">
              Log In to Your Account
            </Text>

            {/* Email Field */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Email Address</Text>
              <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                <Mail color="#6b7280" size={20} />
                <TextInput
                  className="flex-1 ml-3 text-gray-800"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Field */}
            <View className="mb-6">
      <Text className="text-gray-700 font-medium mb-2">Password</Text>
      <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
        <Lock color="#6b7280" size={20} />
        <TextInput
          className="flex-1 ml-3 text-gray-800"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={!showPassword} // <-- hides password when false
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <EyeOff color="#6b7280" size={20} />
          ) : (
            <Eye color="#6b7280" size={20} />
          )}
        </TouchableOpacity>
      </View>
    </View>

            {/* Remember Me & Forgot Password */}
            {/* <View className="flex-row items-center justify-between mb-6">
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View className={`w-5 h-5 rounded border-2 mr-2 items-center justify-center ${
                  rememberMe ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                }`}>
                  {rememberMe && (
                    <Text className="text-white text-xs font-bold">✓</Text>
                  )}
                </View>
                <Text className="text-gray-600">Remember me</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleForgotPassword}>
                <Text className="text-indigo-600 font-medium">Forgot Password?</Text>
              </TouchableOpacity>
            </View> */}

            {/* Login Button */}
            <TouchableOpacity 
              className="bg-indigo-600 py-4 rounded-lg shadow-lg mb-6"
              onPress={handleLogin}
              disabled={isLoading}
            >
               {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">Log In</Text>
            )}
            
              
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="px-4 text-gray-500">or continue with</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Social Login Options */}
            <View className="space-y-3 mb-6">
              <TouchableOpacity className="flex-row items-center justify-center py-3 px-4 border border-gray-300 rounded-lg bg-white">
                <View className="w-5 h-5 bg-blue-600 rounded mr-3" />
                <Text className="text-gray-700 font-medium">Continue with Facebook</Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-row items-center justify-center py-3 px-4 border border-gray-300 rounded-lg bg-white">
                <View className="w-5 h-5 bg-red-500 rounded mr-3" />
                <Text className="text-gray-700 font-medium">Continue with Google</Text>
              </TouchableOpacity>
            </View>

            {/* Signup Link */}
            <View className="flex-row justify-center items-center">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity>
                <Text className="text-indigo-600 font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Features Reminder */}
          <View className="bg-gradient-to-br from-indigo-50 to-purple-50 px-6 py-8">
            <Text className="text-xl font-bold text-gray-800 text-center mb-6">
              Welcome Back to ShareBook
            </Text>
            
            <View className="space-y-4">
              <View className="flex-row items-center bg-white rounded-lg p-4 shadow-sm">
                <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center mr-4">
                  <BookOpen color="#4f46e5" size={20} />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">Your Book Collection</Text>
                  <Text className="text-gray-600 text-sm">Access all your shared books instantly</Text>
                </View>
              </View>
              
              <View className="flex-row items-center bg-white rounded-lg p-4 shadow-sm">
                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-4">
                  <Text className="text-green-600 font-bold text-lg">📱</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">Community Messages</Text>
                  <Text className="text-gray-600 text-sm">Continue conversations with fellow readers</Text>
                </View>
              </View>
              
              <View className="flex-row items-center bg-white rounded-lg p-4 shadow-sm">
                <View className="w-10 h-10 bg-purple-100 rounded-full items-center justify-center mr-4">
                  <Text className="text-purple-600 font-bold text-lg">🎯</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">Personalized Recommendations</Text>
                  <Text className="text-gray-600 text-sm">Discover books based on your interests</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Help Section */}
          <View className="px-6 py-6 bg-gray-50">
            <Text className="text-center text-gray-600 mb-4">
              Having trouble logging in?
            </Text>
            <View className="flex-row justify-center space-x-6">
              <TouchableOpacity>
                <Text className="text-indigo-600 font-medium">Contact Support</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-indigo-600 font-medium">Help Center</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default LoginScreen