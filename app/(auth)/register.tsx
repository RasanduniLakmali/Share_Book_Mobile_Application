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
  Image,
  Alert,
} from 'react-native';
import { BookOpen, User, Mail, Lock, MapPin, Eye, EyeOff, Phone, Calendar, Camera } from 'lucide-react-native';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router';

import { Register } from '@/services/authService';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';

const Signup = () => {

  const router = useRouter()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [location, setLocation] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert("Permission Denied", "You need to give permission to access the photo library");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

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
    // 1️⃣ Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const currentUser = userCredential.user;

    // 2️⃣ Optionally save additional info to Firestore (including profile image)
    await Register(email, password, name, location, phone, date, profileImage ?? undefined);

    // 3️⃣ Sign in automatically
    await signInWithEmailAndPassword(auth, email, password);

    // 4️⃣ Redirect to home
    router.replace("/home");
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed. Please try again.');
  } finally {
    setTimeout(() => setIsLoading(false), 1500);
  }
};

  return (
    <SafeAreaView className="flex-1 bg-amber-50">
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
          <View className="bg-amber-500 px-6 py-12">
            <View className="items-center">
              <View className="flex-row items-center mb-4">
                <BookOpen color="white" size={40} />
                <Text className="text-3xl font-bold text-white ml-3">ShareBook</Text>
              </View>
              <Text className="text-lg text-amber-100 text-center">
                Join our community of book lovers
              </Text>
            </View>
          </View>

          {/* Signup Form */}
          <View className="px-6 py-8">
            <Text className="text-2xl font-bold text-gray-800 text-center mb-8">
              Create Your Account
            </Text>

            {/* Profile Image Upload */}
            <View className="items-center mb-6">
              <Text className="text-gray-700 font-medium mb-3">Profile Photo</Text>
              <TouchableOpacity
                className="w-24 h-24 rounded-full bg-amber-100 border-2 border-amber-300 items-center justify-center shadow-sm"
                onPress={handleImagePicker}
              >
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    className="w-full h-full rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="items-center">
                    <Camera color="#F59E0B" size={32} />
                    <Text className="text-amber-600 text-xs mt-1">Add Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
              <Text className="text-gray-500 text-sm mt-2 text-center">
                {profileImage ? 'Tap to change photo' : 'Optional - Add your profile picture'}
              </Text>
            </View>

            {/* Name */}
            <View className="flex-row space-x-3 mb-4">
              <View className="flex-1">
                <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
                <View className="flex-row items-center bg-white rounded-lg px-4 py-3 border border-amber-200 shadow-sm">
                  <User color="#F59E0B" size={20} />
                  <TextInput
                    className="flex-1 ml-3 text-gray-800"
                    placeholder="Enter your full name"
                    value={name}
                    onChangeText={setName}
                  />
                </View>
              </View>
            </View>

            {/* Email */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Email Address</Text>
              <View className="flex-row items-center bg-white rounded-lg px-4 py-3 border border-amber-200 shadow-sm">
                <Mail color="#F59E0B" size={20} />
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
              <View className="flex-row items-center bg-white rounded-lg px-4 py-3 border border-amber-200 shadow-sm">
                <MapPin color="#F59E0B" size={20} />
                <TextInput
                  className="flex-1 ml-3 text-gray-800"
                  placeholder="City, Area (e.g., Colombo, Kandy)"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
            </View>

            {/* Phone */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Phone Number</Text>
              <View className="flex-row items-center bg-white rounded-lg px-4 py-3 border border-amber-200 shadow-sm">
                <Phone color="#F59E0B" size={20} />
                <TextInput
                  className="flex-1 ml-3 text-gray-800"
                  placeholder="Your phone number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Date */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Date of Birth</Text>
              <View className="flex-row items-center bg-white rounded-lg px-4 py-3 border border-amber-200 shadow-sm">
                <Calendar color="#F59E0B" size={20} />
                <TextInput
                  className="flex-1 ml-3 text-gray-800"
                  placeholder="DD/MM/YYYY"
                  value={date}
                  onChangeText={setDate}
                />
              </View>
            </View>

            {/* Password */}
            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Password</Text>
              <View className="flex-row items-center bg-white rounded-lg px-4 py-3 border border-amber-200 shadow-sm">
                <Lock color="#F59E0B" size={20} />
                <TextInput
                  className="flex-1 ml-3 text-gray-800"
                  placeholder="Create a strong password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Confirm Password */}
            <View className="mb-6">
              <Text className="text-gray-700 font-medium mb-2">Confirm Password</Text>
              <View className="flex-row items-center bg-white rounded-lg px-4 py-3 border border-amber-200 shadow-sm">
                <Lock color="#F59E0B" size={20} />
                <TextInput
                  className="flex-1 ml-3 text-gray-800"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Terms */}
            <View className="flex-row items-start mb-6">
              <TouchableOpacity
                className={`w-5 h-5 rounded border-2 mr-3 mt-1 items-center justify-center ${
                  agreeToTerms ? 'bg-amber-500 border-amber-500' : 'border-gray-300'
                }`}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
              >
                {agreeToTerms && <Text className="text-white text-xs font-bold">✓</Text>}
              </TouchableOpacity>
              <Text className="text-gray-600 flex-1">
                I agree to the <Text className="text-amber-600 font-medium">Terms</Text> and{' '}
                <Text className="text-amber-600 font-medium">Privacy Policy</Text>
              </Text>
            </View>

            {/* Signup Button */}
            <TouchableOpacity
              className={`py-4 rounded-lg shadow-lg ${
                agreeToTerms ? 'bg-amber-500' : 'bg-gray-300'
              }`}
              onPress={handleRegister}
              disabled={!agreeToTerms || isLoading}
            >
              <Text className={`text-center font-semibold text-lg ${
                agreeToTerms ? 'text-white' : 'text-gray-500'
              }`}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
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
              <TouchableOpacity className="flex-row items-center justify-center py-3 px-4 border border-amber-300 rounded-lg bg-white shadow-sm">
                <View className="w-5 h-5 bg-blue-600 rounded mr-3" />
                <Text className="text-gray-700 font-medium">Continue with Facebook</Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-row items-center justify-center py-3 px-4 border border-amber-300 rounded-lg bg-white shadow-sm">
                <View className="w-5 h-5 bg-red-500 rounded mr-3" />
                <Text className="text-gray-700 font-medium">Continue with Google</Text>
              </TouchableOpacity>
            </View>
            
            <View className="flex-row justify-center items-center mt-8">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text className="text-amber-600 font-semibold">Log In</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Benefits Section */}
          <View className="bg-white px-6 py-8 mx-4 rounded-xl shadow-sm mb-6">
            <Text className="text-xl font-bold text-gray-800 text-center mb-6">
              What You'll Get with ShareBook
            </Text>
            
            <View className="space-y-4">
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-amber-100 rounded-full items-center justify-center mr-4">
                  <Text className="text-amber-600 font-bold">✓</Text>
                </View>
                <Text className="flex-1 text-gray-700">Access to thousands of books in your community</Text>
              </View>
              
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-amber-100 rounded-full items-center justify-center mr-4">
                  <Text className="text-amber-600 font-bold">✓</Text>
                </View>
                <Text className="flex-1 text-gray-700">Connect with like-minded book enthusiasts</Text>
              </View>
              
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-amber-100 rounded-full items-center justify-center mr-4">
                  <Text className="text-amber-600 font-bold">✓</Text>
                </View>
                <Text className="flex-1 text-gray-700">Organize and join local reading events</Text>
              </View>
              
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-amber-100 rounded-full items-center justify-center mr-4">
                  <Text className="text-amber-600 font-bold">✓</Text>
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

