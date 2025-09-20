import * as React from 'react';
import { useEffect, useState } from 'react';
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { useLoader } from "@/context/LoaderContext"
import { useAuth } from "@/context/authContext";
import { saveBook, updateBook ,uploadToCloudinary} from "@/services/bookService";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Camera, Plus, BookOpen, User, FileText, Star, MapPin, Upload, Share2, Tag } from 'lucide-react-native';
import { getUserById } from '@/services/authService';

const AddBookScreen = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState<"new" | "good" | "used">("good");
  const [location, setLocation] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('Available');
  const [photo, setPhoto] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  
  
  const availabilityOptions = ['Available', 'Currently Borrowed', 'Not Available'];

  const { showLoader, hideLoader } = useLoader()
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isNew = !id || id === "new" || id === "index"; // treat default 'index' as new

  const { user, loading } = useAuth()

  const [ownerUsername, setOwnerUsername] = useState(user?.displayName || "");

  const categories = [
    "Novel",
    "Science",
    "History",
    "Biography",
    "Fiction",
    "Non-Fiction",
    "Educational",
    "Self-Help",
    "Other",
  ];



  const handleAddBook = async () => {
  if (!title || !author || !category || !description || !location) {
    Alert.alert("Error", "Please fill in all required fields");
    return;
  }

  showLoader();

  try {
    let uploadedCoverUrl = coverImage;
    let uploadedPdfUrl = pdfFile;

    // Upload cover image to Cloudinary
    if (coverImage) {
      uploadedCoverUrl = await uploadToCloudinary(coverImage, 'image');
      console.log("Image uploaded to Cloudinary:", uploadedCoverUrl);
    }

    // Upload PDF to Cloudinary
    if (pdfFile) {
      uploadedPdfUrl = await uploadToCloudinary(pdfFile, 'pdf');
      console.log("PDF uploaded to Cloudinary:", uploadedPdfUrl);
    }

    const book = {
      title,
      author,
      category,
      description,
      condition,
      coverImage: uploadedCoverUrl,
      pdfFile: uploadedPdfUrl,
      isAvailable,
      location,
      userId: user?.uid,
      username: ownerUsername, 
    };

    if (isNew) {
      const bookId = await saveBook(book);
      Alert.alert("Success", "Book added successfully!");
    } else {
      await updateBook(id!, book);
      Alert.alert("Success", "Book updated successfully!");
    }

    // Reset form
    setTitle("");
    setAuthor("");
    setCategory("");
    setDescription("");
    setCondition("good");
    setCoverImage(null);
    setPdfFile(null);
    setIsAvailable(true);
    setLocation("");
    setOwnerUsername(user?.displayName || "Unknown User");
    router.back();
  } catch (error) {
    console.error("Error saving book:", error);
    Alert.alert("Error", "Failed to add book. Please try again.");
  } finally {
    hideLoader();
  }
};

useEffect(() => {
  const fetchUsername = async () => {
    if (user) {
      try {
        const dbUser = await getUserById(user.uid);
        setOwnerUsername(dbUser?.name || user.displayName || "Unknown User");
      } catch (err) {
        console.error("Error fetching username:", err);
        setOwnerUsername(user.displayName || "Unknown User");
      }
    }
  };

  fetchUsername();
}, [user]);


