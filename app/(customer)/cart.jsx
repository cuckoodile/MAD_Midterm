import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useCallback, useMemo, useState } from "react";

import {
  deleteAll,
  fetchAll,
  fetchCart,
  handleCurrencySymbol,
  deleteCartOnId,
} from "../../sqlConfig";
import { useFocusEffect } from "expo-router";
import PopupModal from "../components/PopupModal";
import { useRef } from "react";

export default function Cart() {
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [currencyData, setCurrencyData] = useState([]);

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

      fetchAll("currency", setCurrencyData);
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

  const handleCountData = (currency) => {
    let productCount = 0;

    Object.values(groupedData).map((product) => {
      if (product.currency_name == currency) {
        productCount += 1;
      }
    });

    return productCount == 0 ? false : true;
  };

  const handleCheckOut = () => {
    deleteAll("cart");
    setRefresh(!refresh);
    console.log("Buy success!");
    alert("Purchase Success!");
    setIsModalOpen(false);
  };

  const calculateTotalPrice = (currencyName) => {
    let total = 0;
    Object.values(groupedData).forEach((item) => {
      if (item.currency_name === currencyName) {
        total += item.product_price * item.quantity;
      }
    });
    return total;
  };

  const handleDeleteCartId = async (id) => {
    await deleteCartOnId(id);
    setCartData((prevData) => prevData.filter((item) => item.id !== id));
    setRefresh(!refresh);
  };

  return (
    <>
      {/* Main Content */}
      <ScrollView>
        <View style={styles.cardWrapper}>
          {cartData.length ? (
            currencyData.map((currency) => (
              <View
                key={currency.id}
                style={{
                  display: handleCountData(currency.name) ? "flex" : "none",
                  marginTop: -10,
                }}
              >
                <Text
                  style={[
                    styles.titleText,
                    {
                      marginBottom: 5,
                    },
                  ]}
                >
                  {currency.name}
                </Text>
                {Object.values(groupedData).map((item) => (
                  <View key={item.id}>
                    {(item.currency_name == currency.name && (
                      <View style={styles.card}>
                        {/* Image */}
                        <View
                          style={{
                            borderRadius: "50%",
                            overflow: "hidden",
                            backgroundColor: "red",
                            height: 80,
                            width: 80,
                          }}
                        >
                          <Image
                            source={{ uri: item.product_image }}
                            style={{
                              backgroundColor: "black",
                              height: 80,
                              width: 80,
                            }}
                          />
                        </View>

                        {/* Text Info */}
                        <View
                          style={{
                            flex: 1,
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <Text>Name: {item.product_name}</Text>
                          <View style={styles.group}>
                            <Text>Product ID: {item.product_id}</Text>
                            <Text>Type: {item.type_name}</Text>
                          </View>
                          <View style={styles.group}>
                            <Text>Quantity: {item.quantity}</Text>
                            <Text>
                              Price:{" "}
                              {handleCurrencySymbol(
                                item.currency_name,
                                item.product_price
                              )}
                            </Text>
                          </View>
                          <Text>
                            Total:{" "}
                            {handleCurrencySymbol(
                              item.currency_name,
                              item.product_price * item.quantity
                            )}
                          </Text>
                          <Pressable
                            onPress={() => handleDeleteCartId(item.id)}
                          >
                            <Text>Cancel</Text>
                          </Pressable>
                        </View>
                      </View>
                    )) ||
                      null}
                  </View>
                ))}
              </View>
            ))
          ) : (
            <Text>No Data</Text>
          )}
        </View>
      </ScrollView>

      {/* Floating Button */}
      <View
        style={[
          styles.floatButton,
          { display: cartData.length ? "flex" : "none" },
        ]}
      >
        <Pressable onPress={() => setIsModalOpen(true)}>
          <Text>BUY</Text>
        </Pressable>
      </View>

      {/* Check Out Modal */}
      <PopupModal isOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 20 }}>
          CHECK OUT
        </Text>

        {/* Modal Body */}
        <ScrollView>
          <View style={styles.cardWrapper}>
            {cartData.length ? (
              currencyData.map((currency) => (
                <View
                  key={currency.id}
                  style={{
                    display: handleCountData(currency.name) ? "flex" : "none",
                    marginTop: -10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={[
                        styles.titleText,
                        {
                          marginBottom: 5,
                        },
                      ]}
                    >
                      {currency.name}
                    </Text>

                    <Text
                      style={[
                        styles.titleText,
                        {
                          marginBottom: 5,
                        },
                      ]}
                    >
                      {/* Displays the total price of all the product the currency has */}
                      {handleCurrencySymbol(
                        currency.name,
                        calculateTotalPrice(currency.name)
                      )}
                    </Text>
                  </View>
                  {Object.values(groupedData).map((item) => (
                    <View key={item.id}>
                      {(item.currency_name == currency.name && (
                        <View style={styles.card}>
                          {/* Image */}
                          <View
                            style={{
                              borderRadius: "50%",
                              overflow: "hidden",
                              height: 80,
                              width: 80,
                            }}
                          >
                            <Image
                              source={{ uri: item.product_image }}
                              style={{
                                backgroundColor: "black",
                                height: 80,
                                width: 80,
                              }}
                            />
                          </View>

                          {/* Text Info */}
                          <View
                            style={{
                              flex: 1,
                              alignItems: "center",
                              gap: 5,
                            }}
                          >
                            <Text>Name: {item.product_name}</Text>
                            <View style={styles.group}>
                              <Text>Product ID: {item.product_id}</Text>
                              <Text>Type: {item.type_name}</Text>
                            </View>
                            <View style={styles.group}>
                              <Text>Quantity: {item.quantity}</Text>
                              <Text>
                                Price:{" "}
                                {handleCurrencySymbol(
                                  item.currency_name,
                                  item.product_price
                                )}
                              </Text>
                            </View>
                            <Text>
                              Total:{" "}
                              {handleCurrencySymbol(
                                item.currency_name,
                                item.product_price * item.quantity
                              )}
                            </Text>
                          </View>
                        </View>
                      )) ||
                        null}
                    </View>
                  ))}
                </View>
              ))
            ) : (
              <Text>No Data</Text>
            )}
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
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
    borderRadius: 10,
  },
  group: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
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
