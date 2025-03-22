import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

export default function _layout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false }}>
      <Tabs.Screen name="customerIndex" options={{title: "Home", tabBarIcon: ({color}) => (<FontAwesome name="home" size={28} color={color} />)}} />
      <Tabs.Screen name="cart" options={{tabBarIcon: ({color}) => (<AntDesign name="shoppingcart" size={28} color={color} />)}} />
      <Tabs.Screen name="settings" options={{tabBarIcon: ({color}) => (<FontAwesome name="cog" size={28} color={color} />)}} />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
