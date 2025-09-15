import * as React from 'react';
import { useState } from 'react';
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { useLoader } from "@/context/LoaderContext"
import { useAuth } from "@/context/authContext";
import { saveBook, updateBook ,uploadToCloudinary} from "@/services/bookService";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Camera, Plus, BookOpen, User, FileText, Star, MapPin, Upload, Share2, Tag } from 'lucide-react-native';

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
      owner: user?.displayName || user?.email || "Unknown",
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

    router.back();
  } catch (error) {
    console.error("Error saving book:", error);
    Alert.alert("Error", "Failed to add book. Please try again.");
  } finally {
    hideLoader();
  }
};



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
      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-3xl font-bold text-gray-800 mb-2">Add New Book</Text>
        <Text className="text-gray-600 mb-8">Share your book with the community</Text>

        {/* Book Photo Section */}
        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Book Photo</Text>
          <TouchableOpacity 
            className="w-full h-48 bg-white rounded-xl border-2 border-dashed border-amber-300 items-center justify-center mb-4"
            onPress={handleImagePicker}
          >
            {coverImage ? (
              <>
              <Image 
                source={{ uri: coverImage }} 
                className="w-full h-full rounded-xl"
                resizeMode="cover"
              />
              <Text className="text-green-700 mt-2 font-medium">✅ Cover image selected</Text>
              </>
              
            ) : (
              <View className="items-center">
                <Camera color="#F59E0B" size={48} />
                <Text className="text-gray-500 mt-2">Tap to add photo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Book Information Form */}
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <Text className="text-xl font-bold text-gray-800 mb-6">Book Details</Text>

          {/* Title Input */}
          <View className="mb-5">
            <View className="flex-row items-center mb-2">
              <BookOpen color="#F59E0B" size={20} className="mr-2" />
              <Text className="text-gray-700 font-medium">Title</Text>
            </View>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 bg-gray-50"
              placeholder="Enter book title"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          {/* Author Input */}
          <View className="mb-5">
            <View className="flex-row items-center mb-2">
              <User color="#F59E0B" size={20} className="mr-2" />
              <Text className="text-gray-700 font-medium">Author</Text>
            </View>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 bg-gray-50"
              placeholder="Enter author name"
              value={author}
              onChangeText={setAuthor}
            />
          </View>

          {/* Location Input */}
          <View className="mb-5">
            <View className="flex-row items-center mb-2">
              <MapPin color="#F59E0B" size={20} className="mr-2" />
              <Text className="text-gray-700 font-medium">Location</Text>
            </View>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 bg-gray-50"
              placeholder="Enter your location (e.g., City, Area)"
              value={location}
              onChangeText={setLocation}
            />
          </View>

             {/* Category Selection */}
          <View className="mb-5">
            <View className="flex-row items-center mb-3">
              <Tag color="#F59E0B" size={20} className="mr-2" />
              <Text className="text-gray-700 font-medium">Category</Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {categories.map((item) => (
                <TouchableOpacity
                  key={item}
                  className={`px-3 py-2 rounded-lg border ${
                    category === item
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-white border-gray-300'
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
          {/* Description Input */}
          <View className="mb-5">
            <View className="flex-row items-center mb-2">
              <FileText color="#F59E0B" size={20} className="mr-2" />
              <Text className="text-gray-700 font-medium">Description</Text>
            </View>
            <TextInput
              className="border border-gray-300 rounded-xl p-4 bg-gray-50 h-32"
              placeholder="Describe the book (optional)"
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Condition Selector */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Star color="#F59E0B" size={20} className="mr-2" />
              <Text className="text-gray-700 font-medium">Condition</Text>
            </View>
            <View className="flex-row flex-wrap gap-3">
              {["new", "good", "used"].map((c) => (
              <TouchableOpacity key={c} className="flex-row items-center" onPress={() => setCondition(c as any)}>
                <View
                  className={`w-5 h-5 rounded-full border-2 mr-2 items-center justify-center ${
                    condition === c ? "border-indigo-600 bg-indigo-600" : "border-gray-300"
                  }`}
                >
                  {condition === c && <View className="w-2 h-2 bg-white rounded-full" />}
                </View>
                <Text className="text-gray-700 capitalize">{c}</Text>
              </TouchableOpacity>
            ))}
            </View>
          </View>

          

          {/* Availability Status Selector */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Share2 color="#F59E0B" size={20} className="mr-2" />
              <Text className="text-gray-700 font-medium">Availability for Sharing</Text>
            </View>
            <View className="flex-row flex-wrap gap-3">
              {availabilityOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  className={`px-4 py-2 rounded-full border ${
                    availabilityStatus === item
                      ? 'bg-green-500 border-green-500'
                      : 'bg-white border-gray-300'
                  }`}
                  onPress={() => setAvailabilityStatus(item)}
                >
                  <Text
                    className={`font-medium ${
                      availabilityStatus === item ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* PDF Upload Section */}
          <View className="mb-2">
            <View className="flex-row items-center mb-3">
              <Upload color="#F59E0B" size={20} className="mr-2" />
              <Text className="text-gray-700 font-medium">Book Preview (PDF)</Text>
            </View>
            <TouchableOpacity 
              className="w-full h-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 items-center justify-center"
              onPress={handlePdfUpload}
            >
              {pdfFile ? (
                <View className="items-center">
                  <FileText color="#10B981" size={32} />
                  <Text className="text-green-600 font-medium mt-1">{pdfFile}</Text>
                  <Text className="text-gray-500 text-sm">PDF attached</Text>
                </View>
              ) : (
                <View className="items-center">
                  <Upload color="#9CA3AF" size={32} />
                  <Text className="text-gray-500 mt-1">Tap to upload PDF preview</Text>
                  <Text className="text-gray-400 text-sm">(Optional)</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-amber-500 rounded-xl py-4 items-center justify-center mb-6"
          onPress={handleAddBook}
        >
          <Text className="text-white text-lg font-bold">Add to Collection</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

export default AddBookScreen;