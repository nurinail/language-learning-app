import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          { height: 60 + insets.bottom },
        ],
        tabBarItemStyle: [
          styles.tabItem,
          { marginBottom: insets.bottom },
        ],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="home"
              size={26}
              color={focused ? "#8b5cf6" : "#64748b"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="rocket"
              size={26}
              color={focused ? "#8b5cf6" : "#64748b"}
            />
          ),
        }}
      />
<Tabs.Screen
  name="words"
  options={{
    tabBarIcon: ({ focused }) => (
      <Ionicons
        name="book"
        size={26}
        color={focused ? "#8b5cf6" : "#64748b"}
      />
    ),
  }}
/>
      {/* 🔥 YENİ */}
      <Tabs.Screen
        name="stats"
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="stats-chart"
              size={26}
              color={focused ? "#8b5cf6" : "#64748b"}
            />
          ),
        }}
      />
    </Tabs>
    
  );
}

const styles = StyleSheet.create({
  tabBar: {},
  tabItem: {
    flex: 1,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
});