import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { BookOpen, Users, MessageCircle, Heart, MapPin, Smartphone } from 'lucide-react-native';
import { useRouter } from "expo-router";
import { useAuth } from '@/context/authContext';


const Index = () => {

   const router = useRouter();

   const { user, loading } = useAuth();


    useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View className="flex-1 w-full justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }
  

return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
   
        {/* Header */}
        <View className="px-6 py-16 bg-indigo-600">
          <View className="items-center">
            <View className="flex-row items-center mb-6">
              <BookOpen color="white" size={48} />
              <Text className="text-4xl font-bold text-white ml-3">ShareBook</Text>
            </View>

            <Text className="text-xl text-white text-center mb-8 leading-relaxed">
              Connect with fellow book lovers in your community. Share, exchange, and discover amazing books together.
            </Text>

            {/* Auth Buttons */}
            <View className="w-full space-y-4">
              <TouchableOpacity 
              className="bg-white px-8 py-4 rounded-lg shadow-lg"
              onPress={() => router.push("/(auth)/register")}
              >
                <Text className="text-indigo-600 font-semibold text-center text-lg">
                  Sign Up for Free
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
              className="border-2 border-white px-8 py-4 rounded-lg"
              onPress={() => router.push("/(auth)/login")}
              >
                <Text className="text-white font-semibold text-center text-lg">
                  Log In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View className="py-16 px-6 bg-gray-50">
          <Text className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Book Lovers Choose ShareBook
          </Text>
          
          <View className="space-y-6">
            {/* Feature 1 */}
            <View className="bg-white rounded-xl p-6 shadow-lg mx-2">
              <View className="w-12 h-12 bg-blue-500 rounded-lg items-center justify-center mb-4">
                <Users color="white" size={24} />
              </View>
              <Text className="text-xl font-semibold mb-3 text-gray-800">
                Community Driven
              </Text>
              <Text className="text-gray-600 leading-relaxed">
                Connect with passionate readers in your neighborhood. Build meaningful relationships through your shared love of books.
              </Text>
            </View>

            {/* Feature 2 */}
            <View className="bg-white rounded-xl p-6 shadow-lg mx-2">
              <View className="w-12 h-12 bg-green-500 rounded-lg items-center justify-center mb-4">
                <BookOpen color="white" size={24} />
              </View>
              <Text className="text-xl font-semibold mb-3 text-gray-800">
                Easy Book Sharing
              </Text>
              <Text className="text-gray-600 leading-relaxed">
                List your books, browse others' collections, and arrange exchanges effortlessly. Both physical and digital books supported.
              </Text>
            </View>

            {/* Feature 3 */}
            <View className="bg-white rounded-xl p-6 shadow-lg mx-2">
              <View className="w-12 h-12 bg-purple-500 rounded-lg items-center justify-center mb-4">
                <MessageCircle color="white" size={24} />
              </View>
              <Text className="text-xl font-semibold mb-3 text-gray-800">
                Built-in Chat
              </Text>
              <Text className="text-gray-600 leading-relaxed">
                Communicate directly with other readers, discuss books, and organize meetups through our integrated messaging system.
              </Text>
            </View>
          </View>
        </View>

        {/* How It Works */}
        <View className="py-16 px-6 bg-white">
          <Text className="text-3xl font-bold text-center text-gray-800 mb-12">
            How ShareBook Works
          </Text>
          
          <View className="space-y-8">
            <View className="items-center">
              <View className="w-16 h-16 bg-indigo-100 rounded-full items-center justify-center mb-4">
                <Text className="text-2xl font-bold text-indigo-600">1</Text>
              </View>
              <Text className="font-semibold mb-2 text-gray-800 text-center">Create Profile</Text>
              <Text className="text-sm text-gray-600 text-center px-4">
                Set up your reader profile and preferences
              </Text>
            </View>
            
            <View className="items-center">
              <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
                <Text className="text-2xl font-bold text-green-600">2</Text>
              </View>
              <Text className="font-semibold mb-2 text-gray-800 text-center">List Books</Text>
              <Text className="text-sm text-gray-600 text-center px-4">
                Add your book collection to share with others
              </Text>
            </View>
            
            <View className="items-center">
              <View className="w-16 h-16 bg-purple-100 rounded-full items-center justify-center mb-4">
                <Text className="text-2xl font-bold text-purple-600">3</Text>
              </View>
              <Text className="font-semibold mb-2 text-gray-800 text-center">Discover & Connect</Text>
              <Text className="text-sm text-gray-600 text-center px-4">
                Browse nearby collections and connect with readers
              </Text>
            </View>
            
            <View className="items-center">
              <View className="w-16 h-16 bg-pink-100 rounded-full items-center justify-center mb-4">
                <Text className="text-2xl font-bold text-pink-600">4</Text>
              </View>
              <Text className="font-semibold mb-2 text-gray-800 text-center">Share & Enjoy</Text>
              <Text className="text-sm text-gray-600 text-center px-4">
                Exchange books and join literary discussions
              </Text>
            </View>
          </View>
        </View>

        {/* Additional Features */}
        <View className="py-16 px-6 bg-gray-50">
          <Text className="text-3xl font-bold text-center text-gray-800 mb-12">
            Everything You Need to Share Books
          </Text>
          
          <View className="space-y-6">
            <View className="flex-row items-start space-x-4 bg-white p-4 rounded-xl shadow-sm">
              <View className="w-10 h-10 bg-blue-100 rounded-lg items-center justify-center">
                <MapPin color="#2563eb" size={20} />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-800 mb-2">Location-Based Discovery</Text>
                <Text className="text-gray-600">Find book collections and readers in your immediate area for easy exchanges.</Text>
              </View>
            </View>
            
            <View className="flex-row items-start space-x-4 bg-white p-4 rounded-xl shadow-sm">
              <View className="w-10 h-10 bg-green-100 rounded-lg items-center justify-center">
                <Heart color="#16a34a" size={20} />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-800 mb-2">Favorites & Ratings</Text>
                <Text className="text-gray-600">Rate books you've read and maintain a personalized favorites list.</Text>
              </View>
            </View>
            
            <View className="flex-row items-start space-x-4 bg-white p-4 rounded-xl shadow-sm">
              <View className="w-10 h-10 bg-purple-100 rounded-lg items-center justify-center">
                <Smartphone color="#9333ea" size={20} />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-800 mb-2">Digital Library</Text>
                <Text className="text-gray-600">Upload and share e-books through our secure digital repository.</Text>
              </View>
            </View>
            
            <View className="flex-row items-start space-x-4 bg-white p-4 rounded-xl shadow-sm">
              <View className="w-10 h-10 bg-orange-100 rounded-lg items-center justify-center">
                <Users color="#ea580c" size={20} />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-800 mb-2">Literary Events</Text>
                <Text className="text-gray-600">Organize and join book clubs, reading groups, and literary meetups.</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Final Call to Action */}
        <View className="py-16 px-6 bg-indigo-600">
          <View className="items-center">
            <Text className="text-3xl font-bold text-center text-white mb-6">
              Ready to Join the Reading Revolution?
            </Text>
            <Text className="text-xl text-white text-center mb-8 opacity-90 max-w-sm">
              Start sharing books with your community today. It's completely free to get started.
            </Text>
            
            <View className="w-full space-y-4">
              <TouchableOpacity className="bg-white px-8 py-4 rounded-lg shadow-lg">
                <Text className="text-indigo-600 font-semibold text-center text-lg">
                  Create Your Account
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="border-2 border-white px-8 py-4 rounded-lg">
                <Text className="text-white font-semibold text-center text-lg">
                  Already Have an Account?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="bg-gray-800 py-8 px-6">
          <View className="items-center">
            <View className="flex-row items-center mb-4">
              <BookOpen color="white" size={32} />
              <Text className="text-xl font-semibold text-white ml-2">ShareBook</Text>
            </View>
            <Text className="text-gray-400 mb-4 text-center">
              Connecting readers, one book at a time.
            </Text>
            <View className="flex-row justify-center space-x-6">
              <TouchableOpacity>
                <Text className="text-sm text-gray-400">About</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-sm text-gray-400">Privacy</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-sm text-gray-400">Terms</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text className="text-sm text-gray-400">Support</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Index
