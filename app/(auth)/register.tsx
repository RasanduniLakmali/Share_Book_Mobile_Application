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
} from 'react-native';
import { BookOpen, User, Mail, Lock, MapPin, Eye, EyeOff } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { Register } from '@/services/authService';

const Signup = () => {

  const router = useRouter()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async () => {
  setIsLoading(true);
  if (!email || !password || !confirmPassword || !name) {
    alert('Please fill in all fields');
    setIsLoading(false);
    return;
  }

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    setIsLoading(false);
    return;
  }

  try {
    await Register(email, password, name, location); 
    router.push('/');
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed. Please try again.');
  } finally {
    console.log('Registration attempted with:', { email, password, name, location });
    setTimeout(() => setIsLoading(false), 1500);
  }
};



  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }} 
        >
          {/* Header */}
          <View className="bg-indigo-600 px-6 py-12">
            <View className="items-center">
              <View className="flex-row items-center mb-4">
                <BookOpen color="white" size={40} />
                <Text className="text-3xl font-bold text-white ml-3">ShareBook</Text>
              </View>
              <Text className="text-lg text-white text-center opacity-90">
                Join our community of book lovers
              </Text>
            </View>
          </View>

          {/* Signup Form */}
          <View className="px-6 py-8">
            <Text className="text-2xl font-bold text-gray-800 text-center mb-8">
              Create Your Account
            </Text>

            {/* Name */}
            <View className="flex-row space-x-3 mb-4">
              <View className="flex-1">
                <Text className="text-gray-700 font-medium mb-2">Name</Text>
                <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                  <User color="#6b7280" size={20} />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800"
                    placeholder="John"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Email Address</Text>
              <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                <Mail color="#6b7280" size={20} />
                <TextInput
                  className="flex-1 ml-3 text-gray-800"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Location */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Location</Text>
              <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                <MapPin color="#6b7280" size={20} />
                <TextInput
                  className="flex-1 ml-3 text-gray-800"
                  placeholder="City, Area"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
            </View>

            {/* Password */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Password</Text>
              <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                <Lock color="#6b7280" size={20} />
                <TextInput
                  className="flex-1 ml-3 text-gray-800"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  
                />
                {/* <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff color="#6b7280" size={20} /> : <Eye color="#6b7280" size={20} />}
                </TouchableOpacity> */}
              </View>
            </View>

            {/* Confirm Password */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">Confirm Password</Text>
              <View className="flex-row items-center bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
                <Lock color="#6b7280" size={20} />
                <TextInput
                  className="flex-1 ml-3 text-gray-800"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  
                />
                {/* <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff color="#6b7280" size={20} /> : <Eye color="#6b7280" size={20} />}
                </TouchableOpacity> */}
              </View>
            </View>

            {/* Terms */}
            <View className="flex-row items-start mb-6">
              <TouchableOpacity
                className={`w-5 h-5 rounded border-2 mr-3 mt-1 items-center justify-center ${
                  agreeToTerms ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                }`}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
              >
                {agreeToTerms && <Text className="text-white text-xs font-bold">✓</Text>}
              </TouchableOpacity>
              <Text className="text-gray-600 flex-1">
                I agree to the <Text className="text-indigo-600 font-medium">Terms</Text> and{' '}
                <Text className="text-indigo-600 font-medium">Privacy Policy</Text>
              </Text>
            </View>

            {/* Signup Button */}
            <TouchableOpacity
              className={`py-4 rounded-lg shadow-lg ${
                agreeToTerms ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
              onPress={handleRegister}
              disabled={!agreeToTerms}
            >
              <Text className={`text-center font-semibold text-lg ${
                agreeToTerms ? 'text-white' : 'text-gray-500'
              }`}>
                Create Account
              </Text>
            </TouchableOpacity>
            {/* Divider */}
            <View className="flex-row items-center my-8">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="px-4 text-gray-500">or</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>
            {/* Social Signup Options */}
            <View className="space-y-3">
              <TouchableOpacity className="flex-row items-center justify-center py-3 px-4 border border-gray-300 rounded-lg bg-white">
                <View className="w-5 h-5 bg-blue-600 rounded mr-3" />
                <Text className="text-gray-700 font-medium">Continue with Facebook</Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-row items-center justify-center py-3 px-4 border border-gray-300 rounded-lg bg-white">
                <View className="w-5 h-5 bg-red-500 rounded mr-3" />
                <Text className="text-gray-700 font-medium">Continue with Google</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-center items-center mt-8">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity>
                <Text className="text-indigo-600 font-semibold">Log In</Text>
              </TouchableOpacity>
            </View>
            
          </View>
          {/* Benefits Section */}
          <View className="bg-gray-50 px-6 py-8">
            <Text className="text-xl font-bold text-gray-800 text-center mb-6">
              What You'll Get with ShareBook
            </Text>
            
            <View className="space-y-4">
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-4">
                  <Text className="text-green-600 font-bold">✓</Text>
                </View>
                <Text className="flex-1 text-gray-700">Access to thousands of books in your community</Text>
              </View>
              
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-4">
                  <Text className="text-green-600 font-bold">✓</Text>
                </View>
                <Text className="flex-1 text-gray-700">Connect with like-minded book enthusiasts</Text>
              </View>
              
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-4">
                  <Text className="text-green-600 font-bold">✓</Text>
                </View>
                <Text className="flex-1 text-gray-700">Organize and join local reading events</Text>
              </View>
              
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-4">
                  <Text className="text-green-600 font-bold">✓</Text>
                </View>
                <Text className="flex-1 text-gray-700">Free digital book repository access</Text>
              </View>
            </View>
            </View>
            
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Signup;

