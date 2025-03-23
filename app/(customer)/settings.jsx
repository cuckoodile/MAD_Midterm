import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Link, useRouter } from "expo-router";

import { deleteAll } from "../../sqlConfig";

export default function Settings() {
  const router = useRouter();

  return (
    <View style={{ alignItems: "center", gap: 20}}>
      <Text>Settings</Text>

      <Link href={"/"} style={styles.button}>
        <Text>Log out</Text>
      </Link>

      <Pressable style={styles.button} onPress={() => deleteAll("cart")}>
        <Text>Delete Cart</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
});
