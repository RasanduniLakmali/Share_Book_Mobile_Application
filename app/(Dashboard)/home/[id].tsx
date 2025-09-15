import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  MessageCircle,
  User
} from 'lucide-react-native';

import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { Book } from '@/types/book';

const { width } = Dimensions.get('window');

const availabilityOptions = [
  { id: 'available', label: 'Available for Exchange', status: true },
  { id: 'borrow', label: 'Available for Borrowing', status: true },
  { id: 'wishlist', label: 'On Wishlist', status: false }
];

const BookDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [book, setBook] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "books", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBook({ id: docSnap.id, ...docSnap.data() });
        } else {
          Alert.alert("Error", "Book not found");
          router.back();
        }
      } catch (error) {
        console.error("Error fetching book:", error);
        Alert.alert("Error", "Failed to fetch book details");
      }
    };
    fetchBook();
  }, [id]);

  

    useEffect(() => {
  const fetchBook = async () => {
    if (!id) return;

    const docRef = doc(db, "books", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // ✅ cast to Book
      const bookData = { id: docSnap.id, ...(docSnap.data() as Book) };
      setBook(bookData);
      setSelectedAvailability(bookData.isAvailable ? 'available' : 'borrow'); // set string for UI
    } else {
      Alert.alert("Error", "Book not found");
      router.back();
    }
  };

  fetchBook();
}, [id]);



  const handleRequest = () => {
    Alert.alert("Request Sent", `Request sent to ${book?.owner} for ${book?.title}`);
  };

  if (!book) return <Text className="p-4">Loading...</Text>;

  return (
    <View className="flex-1 bg-amber-50">
      {/* Header */}
      <View className="bg-amber-500 pt-12 pb-4 px-4">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          <View className="flex-row gap-4">
            <TouchableOpacity 
              className="p-2 rounded-full bg-amber-600"
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Heart 
                size={24} 
                color="white" 
                fill={isFavorite ? "#ef4444" : "none"} 
              />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 rounded-full bg-amber-600">
              <Share2 size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-4 py-6">
        {/* Book Cover and Title */}
        <View className="items-center mb-6">
          <Image 
            source={{ uri: book.coverImage }} 
            className="w-48 h-72 rounded-xl shadow-lg mb-4"
          />
          <Text className="text-2xl font-bold text-gray-800 text-center">{book.title}</Text>
          <Text className="text-lg text-amber-600 mb-2">by {book.author}</Text>
          <View className="flex-row items-center">
            {book.rating && (
              <>
                <Text className="text-yellow-500 font-bold">{book.rating}</Text>
                <Text className="text-gray-500 ml-1">({book.reviews || 0} reviews)</Text>
              </>
            )}
          </View>
        </View>

        {/* Book Details */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-3">Book Details</Text>
          <View className="gap-2">
            <View className="flex-row">
              <Text className="font-medium text-gray-700 w-24">Category:</Text>
              <Text className="text-gray-600">{book.category || "N/A"}</Text>
            </View>
            <View className="flex-row">
              <Text className="font-medium text-gray-700 w-24">Location:</Text>
              <Text className="text-gray-600">{book.location || "N/A"}</Text>
            </View>
            <View className="flex-row">
              <Text className="font-medium text-gray-700 w-24">Condition:</Text>
              <Text className="text-gray-600">{book.condition || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-3">Description</Text>
          <Text className="text-gray-600 leading-6">{book.description || "No description available."}</Text>
        </View>

        {/* Owner Information */}
        {book.owner && (
          <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-3">Owner Information</Text>
            <View className="flex-row items-center mb-4">
              <Image 
                source={{ uri: book.ownerAvatar || "https://via.placeholder.com/150" }} 
                className="w-16 h-16 rounded-full mr-4"
              />
              <View className="flex-1">
                <Text className="font-bold text-gray-800 text-lg">{book.owner}</Text>
                <View className="flex-row items-center mt-1">
                  <MapPin size={14} color="#6b7280" />
                  <Text className="text-gray-500 text-sm ml-1">{book.location || "N/A"}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Availability Status */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-3">Availability</Text>
          <View className="gap-3">
            {availabilityOptions.map((option) => (
  <TouchableOpacity 
    key={option.id}
    className={`flex-row items-center p-3 rounded-lg border ${
      selectedAvailability === option.id 
        ? 'border-amber-500 bg-amber-50' 
        : 'border-gray-200'
    }`}
    onPress={() => setSelectedAvailability(option.id)} // optional: let user change
  >
    <View className={`w-4 h-4 rounded-full border mr-3 ${
      selectedAvailability === option.id 
        ? 'border-amber-500 bg-amber-500' 
        : 'border-gray-300'
    }`}>
      {selectedAvailability === option.id && (
        <View className="w-2 h-2 bg-white rounded-full m-1" />
      )}
    </View>
    <Text className={`${
      selectedAvailability === option.id 
        ? 'text-amber-600 font-medium' 
        : 'text-gray-700'
    }`}>
      {option.label}
    </Text>
    {option.status && (
      <View className="ml-auto">
        <View className="w-2 h-2 bg-green-500 rounded-full" />
      </View>
    )}
  </TouchableOpacity>
))}

          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View className="flex-row p-4 gap-3 bg-white border-t border-gray-200">
        <TouchableOpacity
  className="flex-1 flex-row items-center justify-center bg-white border border-amber-500 rounded-full py-3"
  onPress={() => router.push({
    pathname: "/chat",
    params: { 
      receiverId: book.userId, 
      receiverName: book.username 
    }
  })}
>
  <MessageCircle size={20} color="#f59e0b" />
  <Text className="text-amber-600 font-medium ml-2">Message</Text>
</TouchableOpacity>

        <TouchableOpacity 
          className="flex-1 flex-row items-center justify-center bg-amber-500 rounded-full py-3"
          onPress={handleRequest}
        >
          <User size={20} color="white" />
          <Text className="text-white font-medium ml-2">Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default BookDetailsScreen;
