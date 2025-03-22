import { Stack, useRouter } from "expo-router";
import { SQLiteProvider } from "expo-sqlite";

import { createDB } from "../sqlConfig";

export default function RootLayout() {
  return (
    <SQLiteProvider databaseName="products.db" onInit={createDB}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(customer)" />
        <Stack.Screen name="(admin)" />
      </Stack>
    </SQLiteProvider>
  );
}
