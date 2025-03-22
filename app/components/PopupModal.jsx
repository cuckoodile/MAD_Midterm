import { Animated, Pressable, StyleSheet, View } from "react-native";
import React, { useEffect, useRef } from "react";

export default function PopupModal({
  children,
  isOpen,
  setIsModalOpen,
}) {
  const translateYAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateYAnim, {
      toValue: isOpen ? 0 : 1000,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  return (
    <View
      style={[
        styles.container,
        { display: isOpen ? "flex" : "none" },
      ]}
    >
      {/* Overlay */}
      <Pressable
        onPress={() => setIsModalOpen(false)}
        style={styles.overlay}
      ></Pressable>

      {/* Content Wrapper */}
      <Animated.View style={[styles.content, { transform: [{ translateY: translateYAnim }] }]}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 10,
    bottom: 0,
    left: 0,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    width: "100%",
    height: "100%",
  },
  content: {
    backgroundColor: "white",
    position: "absolute",
    justifyContent: "space-between",
    width: "100%",
    height: "90%",
    bottom: 0,
    left: 0,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 10,
    gap: 10,
  },
});
