import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useMemo, useState } from "react";

import { deleteAll, fetchCart, handleCurrencySymbol } from "../../sqlConfig";
import { useFocusEffect } from "expo-router";
import PopupModal from "../components/PopupModal";

export default function Cart() {
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [cartData, setCartData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchCart()
        .then((data) => {
          setCartData(data);
        })
        .catch((error) => {
          alert("Error fetching cart data: ", error);
          console.error("Error fetching cart data: ", error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, [refresh])
  );

  const groupedData = useMemo(() => {
    return cartData?.reduce((acc, item) => {
      if (acc[item.product_id]) {
        acc[item.product_id].quantity += item.quantity;
      } else {
        acc[item.product_id] = { ...item };
      }

      return acc;
    }, {});
  }, [cartData]);

  if (isLoading) {
    return <Text>Loading....</Text>;
  }

  const handleCheckOut = () => {
    deleteAll("cart");
    setRefresh(!refresh);
    console.log("Buy success!");
    setIsModalOpen(false);
  };

  return (
    <>
      <ScrollView>
        <View style={styles.cardWrapper}>
          {cartData.length ? (
            Object.values(groupedData).map((item) => (
              <View key={item.id} style={styles.card}>
                <Text>Product ID: {item.product_id}</Text>
                <Text>Name: {item.product_name}</Text>
                <Text>Type: {item.type_name}</Text>
                <Text>Quantity: {item.quantity}</Text>
                <Text>
                  Price:{" "}
                  {handleCurrencySymbol(item.currency_name, item.product_price)}
                </Text>
                <Text>Total: {handleCurrencySymbol(item.currency_name, item.product_price * item.quantity)}</Text>
              </View>
            ))
          ) : (
            <Text>No Data</Text>
          )}
        </View>
      </ScrollView>

      <View style={[styles.floatButton, {display: cartData.length ? "flex" : "none"}]}>
        <Pressable onPress={() => setIsModalOpen(true)}>
          <Text>BUY</Text>
        </Pressable>
      </View>

      {/* Check Out Modal */}
      <PopupModal isOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}>
          CHECK OUT
        </Text>

        <ScrollView>
          <View style={styles.cardWrapper}>
            {Object.values(groupedData).map((item) => (
              <View key={item.id} style={styles.card}>
                <Text>Product ID: {item.product_id}</Text>
                <Text>Name: {item.product_name}</Text>
                <Text>Type: {item.type_name}</Text>
                <Text>Quantity: {item.quantity}</Text>
                <Text>
                  Price:{" "}
                  {handleCurrencySymbol(item.currency_name, item.product_price)}
                </Text>
                <Text>Total: {item.product_price * item.quantity}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.buttonWrapper}>
          <Pressable
            onPress={() => handleCheckOut()}
            style={[styles.button, { backgroundColor: "lightgreen" }]}
          >
            <Text>Buy</Text>
          </Pressable>

          <Pressable
            onPress={() => setIsModalOpen(false)}
            style={[styles.button, { backgroundColor: "lightcoral" }]}
          >
            <Text>Cancel</Text>
          </Pressable>
        </View>
      </PopupModal>
    </>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    gap: 20,
    padding: 10,
  },
  card: {
    borderWidth: 1,
    padding: 5,
  },
  floatButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
  },
  button: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
});
