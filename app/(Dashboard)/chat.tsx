import React, { useState, useEffect, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Send, ArrowLeft } from "lucide-react-native";
import { sendMessage, subscribeMessages, markMessagesAsRead } from "@/services/messageService";
import { useLocalSearchParams, useRouter } from "expo-router";
import { auth } from "@/firebase";

const ChatScreen = () => {
  const { receiverId, receiverName } = useLocalSearchParams<{ receiverId: string; receiverName: string }>();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const currentUserId = auth.currentUser?.uid;

  // Subscribe to chat messages
  useEffect(() => {
    if (!currentUserId || !receiverId) return;

    const unsubscribe = subscribeMessages(currentUserId, receiverId, setMessages);

    // Mark messages as read for this conversation
    let didCancel = false;
    let unsubscribeRead: (() => void) | undefined;

    markMessagesAsRead(currentUserId, receiverId).then((fn) => {
      if (!didCancel) {
        unsubscribeRead = fn;
      }
    });

    return () => {
      unsubscribe();
      if (unsubscribeRead) {
        unsubscribeRead();
      }
      didCancel = true;
    };
  }, [currentUserId, receiverId]);

  const handleSend = async () => {
    if (!message.trim() || !currentUserId || !receiverId) return;
    await sendMessage(message, currentUserId, receiverId);
    setMessage("");
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <SafeAreaView className="flex-1 bg-amber-50">
      {/* Header */}
      <View className="bg-white shadow-sm p-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text className="font-bold text-gray-800">{receiverName}</Text>
      </View>

      {/* Messages */}
      <ScrollView ref={scrollViewRef} className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 20 }}>
        {messages.map((msg) => {
          const isOwn = msg.senderId === currentUserId;
          return (
            <View key={msg.id} className={`flex-row mb-4 ${isOwn ? "justify-end" : "justify-start"}`}>
              {!isOwn && <View className="w-8 h-8 rounded-full bg-gray-300 mr-2" />}
              <View className={`max-w-[80%] p-3 rounded-2xl ${isOwn ? "bg-amber-500 rounded-br-none" : "bg-white border border-gray-200 rounded-bl-none"}`}>
                <Text className={`${isOwn ? "text-white" : "text-gray-800"}`}>{msg.text}</Text>
                <Text className={`text-xs mt-1 ${isOwn ? "text-amber-100" : "text-gray-500"}`}>
                  {msg.timestamp?.toDate?.().toLocaleTimeString() || ""}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Input */}
      <View className="bg-white p-3 border-t border-gray-200 flex-row items-center">
        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 rounded-full py-3 px-4 mr-2"
          multiline
        />
        <TouchableOpacity onPress={handleSend} className="bg-amber-500 rounded-full p-3">
          <Send size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

