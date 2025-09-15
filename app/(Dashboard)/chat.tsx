import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, ArrowLeft } from 'lucide-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

interface ChatParams {
  userId: string;
  username: string;
  avatar: string;
}

const chat = () => {
  const { userId, username, avatar } = useLocalSearchParams();
  const router = useRouter();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]); // replace with backend data later
  const scrollViewRef = useRef<ScrollView>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMsg = {
      id: Date.now().toString(),
      text: message,
      sender: 'You',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956', // your user avatar
    };

    setMessages([...messages, newMsg]);
    setMessage('');

    // TODO: send to backend here
  };

  return (
    <SafeAreaView className="flex-1 bg-amber-50">
      {/* Header */}
      <View className="bg-white shadow-sm p-4 flex-row items-center">
        <TouchableOpacity className="mr-3" onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Image source={{ uri: Array.isArray(avatar) ? avatar[0] : avatar }} className="w-10 h-10 rounded-full" />
        <View className="ml-3">
          <Text className="font-bold text-gray-800">{username}</Text>
          <Text className="text-gray-500 text-sm">Online</Text>
        </View>
      </View>

      {/* Messages Container */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map((msg) => (
          <View
            key={msg.id}
            className={`flex-row mb-4 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
          >
            {!msg.isOwn && (
              <Image source={{ uri: msg.avatar }} className="w-8 h-8 rounded-full mr-2" />
            )}
            <View
              className={`max-w-[80%] rounded-2xl p-3 ${
                msg.isOwn
                  ? 'bg-amber-500 rounded-br-none'
                  : 'bg-white border border-gray-200 rounded-bl-none'
              }`}
            >
              {!msg.isOwn && (
                <Text className="font-bold text-gray-800 text-sm mb-1">{msg.sender}</Text>
              )}
              <Text className={`${msg.isOwn ? 'text-white' : 'text-gray-800'}`}>{msg.text}</Text>
              <Text
                className={`text-xs mt-1 ${msg.isOwn ? 'text-amber-100' : 'text-gray-500'}`}
              >
                {msg.timestamp}
              </Text>
            </View>
            {msg.isOwn && (
              <Image source={{ uri: msg.avatar }} className="w-8 h-8 rounded-full ml-2" />
            )}
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View className="bg-white p-3 border-t border-gray-200 flex-row items-center">
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 rounded-full py-3 px-4 mr-2"
          multiline
        />
        <TouchableOpacity onPress={handleSendMessage} className="bg-amber-500 rounded-full p-3">
          <Send size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default chat;
