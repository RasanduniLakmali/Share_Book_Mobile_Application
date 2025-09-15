import React from 'react';
import { Tabs } from 'expo-router/tabs';
import Entypo from '@expo/vector-icons/Entypo';

type EntypoIconName = 
  "home" | 
  "magnifying-glass" | 
  "plus" | 
  "chat" | 
  "user";

const tabs: { label: string; name: string; icon: EntypoIconName }[] = [
  { label: "Home", name: "home", icon: "home" },
  { label: "Share Book", name: "books", icon: "plus" }, // fixed
  { label: "Chat", name: "chat", icon: "chat" },
  { label: "Profile", name: "profile", icon: "user" },
];

const DashboardLayout = () => {
  return (
    <Tabs>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.label,
            tabBarIcon: ({ color, size }) => (
              <Entypo name={tab.icon} size={size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default DashboardLayout;
