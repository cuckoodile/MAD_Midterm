import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

import { handleCurrencySymbol } from "@/sqlConfig";

export default function CartCard({ data, openModal }) {
  return (
    <Pressable
      style={styles.main}
      android_ripple={{ color: "black" }}
      onPress={() => openModal(data)}
    >
      {/* <View style={styles.img} /> */}

      {/* IMAGEEEE */}
      <View style={{ borderRadius: "50%", overflow: "hidden" }}>
        <Image
          source={{ uri: data.image }}
          style={{
            backgroundColor: "black",
            height: 80,
            width: 80,
          }}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text>{data.name}</Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 50,
          }}
        >
          <Text>ID: {data.id}</Text>
          <Text>
            Price: {handleCurrencySymbol(data.currency_name, data.price)}
          </Text>
        </View>

        <Text>View</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  main: {
    flexDirection: "row",
    marginBottom: 20,
    padding: 5,
    borderWidth: 1,
    borderRadius: 10,
  },
  infoContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
    padding: 10,
  },
  img: {
    backgroundColor: "gray",
    width: 100,
    height: 100,
  },
});