const handleImagePicker = async () => {
  const permissionRes = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ correct
    allowsEditing: true,
    quality: 1,
  });

  if (permissionRes.canceled) {
    Alert.alert("Permission Denied", "You need to give permission to access the library");
    return;
  }

  if (permissionRes.assets && permissionRes.assets.length > 0) {
    setCoverImage(permissionRes.assets[0].uri);
  }
};

  const handlePdfUpload = async() => {
   try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (result.canceled) {
      console.log("User canceled PDF picking");
    } else {
      const file = result.assets[0];
      setPdfFile(file.uri); // save PDF URI to state
      console.log("Picked PDF:", file);
    }
  } catch (err) {
    console.error("Error picking PDF:", err);
  }
  };

  return (
    <View className="flex-1 bg-amber-50">
      {/* Header */}
      <View className="bg-amber-500 p-4 pt-12">
        <Text className="text-white text-2xl font-bold">Add New Book</Text>
        <Text className="text-amber-100 text-sm">Share your book with the community</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-6" showsVerticalScrollIndicator={false}>
        
        {/* Book Cover Image Section */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <View className="flex-row items-center mb-4">
            <Camera color="#F59E0B" size={20} />
            <Text className="text-lg font-semibold text-gray-800 ml-2">Book Cover</Text>
          </View>
          
          <TouchableOpacity 
            className="w-full h-48 bg-amber-50 rounded-xl border-2 border-dashed border-amber-300 items-center justify-center"
            onPress={handleImagePicker}
          >
            {coverImage ? (
              <View className="w-full h-full relative">
                <Image 
                  source={{ uri: coverImage }} 
                  className="w-full h-full rounded-xl"
                  resizeMode="cover"
                />
                <View className="absolute bottom-2 left-2 bg-green-500 px-2 py-1 rounded-full">
                  <Text className="text-white text-xs font-medium">✓ Image Selected</Text>
                </View>
              </View>
            ) : (
              <View className="items-center">
                <Camera color="#F59E0B" size={48} />
                <Text className="text-amber-600 mt-2 font-medium">Tap to add cover photo</Text>
                <Text className="text-gray-500 text-sm">Recommended: Book front cover</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Basic Information Section */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">Basic Information</Text>

          {/* Title Input */}
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <BookOpen color="#F59E0B" size={18} />
              <Text className="text-gray-700 font-medium ml-2">Book Title *</Text>
            </View>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 bg-gray-50 text-gray-800"
              placeholder="Enter book title"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Author Input */}
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <User color="#F59E0B" size={18} />
              <Text className="text-gray-700 font-medium ml-2">Author *</Text>
            </View>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 bg-gray-50 text-gray-800"
              placeholder="Enter author name"
              value={author}
              onChangeText={setAuthor}
            />
          </View>

          {/* Location Input */}
          <View className="mb-4">
            <View className="flex-row items-center mb-2">
              <MapPin color="#F59E0B" size={18} />
              <Text className="text-gray-700 font-medium ml-2">Your Location *</Text>
            </View>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 bg-gray-50 text-gray-800"
              placeholder="e.g., Colombo, Kandy, Galle"
              value={location}
              onChangeText={setLocation}
            />
          </View>

                  
{/* Owner Username Input */}
<View className="mb-4">
  <View className="flex-row items-center mb-2">
    <User color="#F59E0B" size={18} />
    <Text className="text-gray-700 font-medium ml-2">Your Username</Text>
  </View>
  <TextInput
    className="border border-gray-300 rounded-xl p-4 bg-amber-50 text-gray-800"
    placeholder="Your display name"
    value={ownerUsername}
    editable={false}
  />
  <Text className="text-xs text-gray-500 mt-1">
    This is how your name will appear to other users
  </Text>
</View>

          {/* Description Input */}
          <View>
            <View className="flex-row items-center mb-2">
              <FileText color="#F59E0B" size={18} />
              <Text className="text-gray-700 font-medium ml-2">Description *</Text>
            </View>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 bg-gray-50 h-24 text-gray-800"
              placeholder="Brief description of the book..."
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Category Selection Section */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <View className="flex-row items-center mb-4">
            <Tag color="#F59E0B" size={18} />
            <Text className="text-lg font-bold text-gray-800 ml-2">Category *</Text>
          </View>
          
          <View className="flex-row flex-wrap gap-2">
            {categories.map((item) => (
              <TouchableOpacity
                key={item}
                className={`px-4 py-2 rounded-full border ${
                  category === item
                    ? 'bg-amber-500 border-amber-500'
                    : 'bg-gray-50 border-gray-300'
                }`}
                onPress={() => setCategory(item)}
              >
                <Text
                  className={`text-sm font-medium ${
                    category === item ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Book Condition Section */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <View className="flex-row items-center mb-4">
            <Star color="#F59E0B" size={18} />
            <Text className="text-lg font-bold text-gray-800 ml-2">Book Condition</Text>
          </View>
          
          <View className="flex-row justify-between">
            {["new", "good", "used"].map((c) => (
              <TouchableOpacity 
                key={c} 
                className="flex-1 mx-1"
                onPress={() => setCondition(c as any)}
              >
                <View className={`p-3 rounded-xl border-2 items-center ${
                  condition === c ? "border-amber-500 bg-amber-50" : "border-gray-200 bg-gray-50"
                }`}>
                  <View
                    className={`w-5 h-5 rounded-full border-2 mb-2 items-center justify-center ${
                      condition === c ? "border-amber-500 bg-amber-500" : "border-gray-300"
                    }`}
                  >
                    {condition === c && <View className="w-2 h-2 bg-white rounded-full" />}
                  </View>
                  <Text className={`text-sm font-medium capitalize ${
                    condition === c ? "text-amber-600" : "text-gray-700"
                  }`}>
                    {c}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Availability Section */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <View className="flex-row items-center mb-4">
            <Share2 color="#F59E0B" size={18} />
            <Text className="text-lg font-bold text-gray-800 ml-2">Availability Status</Text>
          </View>
          
          <View className="gap-2">
            {availabilityOptions.map((item) => (
              <TouchableOpacity
                key={item}
                className={`p-3 rounded-xl border flex-row items-center ${
                  availabilityStatus === item
                    ? 'bg-green-50 border-green-500'
                    : 'bg-gray-50 border-gray-300'
                }`}
                onPress={() => setAvailabilityStatus(item)}
              >
                <View className={`w-4 h-4 rounded-full border-2 mr-3 items-center justify-center ${
                  availabilityStatus === item ? "border-green-500 bg-green-500" : "border-gray-300"
                }`}>
                  {availabilityStatus === item && <View className="w-2 h-2 bg-white rounded-full" />}
                </View>
                <Text className={`font-medium ${
                  availabilityStatus === item ? 'text-green-600' : 'text-gray-700'
                }`}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* PDF Upload Section */}
        <View className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <View className="flex-row items-center mb-4">
            <Upload color="#F59E0B" size={18} />
            <Text className="text-lg font-bold text-gray-800 ml-2">Book Preview (Optional)</Text>
          </View>
          
          <TouchableOpacity 
            className={`w-full h-24 rounded-xl border-2 border-dashed items-center justify-center ${
              pdfFile ? 'bg-green-50 border-green-300' : 'bg-amber-50 border-amber-300'
            }`}
            onPress={handlePdfUpload}
          >
            {pdfFile ? (
              <View className="items-center">
                <FileText color="#10B981" size={32} />
                <Text className="text-green-600 font-medium mt-1">PDF Uploaded</Text>
                <Text className="text-gray-500 text-xs">Tap to change</Text>
              </View>
            ) : (
              <View className="items-center">
                <Upload color="#F59E0B" size={32} />
                <Text className="text-amber-600 font-medium mt-1">Upload PDF Preview</Text>
                <Text className="text-gray-500 text-xs">Optional - First few pages</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-amber-500 rounded-xl py-4 items-center justify-center mb-8 shadow-sm"
          onPress={handleAddBook}
        >
          <View className="flex-row items-center">
            <Plus color="white" size={20} />
            <Text className="text-white text-lg font-bold ml-2">
              {isNew ? "Add to Collection" : "Update Book"}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default AddBookScreen;