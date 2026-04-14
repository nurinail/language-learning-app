import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabItem, // 🔥 ƏN VACİB
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
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    height: 65,

    backgroundColor: "#0f172a",
    borderRadius: 18,

    borderTopWidth: 0,

    // 🔥 MƏRKƏZLƏŞDİRİR
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },

  tabItem: {
    flex: 0,              // 🔥 default flex-i söndürür
    marginHorizontal: 30, // 🔥 aranı balanslayır
  },
});