import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

import { deleteOnId, handleCurrencySymbol } from "../../sqlConfig";

export default function Card({ data = [], refresh, openModal }) {
  const handleDelete = (id) => {
    deleteOnId(id);
    refresh();
  };
  return (
    <View style={styles.card}>
      {/* Text Content */}
      <View style={styles.contentWrapper}>
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
        <View
          style={{
            justifyContent: "space-evenly",
            flex: 1,
            paddingLeft: 15,
          }}
        >
          <Text style={styles.titleText}>{data.name}</Text>
          <View style={styles.group}>
            <Text>ID: {data.id}</Text>
            <Text>
              Price: {handleCurrencySymbol(data.currency_name, data.price)}
            </Text>
          </View>
        </View>
      </View>

      {/* Controls Content */}
      <View style={styles.controlWrapper}>
        <Pressable
          onPress={() => openModal(data)}
          android_ripple={{ color: "grey" }}
          style={[styles.button, { backgroundColor: "lime" }]}
        >
          <Text>Edit</Text>
        </Pressable>

        <Pressable
          onPress={() => handleDelete(data.id)}
          android_ripple={{ color: "grey" }}
          style={[styles.button, { backgroundColor: "rgba(255, 0, 0, .6)" }]}
        >
          <Text>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    boxShadow: "-3px 4px 5px 1px rgba(0, 0, 0, .4)",
    flexDirection: "row",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  group: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  muteText: {
    color: "rgba(0, 0, 0, .4)",
  },
  controlWrapper: {
    justifyContent: "center",
    borderLeftWidth: 1,
    borderColor: "rgba(0, 0, 0, .3)",
    paddingLeft: 5,
    marginLeft: 8,
    gap: 5,
  },
  button: {
    alignItems: "center",
    width: "100%",
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
});
