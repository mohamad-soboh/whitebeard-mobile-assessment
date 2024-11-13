import { Tabs } from "expo-router";
import React from "react";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { MaterialIcons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "black",
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              name={focused ? "home" : "home-outline"}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="FavoritesScreen"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color, focused }) => (
            <>
              <MaterialIcons
                name={focused ? "favorite" : "favorite-border"}
                size={28}
                color={color}
              />
            </>
          ),
        }}
      />
    </Tabs>
  );
}
