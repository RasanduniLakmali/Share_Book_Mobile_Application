import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Dimensions, Alert, ActivityIndicator } from 'react-native';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  MessageCircle,
  User,
  Check,
  Edit,
  Trash2,
  Camera
} from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { Book } from '@/types/book';
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "@/firebase"; // your firebase config
import { deleteBook } from '@/services/bookService';
import * as ImagePicker from "expo-image-picker";
import { uploadToCloudinary } from "@/services/bookService"; 
import { getUserById } from '@/services/authService';


const { width } = Dimensions.get('window');

const availabilityOptions = [
  { id: 'available', label: 'Available for Exchange', status: true },
  { id: 'borrow', label: 'Available for Borrowing', status: true },
  { id: 'wishlist', label: 'On Wishlist', status: false }
];


const BookDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [book, setBook] = useState<Book | any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const currentUserId = auth.currentUser?.uid;
  const [isOwner, setIsOwner] = useState(false);

 useEffect(() => {
  const fetchBook = async () => {
    if (!id) return;

    try {
      const docRef = doc(db, "books", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const bookData = { id: docSnap.id, ...(docSnap.data() as Book) };
        setSelectedAvailability(bookData.isAvailable ? "available" : "borrow");
        setIsOwner(bookData.userId === currentUserId);

        // 🔥 Fetch owner info from `users` collection
        if (bookData.userId) {
          const userDoc = await getDoc(doc(db, "users", bookData.userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            bookData.username = userData.name || "Unknown User";
            bookData.ownerAvatar = userData.avatar || null;
            bookData.location = userData.location || "N/A";
          }
        }

        setBook(bookData);
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
}, [id, currentUserId]);



  // Save updated book
const handleSave = async () => {
  if (!book) return;
  try {
    const bookRef = doc(db, "books", book.id);
    await updateDoc(bookRef, {
      title: book.title,
      author: book.author,
      category: book.category,
      description: book.description,
      location: book.location,
      condition: book.condition,
    });

    Alert.alert("Success", "Book updated successfully!");
    setIsEditing(false);
  } catch (error) {
    console.error("Error updating book:", error);
    Alert.alert("Error", "Failed to update book");
  }
};


  // Delete book
  const handleDelete = async () => {
    if (!book) return;

    Alert.alert(
      "Delete Book",
      `Are you sure you want to delete "${book.title}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
          
              await deleteBook(book.id);
              Alert.alert("Success", "Book deleted successfully!");
              router.back(); // Navigate back after deletion
              
            } catch (error) {
              console.error("Error deleting book:", error);
              Alert.alert("Error", "Failed to delete book");
            }
          }
        }
      ]
    );
  };

  if (!book) {
  return (
    <View className="flex-1 items-center justify-center bg-amber-50">
      <ActivityIndicator size="large" color="#f59e0b" />
      <Text className="text-gray-600 mt-3">Loading book details...</Text>
    </View>
  );
}

  const handleRequestBook = async (book: any) => {
    Alert.alert("Success", "Request email sent successfully!");
  }


  const handleCoverImageUpdate = async () => {
  // Ask permission
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    Alert.alert("Permission required", "You need to allow access to photos.");
    return;
  }

  // Open gallery
  const pickerResult = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    aspect: [3, 4], // book cover ratio
    quality: 0.8,
  });

  if (!pickerResult.canceled) {
    const imageUri = pickerResult.assets[0].uri;

    try {
      // Upload to Cloudinary
      const cloudinaryUrl = await uploadToCloudinary(imageUri,'image');

      // Update Firestore
      const bookRef = doc(db, "books", book.id);
      await updateDoc(bookRef, { coverImage: cloudinaryUrl });

      // Update local state
      setBook({ ...book, coverImage: cloudinaryUrl });

      Alert.alert("✅ Success", "Book cover updated!");
    } catch (error) {
      console.error("❌ Error updating book cover:", error);
      Alert.alert("Error", "Failed to update book cover.");
    }
  }
};


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
            {/* Edit Button in Header */}
            {isOwner && (
              <TouchableOpacity
                className={`p-2 rounded-full ${isEditing ? 'bg-green-500' : 'bg-white'}`}
                onPress={isEditing ? handleSave : () => setIsEditing(true)}
              >
                {isEditing ? (
                  <Check size={24} color="white" />
                ) : (
                  <Edit size={24} color="#f59e0b" />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* Edit Mode Indicator */}
        {isEditing && (
          <View className="mt-3 bg-amber-600 px-3 py-2 rounded-full self-start">
            <Text className="text-white text-sm font-medium">✏️ Editing Mode</Text>
          </View>
        )}
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-4 py-6">

        {/* Book Cover and Title */}
  <View className="items-center mb-6">
  <View className="relative">
    <Image 
      source={{ uri: book.coverImage }} 
      className="w-48 h-72 rounded-xl shadow-lg mb-4"
    />
    
    {/* Camera Overlay - Only visible to owner in edit mode */}
    {isOwner && isEditing && (
      <TouchableOpacity
        className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2"
        onPress={handleCoverImageUpdate}
      >
        <Camera size={20} color="white" />
      </TouchableOpacity>
    )}
  </View>
       {isEditing ? (  
    <TextInput
      value={book.title}
      onChangeText={(text) => setBook({ ...book, title: text })}
      className="text-2xl font-bold text-gray-800 text-center border-b border-amber-300 py-1 w-64"
    />
  ) : (
    <Text className="text-2xl font-bold text-gray-800 text-center">{book.title}</Text>
  )}
   {isEditing ? (
            <View className="flex-row items-center mt-2">
              <Text className="text-lg text-amber-600 mr-1">by </Text>
              <TextInput
                value={book.author}
                onChangeText={(text) => setBook({ ...book, author: text })}
                className="text-lg text-amber-600 border-b border-amber-300 py-1 flex-1 text-center"
              />
            </View>
          ) : (
            <Text className="text-lg text-amber-600 mb-2">by {book.author}</Text>
          )}
</View>
        {/* Book Details */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-3">Book Details</Text>
          <View className="gap-2">
            <View className="flex-row">
              <Text className="font-medium text-gray-700 w-24">Category:</Text>
              {isEditing ? (
                <TextInput
                  value={book.category}
                  onChangeText={(text) => setBook({ ...book, category: text })}
                  className="text-gray-600 border-b border-amber-200 flex-1"
                />
              ) : (
                <Text className="text-gray-600">{book.category || "N/A"}</Text>
              )}
            </View>
            <View className="flex-row">
              <Text className="font-medium text-gray-700 w-24">Location:</Text>
              {isEditing ? (
                <TextInput
                  value={book.location}
                  onChangeText={(text) => setBook({ ...book, location: text })}
                  className="text-gray-600 border-b border-amber-200 flex-1"
                />
              ) : (
                <Text className="text-gray-600">{book.location || "N/A"}</Text>
              )}
            </View>
            <View className="flex-row">
              <Text className="font-medium text-gray-700 w-24">Condition:</Text>
              {isEditing ? (
                <TextInput
                  value={book.condition}
                  onChangeText={(text) => setBook({ ...book, condition: text })}
                  className="text-gray-600 border-b border-amber-200 flex-1"
                />
              ) : (
                <Text className="text-gray-600">{book.condition || "N/A"}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Description */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-3">Description</Text>
          {isEditing ? (
            <TextInput
              value={book.description}
              onChangeText={(text) => setBook({ ...book, description: text })}
              multiline
              numberOfLines={4}
              className="text-gray-600 border-b border-amber-200 p-2 rounded"
            />
          ) : (
            <Text className="text-gray-600 leading-6">{book.description || "No description available."}</Text>
          )}
        </View>

        {/* Owner Information */}
        {book.userId && (
          <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-3">Owner Information</Text>
            <View className="flex-row items-center mb-4">
              <Image 
                source={{ uri: book.ownerAvatar || "https://via.placeholder.com/150" }} 
                className="w-16 h-16 rounded-full mr-4"
              />
              <View className="flex-1">
                <Text className="font-bold text-gray-800 text-lg">{book.username}</Text>
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
                onPress={() => setSelectedAvailability(option.id)}
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

        {/* Edit Mode Instructions */}
        {isEditing && (
          <View className="bg-amber-100 border border-amber-300 rounded-xl p-4 mb-6">
            <Text className="text-amber-800 font-medium text-center">
              Make your changes and tap the checkmark in the header to save
            </Text>
          </View>
        )}

        {/* Delete Section - Only visible to owner */}
        {isOwner && (
          <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-3">Danger Zone</Text>
            <TouchableOpacity
              className="bg-red-50 border border-red-200 rounded-xl p-4 flex-row items-center justify-center"
              onPress={handleDelete}
            >
              <Trash2 size={20} color="#dc2626" />
              <Text className="text-red-600 font-medium ml-2">Delete This Book</Text>
            </TouchableOpacity>
            <Text className="text-gray-500 text-sm text-center mt-2">
              This action cannot be undone
            </Text>
          </View>
        )}
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
          onPress={() => handleRequestBook(book)}   
        >
          <User size={20} color="white" />
          <Text className="text-white font-medium ml-2">Request</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default BookDetailsScreen;