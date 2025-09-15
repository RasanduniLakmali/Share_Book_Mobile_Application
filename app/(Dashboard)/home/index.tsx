
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator } from 'react-native';
import { BookOpen, Search, Heart, MessageCircle, User, MapPin } from 'lucide-react-native';
import { collection, getDocs } from "firebase/firestore";
import {db} from "@/firebase" // make sure this points to your firebase setup
import { useRouter } from 'expo-router';
import { auth } from "@/firebase";
import { subscribeUnreadMessages } from "@/services/messageService";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState<any[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "books"));
        const booksData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBooks(booksData);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
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
      <View className="bg-amber-500 p-4 pt-12">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-2xl font-bold">ShareBook</Text>
            <Text className="text-amber-100 text-sm">Connect with book lovers nearby</Text>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity className="p-2 rounded-full bg-amber-600">
              <Heart color="white" size={24} />
            </TouchableOpacity>
            <TouchableOpacity
  className="relative p-2 rounded-full bg-amber-600"
  onPress={() => router.push({
    pathname: "/chat",
    params: {
      receiverId: unreadMessages[0].senderId, // example: open first unread chat
      receiverName: unreadMessages[0].senderName // make sure you store senderName in messages
    }
  })}
>
  <MessageCircle color="white" size={24} />
  {unreadMessages.length > 0 && (
    <View className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 rounded-full flex items-center justify-center">
      <Text className="text-white text-xs font-bold">{unreadMessages.length}</Text>
    </View>
  )}
</TouchableOpacity>


            <TouchableOpacity className="p-2 rounded-full bg-amber-600">
              <User color="white" size={24} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View className="p-4 bg-amber-500">
        <View className="flex-row items-center bg-white rounded-full px-4 py-3">
          <Search color="#6b7280" size={20} />
          <TextInput
            className="flex-1 ml-3 text-gray-700"
            placeholder="Search books, authors, or users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Featured Books */}
        <View className="mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-gray-800">Books Near You</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#f59e0b" />
          ) : filteredBooks.length === 0 ? (
            <Text className="text-gray-600">No books found</Text>
          ) : (
            <View className="flex-row flex-wrap gap-4">
              {filteredBooks.map((book) => (
                <TouchableOpacity
                  key={book.id}
                  className="bg-white rounded-xl p-3 flex-1 min-w-[45%] shadow-sm"
                  onPress={() => router.push({ pathname: '/home/[id]', params: { id: book.id } })}
                >
                  <Image
                    source={{ uri: book.coverImage }}
                    className="w-full h-32 rounded-lg mb-2"
                    resizeMode="cover"
                  />
                  <Text className="font-bold text-gray-800 mt-1" numberOfLines={1}>
                    {book.title}
                  </Text>
                  <Text className="text-gray-600 text-sm mb-2" numberOfLines={1}>
                    {book.author}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <MapPin color="#94a3b8" size={14} />
                    <Text className="text-gray-500 text-xs ml-1">{book.location || "N/A"}</Text>
                  </View>
                  <Text className="text-amber-600 text-xs mt-1">
                    Owned by {book.owner || "Unknown"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;
