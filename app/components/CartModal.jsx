import { Animated, Pressable, StyleSheet, View, Text, Image } from "react-native";
import React, { useEffect, useRef, useState } from "react";

import { handleCurrencySymbol, toCart } from "@/sqlConfig";

export default function CartModal({
  children,
  isOpen,
  setIsModalOpen,
  data = [],
}) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const [quantityCounter, setQuantityCounter] = useState(1);

  useEffect(() => {
    setQuantityCounter(1);

    Animated.timing(scaleAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const handleToCart = (id) => {
    console.log(`Attemp to cart ID: ${id}`);

    toCart(id, quantityCounter).then(() => setIsModalOpen(false));
  };

  return (
    <View style={[styles.container, { display: isOpen ? "flex" : "none" }]}>
      {/* Overlay */}
      <Pressable
        onPress={() => setIsModalOpen(false)}
        style={styles.overlay}
      ></Pressable>

      {/* Content Wrapper */}
      <Animated.View
        style={[styles.content, { transform: [{ scale: scaleAnim }] }]}
      >
        {/* Title Header */}
        <Text>Modal Content</Text>

        {/* Body Content */}
        <View style={styles.body}>
          {/* IMAGEEEE */}
          <View style={{ borderRadius: 15, overflow: "hidden" }}>
            <Image
              source={{ uri: data.image }}
              style={{
                backgroundColor: "black",
                height: 150,
                width: 150,
              }}
            />
          </View>

          <Text>{data.name}</Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: "100%",
            }}
          >
            <Text>Currency: {data.currency_name}</Text>
            <Text>
              Price: {handleCurrencySymbol(data.currency_name, data.price)}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: "100%",
            }}
          >
            <Text>Category: {data.type_name}</Text>
            <Text>ID: {data.id}</Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              gap: 20,
            }}
          >
            <Pressable
              style={[styles.buttonControll, { backgroundColor: "lightgreen" }]}
              android_ripple={{ color: "grey" }}
              onPress={() => setQuantityCounter(quantityCounter + 1)}
            >
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>+</Text>
            </Pressable>

            <Text>{quantityCounter}</Text>

            <Pressable
              style={[styles.buttonControll, { backgroundColor: "lightcoral" }]}
              android_ripple={{ color: "grey" }}
              onPress={() =>
                setQuantityCounter(
                  quantityCounter > 1 ? quantityCounter - 1 : 0
                )
              }
            >
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>-</Text>
            </Pressable>
          </View>
        </View>

        {/* Control Footer */}
        <View style={styles.buttonWrapper}>
          <Pressable
            style={[styles.button, { backgroundColor: "lightgreen" }]}
            android_ripple={{ color: "grey" }}
            onPress={() => handleToCart(data.id)}
          >
            <Text>Cart</Text>
          </Pressable>

          <Pressable
            style={[styles.button, { backgroundColor: "lightcoral" }]}
            android_ripple={{ color: "grey" }}
            onPress={() => setIsModalOpen(false)}
          >
            <Text>Cancel</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    bottom: 0,
    left: 0,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  content: {
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    height: "60%",
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  body: {
    width: "90%",
    justifyContent: "space-evenly",
    alignItems: "center",
    flex: 1,
  },
  buttonWrapper: {
    flexDirection: "row",
    gap: 30,
  },
  button: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  buttonControll: {
    alignItems: "center",
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    width: 35,
  },
});
