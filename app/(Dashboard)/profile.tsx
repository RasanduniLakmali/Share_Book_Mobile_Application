import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Camera, Edit3, MapPin, BookOpen, Calendar, Mail, Phone, LogOut } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { db, auth } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc} from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { uploadToCloudinary,logout } from '@/services/authService';
import { onSnapshot } from "firebase/firestore";
import { StatusBar } from "expo-status-bar";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState<any>(null);
  const [books, setBooks] = useState<any[]>([]);

  const currentUserId = auth.currentUser?.uid;

  const router = useRouter();

  useEffect(() => {
  if (!currentUserId) return;

  const fetchUserData = async () => {
    try {
      // User profile (still one-time fetch)
      const userDoc = await getDoc(doc(db, 'users', currentUserId));
      if (userDoc.exists()) setUserData(userDoc.data());

      // 🔥 Real-time listener for books
      const booksQuery = query(collection(db, 'books'), where('userId', '==', currentUserId));
      const unsubscribe = onSnapshot(booksQuery, (snapshot) => {
        const booksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBooks(booksData);
      });

      return unsubscribe; // cleanup listener when component unmounts
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const unsubscribePromise = fetchUserData();

  // Cleanup
  return () => {
    unsubscribePromise.then(unsub => unsub && unsub());
  };
}, [currentUserId]);



  const handleSave = async () => {
  if (!auth.currentUser) return;

  try {
    const userRef = doc(db, "users", auth.currentUser.uid);

    // remove undefined values
    const safeData = Object.fromEntries(
      Object.entries({
        name: userData?.name,
        location: userData?.location,
        phone: userData?.phone,
        email: userData?.email,
      }).filter(([_, v]) => v !== undefined && v !== null)
    );

    await updateDoc(userRef, safeData);

    setIsEditing(false);
    Alert.alert("Profile updated successfully!");
    console.log("✅ Profile updated in Firestore");
  } catch (error) {
    console.error("❌ Error updating profile:", error);
  }
};


const handleImagePick = async () => {
    // Ask permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // Open image picker
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!pickerResult.canceled) {
      const imageUri = pickerResult.assets[0].uri;

      try {
        // Upload to Cloudinary
        const cloudinaryUrl = await uploadToCloudinary(imageUri);

        // Save URL in Firestore
        const userRef = doc(db, "users", auth.currentUser!.uid);
        await updateDoc(userRef, { avatar: cloudinaryUrl });

        setUserData({ ...userData, avatar: cloudinaryUrl });
        Alert.alert("Profile image updated!");
        console.log("✅ Profile image updated:", cloudinaryUrl);
      } catch (error) {
        console.error("❌ Error uploading image:", error);
      }
    }
  };

  const handleLogout = async () => {
  Alert.alert(
    "Logout",
    "Are you sure you want to logout?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            console.log("✅ User logged out successfully");

            // Redirect to login
            router.replace("/login");

            Alert.alert("Success", "You have been logged out successfully!");
          } catch (error) {
            console.error("❌ Error logging out:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        }
      }
    ]
  );
};


  if (loading) {
     return (
        <View className="flex-1 items-center justify-center bg-amber-50">
          <ActivityIndicator size="large" color="#f59e0b" />
          <Text className="text-gray-600 mt-3">Loading profile details...</Text>
        </View>
      );
  }

  return (
    <View className="flex-1 bg-amber-50">
       <StatusBar style="dark" backgroundColor="#ffffff" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white pt-12 pb-6 px-6 rounded-b-3xl shadow-sm items-center">
          <View className="relative">
            <Image
              source={{ uri: userData?.avatar }}
              className="w-24 h-24 rounded-full border-4 border-amber-400"
            />
            <TouchableOpacity 
            className="absolute bottom-0 right-0 bg-amber-500 rounded-full p-2 border-2 border-white"
            onPress={handleImagePick}
            >
              <Camera size={16} color="white" />
            </TouchableOpacity>
          </View>

          {/* Name and Location */}
          <View className="mt-4 items-center">
            {isEditing ? (
              <TextInput
                value={userData?.name}
                onChangeText={(text) => setUserData({ ...userData, name: text })}
                className="text-2xl font-bold text-gray-800 text-center border-b border-amber-300 py-1 w-64"
              />
            ) : (
              <Text className="text-2xl font-bold text-gray-800">{userData?.name}</Text>
            )}

            <View className="flex-row items-center mt-1">
              <MapPin size={16} color="#D97706" />
              {isEditing ? (
                <TextInput
                  value={userData?.location}
                  onChangeText={(text) => setUserData({ ...userData, location: text })}
                  className="text-amber-700 ml-1 border-b border-amber-200 py-1 w-48"
                />
              ) : (
                <Text className="text-amber-700 ml-1">{userData?.location}</Text>
              )}
            </View>

            {/* Stats */}
            <View className="mt-3 flex-row">
              <View className="items-center mx-4">
                <Text className="text-lg font-bold text-gray-800">{books.length}</Text>
                <Text className="text-xs text-gray-600">Books Shared</Text>
              </View>
            </View>
          </View>

         <TouchableOpacity 
              className="mt-4 bg-amber-500 px-6 py-2 rounded-full flex-row items-center"
              onPress={isEditing ? handleSave : () => setIsEditing(true)}
          >
         <Edit3 size={16} color="white" />
        <Text className="text-white font-medium ml-2">
       {isEditing ? "Save Profile" : "Edit Profile"}
        </Text>
        </TouchableOpacity>

        </View>

        {/* Bio */}
        {/* <View className="bg-white mx-4 mt-6 p-4 rounded-xl shadow-sm">
          <Text className="text-gray-800 font-bold mb-2">About Me</Text>
          {isEditing ? (
            <TextInput
              value={userData?.bio}
              onChangeText={(text) => setUserData({ ...userData, bio: text })}
              multiline
              className="text-gray-600 border border-amber-200 rounded-lg p-2"
              numberOfLines={3}
            />
          ) : (
            <Text className="text-gray-600">{userData?.bio}</Text>
          )}
        </View> */}

        {/* Contact Info */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
          <Text className="text-gray-800 font-bold mb-2">Contact Information</Text>
          <View className="flex-row items-center mt-2">
            <Mail size={18} color="#D97706" />
            {isEditing ? (
              <TextInput
                value={userData?.email}
                onChangeText={(text) => setUserData({ ...userData, email: text })}
                className="text-gray-600 ml-2 border-b border-amber-200 py-1 flex-1"
              />
            ) : (
              <Text className="text-gray-600 ml-2">{userData?.email}</Text>
            )}
          </View>
          <View className="flex-row items-center mt-2">
            <Phone size={18} color="#D97706" />
            {isEditing ? (
              <TextInput
                value={userData?.phone}
                onChangeText={(text) => setUserData({ ...userData, phone: text })}
                className="text-gray-600 ml-2 border-b border-amber-200 py-1 flex-1"
              />
            ) : (
              <Text className="text-gray-600 ml-2">{userData?.phone}</Text>
            )}
          </View>
        </View>

        {/* Book Collection */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm mb-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-800 font-bold">My Book Collection</Text>
            <BookOpen size={18} color="#D97706" />
          </View>

           <View className="flex-row flex-wrap gap-3">
  {books.map((book) => (
    <TouchableOpacity
      key={book.id}
      className="flex-1 min-w-[30%]"
      onPress={() => router.push(`/home/${book.id}`)}
    >
      <Image 
        source={{ uri: book.coverImage }} 
        className="w-full h-32 rounded-lg"
      />
      <Text className="text-gray-800 font-medium mt-1 text-sm" numberOfLines={1}>
        {book.title}
      </Text>
      <Text className="text-gray-600 text-xs" numberOfLines={1}>
        {book.author}
      </Text>
    </TouchableOpacity>
  ))}
</View>
        </View>

        {/* Member since */}
           <View className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm mb-6 flex-row items-center">
  <Calendar size={18} color="#D97706" />
  <Text className="text-gray-600 ml-2">
  Member since{" "}
  <Text className="font-medium text-gray-800">{userData?.createdAt || "N/A"}</Text>
</Text>
</View>

        {/* Logout Section */}
        <View className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm mb-8">
          <Text className="text-gray-800 font-bold mb-3">Account Actions</Text>
          <TouchableOpacity
            className="bg-red-50 border border-red-200 rounded-xl p-4 flex-row items-center justify-center"
            onPress={handleLogout}
          >
            <LogOut size={20} color="#dc2626" />
            <Text className="text-red-600 font-medium ml-2">Logout</Text>
          </TouchableOpacity>
          <Text className="text-gray-500 text-sm text-center mt-2">
            You will be signed out of your account
          </Text>
        </View>

      </ScrollView>
    </View>
  );
};

export default Profile;
