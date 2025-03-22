import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function rootIndex() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.push("/(customer)/customerIndex")} style={[styles.button, {backgroundColor: "blue"}]}>
        <Text>Customer</Text>
      </Pressable>
      <Pressable onPress={() => router.push("/(admin)/adminIndex")} style={[styles.button, {backgroundColor: "yellow"}]}>
        <Text>Admin</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
    flex: 1,
  },
  button: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10
  }
});