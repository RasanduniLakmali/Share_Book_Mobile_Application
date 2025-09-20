
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import { BookOpen, Search, Heart, MessageCircle, User, MapPin, Plus } from 'lucide-react-native';
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import {db} from "@/firebase" // make sure this points to your firebase setup
import { useRouter } from 'expo-router';
import { auth } from "@/firebase";
import { subscribeUnreadMessages } from "@/services/messageService";
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { getUserById } from '@/services/authService';


const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState<any[]>([]);

  const router = useRouter();

 useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "books"), async (snapshot) => {
    const booksData = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const book = { id: docSnap.id, ...docSnap.data() } as any;

        // Use your service function
        if (book.userId) {
          const user = await getUserById(book.userId);
          if (user && 'name' in user) {
            book.username = (user as { name: string }).name; // 👈 directly attach username
          }
        }

        return book;
      })
    );

    setBooks(booksData);
    setLoading(false);
  });

  return () => unsubscribe();
}, []);
  

  const filteredBooks = books.filter(
    (b) =>
      b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!auth.currentUser?.uid) return;
    const unsubscribe = subscribeUnreadMessages(auth.currentUser.uid, setUnreadMessages);
    return () => unsubscribe();
  }, []);

  return (
    <View className="flex-1 bg-amber-50">
      {/* Header */}
      <View className="bg-amber-500 p-4 pt-12 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-white text-3xl font-bold">ShareBook</Text>
            <Text className="text-amber-100 text-sm mt-1">Connect with book lovers nearby</Text>
          </View>
          <View className="flex-row gap-2">
            <TouchableOpacity className="p-3 rounded-full bg-amber-600 shadow-sm">
              <Heart color="white" size={22} />
            </TouchableOpacity>
            
            <TouchableOpacity
              className="relative p-3 rounded-full bg-amber-600 shadow-sm"
              onPress={() => router.push({
                pathname: "/chat",
                params: {
                  receiverId: unreadMessages[0]?.senderId,
                  receiverName: unreadMessages[0]?.senderName
                }
              })}
            >
              <MessageCircle color="white" size={22} />
              {unreadMessages.length > 0 && (
                <View className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  <Text className="text-white text-xs font-bold">
                    {unreadMessages.length > 9 ? '9+' : unreadMessages.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity className="p-3 rounded-full bg-amber-600 shadow-sm">
              <User color="white" size={22} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View className="px-4 pt-4 pb-2 bg-amber-500">
        <View className="flex-row items-center bg-white rounded-2xl px-4 py-4 shadow-sm">
          <Search color="#9CA3AF" size={20} />
          <TextInput
            className="flex-1 ml-3 text-gray-700 text-base"
            placeholder="Search books, authors, or genres..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text className="text-amber-600 font-medium">Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main Content */}
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Section Header */}
        <View className="px-4 pt-6 pb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-gray-800">Books Near You</Text>
              <Text className="text-gray-500 text-sm mt-1">
                {filteredBooks.length} books available
              </Text>
            </View>
            <TouchableOpacity className="bg-amber-500 px-4 py-2 rounded-full flex-row items-center">
              <Plus color="white" size={16} />
              <Text className="text-white font-medium ml-1">Add Book</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Books Grid */}
        <View className="px-4">
          {loading ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#f59e0b" />
              <Text className="text-gray-500 mt-3">Loading books...</Text>
            </View>
          ) : filteredBooks.length === 0 ? (
            <View className="bg-white rounded-xl p-8 items-center shadow-sm">
              <BookOpen color="#D1D5DB" size={48} />
              <Text className="text-gray-600 text-lg font-medium mt-3">No books found</Text>
              <Text className="text-gray-500 text-sm text-center mt-1">
                {searchQuery ? 'Try different search terms' : 'Be the first to add a book!'}
              </Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {filteredBooks.map((book) => (
                <TouchableOpacity
                  key={book.id}
                  className="bg-white rounded-xl p-4 mb-4 shadow-sm"
                  style={{ width: '48%' }}
                  onPress={() => router.push({ pathname: '/home/[id]', params: { id: book.id } })}
                  activeOpacity={0.8}
                >
                  {/* Book Cover */}
                  <View className="mb-3">
                    <Image
                      source={{ uri: book.coverImage }}
                      className="w-full h-40 rounded-lg bg-gray-100"
                      resizeMode="cover"
                    />
                    {/* Availability Badge */}
                    <View className="absolute top-2 right-2">
                      <View className="bg-green-500 px-2 py-1 rounded-full">
                        <Text className="text-white text-xs font-medium">Available</Text>
                      </View>
                    </View>
                  </View>

                  {/* Book Info */}
                  <View className="space-y-1">
                    <Text className="font-bold text-gray-800 text-base leading-tight" numberOfLines={2}>
                      {book.title}
                    </Text>
                    <Text className="text-gray-600 text-sm" numberOfLines={1}>
                      by {book.author}
                    </Text>
                    
                    {/* Location */}
                    <View className="flex-row items-center mt-2">
                      <MapPin color="#9CA3AF" size={12} />
                      <Text className="text-gray-500 text-xs ml-1" numberOfLines={1}>
                        {book.location || "Location not specified"}
                      </Text>
                    </View>
                    
                    {/* Owner */}
                    <View className="flex-row items-center justify-between mt-2">
                      <Text className="text-amber-600 text-xs font-medium">
                        {book.username || "Unknown Owner"}
                      </Text>
                      <View className="flex-row items-center">
                        <View className="w-2 h-2 bg-green-400 rounded-full mr-1"></View>
                        <Text className="text-xs text-gray-500">Online</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions (if needed) */}
        {!loading && filteredBooks.length > 0 && (
          <View className="px-4 mt-6">
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <Text className="text-gray-800 font-semibold mb-2">Quick Actions</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity className="flex-1 bg-amber-100 p-3 rounded-lg items-center">
                  <BookOpen color="#F59E0B" size={20} />
                  <Text className="text-amber-700 text-xs font-medium mt-1">Browse All</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-amber-100 p-3 rounded-lg items-center">
                  <Heart color="#F59E0B" size={20} />
                  <Text className="text-amber-700 text-xs font-medium mt-1">Wishlist</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 bg-amber-100 p-3 rounded-lg items-center">
                  <User color="#F59E0B" size={20} />
                  <Text className="text-amber-700 text-xs font-medium mt-1">My Books</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Home;