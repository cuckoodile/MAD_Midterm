import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link, useRouter } from "expo-router";

import { deleteAll, dropTable } from "../../sqlConfig";

export default function Settings() {
  const router = useRouter();

  return (
    <View style={{ alignItems: "center", gap: 20}}>
      <Text>Settings</Text>

      <Link
        href={"/"}
        style={styles.button}
      >
        <Text>Log out</Text>
      </Link>

      <Pressable
        onPress={() => deleteAll("Currency")}
        style={styles.button}
      >
        <Text>Delete Currency</Text>
      </Pressable>

      <Pressable
        onPress={() => deleteAll("Type")}
        style={styles.button}
      >
        <Text>Delete Type</Text>
      </Pressable>

      <Pressable
        onPress={() => deleteAll("Product")}
        style={styles.button}
      >
        <Text>Delete Product</Text>
      </Pressable>

      <Pressable
        onPress={() => dropTable("Product")}
        style={styles.button}
      >
        <Text>DROP Product</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10
  }});
