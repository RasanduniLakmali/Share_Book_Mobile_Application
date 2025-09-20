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
  Alert,
} from 'react-native';
import { BookOpen, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import { login } from '@/services/authService';
import { Entypo } from '@expo/vector-icons';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from "@/firebase"; 
import ForgotPasswordComponent from './forgotPassword';
import { getIdToken } from '@/services/authService';

const LoginScreen = () => {
  const router = useRouter();
  
  const [password, setPassword] = React.useState('')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");



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
    const idToken = await getIdToken();
    console.log("Decoded token for debugging:", idToken);
    Alert.alert('Success', 'Logged in successfully!');
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
    <SafeAreaView className="flex-1 bg-amber-50">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Header with amber theme */}
          <View className="bg-amber-500 px-6 pt-12 pb-16 relative">
            {/* Background decoration */}
            <View className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
            <View className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12" />
            
            <View className="items-center relative z-10">
              <View className="flex-row items-center mb-6">
                
                <Text className="text-4xl font-bold text-white ml-4 tracking-wide">ShareBook</Text>
              </View>
              <Text className="text-2xl text-white text-center font-semibold mb-2">
                Welcome Back!
              </Text>
              <Text className="text-lg text-amber-100 text-center opacity-90">
                Sign in to continue your reading journey
              </Text>
            </View>
          </View>
          
          {/* Login Form with overlap */}
          <View className="px-6 -mt-8">
            <View className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <Text className="text-2xl font-bold text-gray-800 text-center mb-8">
                Welcome Back
              </Text>

              {error ? (
                <View className="bg-red-50 p-4 rounded-2xl mb-6 border border-red-200">
                  <Text className="text-red-600 text-center font-medium">{error}</Text>
                </View>
              ) : null}

              {/* Email Field */}
              <View className="mb-6">
                <Text className="text-gray-700 font-semibold mb-3 text-base">Email Address</Text>
                <View className="flex-row items-center bg-amber-50 rounded-2xl px-5 py-4 border-2 border-amber-100 focus:border-amber-500">
                  <Mail color="#f59e0b" size={22} />
                  <TextInput
                    className="flex-1 ml-4 text-gray-800 text-base font-medium"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
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
                <Text className="text-gray-700 font-semibold mb-3 text-base">Password</Text>
                <View className="flex-row items-center bg-amber-50 rounded-2xl px-5 py-4 border-2 border-amber-100">
                  <Lock color="#f59e0b" size={22} />
                  <TextInput
                    className="flex-1 ml-4 text-gray-800 text-base font-medium"
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowPassword(!showPassword)}
                    className="p-2 ml-2"
                  >
                    {showPassword ? (
                      <EyeOff color="#f59e0b" size={22} />
                    ) : (
                      <Eye color="#f59e0b" size={22} />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              
               <ForgotPasswordComponent />



              {/* Login Button */}
              <TouchableOpacity 
                className={`py-4 rounded-2xl shadow-lg mb-6 ${isLoading ? 'bg-amber-400' : 'bg-amber-500'}`}
                onPress={handleLogin}
                disabled={isLoading}
                style={{
                  shadowColor: '#f59e0b',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text className="text-white text-center font-bold text-lg tracking-wide">Sign In</Text>
                )}
              </TouchableOpacity>

  


              {/* Signup Link */}
              <View className="flex-row justify-center items-center">
                <Text className="text-gray-600 text-base">Don't have an account? </Text>
                <Link href="/register" asChild>
                  <TouchableOpacity>
                    <Text className="text-amber-600 font-bold text-base">Sign Up</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>

          {/* Features Section */}
          <View className="px-6 py-8">
            <Text className="text-2xl font-bold text-gray-800 text-center mb-8">
              Why Choose ShareBook?
            </Text>
            
            <View className="space-y-4">
              <View className="flex-row items-center bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
                <View className="w-14 h-14 bg-amber-100 rounded-2xl items-center justify-center mr-5">
                  <BookOpen color="#f59e0b" size={28} />
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-800 text-lg">Your Library</Text>
                  <Text className="text-gray-600 text-base mt-1">Access all your shared books instantly</Text>
                </View>
              </View>
              
              <View className="flex-row items-center bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
                <View className="w-14 h-14 bg-amber-100 rounded-2xl items-center justify-center mr-5">
                  <Text className="text-amber-600 font-bold text-2xl">💬</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-800 text-lg">Community</Text>
                  <Text className="text-gray-600 text-base mt-1">Connect with fellow readers worldwide</Text>
                </View>
              </View>
              
              <View className="flex-row items-center bg-white rounded-2xl p-6 shadow-lg border border-amber-100">
                <View className="w-14 h-14 bg-amber-100 rounded-2xl items-center justify-center mr-5">
                  <Text className="text-amber-600 font-bold text-2xl">🎯</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-bold text-gray-800 text-lg">Smart Recommendations</Text>
                  <Text className="text-gray-600 text-base mt-1">Discover books tailored to your taste</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Help Section */}
          <View className="px-6 py-8 bg-amber-100 mx-6 rounded-2xl mb-6">
            <Text className="text-center text-amber-800 mb-4 font-semibold text-lg">
              Need Help?
            </Text>
            <View className="flex-row justify-center space-x-8">
              <TouchableOpacity className="items-center">
                <Text className="text-amber-600 font-bold text-base">Support</Text>
              </TouchableOpacity>
              <TouchableOpacity className="items-center">
                <Text className="text-amber-600 font-bold text-base">Help Center</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default LoginScreen;