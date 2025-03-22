import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { fetchAll, fetchProduct } from "@/sqlConfig";

import CartCard from "../components/CartCard";
import CartModal from "../components/CartModal";

export default function Index() {
  const [refresh, setRefresh] = useState(false);
  const [currencyData, setCurrencyData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [productData, setProductData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState([])

  useFocusEffect(
    useCallback(() => {
      fetchAll("currency", setCurrencyData);
      fetchAll("type", setTypeData);
      fetchProduct(setProductData);
    }, [refresh])
  );

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  const handleCountData = (typeName) => {
    let productCount = 0;

    productData.map((product) => {
      if (product.type_name == typeName) {
        productCount += 1;
      }
    });

    return productCount == 0 ? false : true;
  };

  const handleOpenModal = (data) => {
    // console.log("Passed data: ", data);

    setModalData(data)
    setModalVisible(true);
  };

  return (
    <>
      <View style={{ padding: 10 }}>
        {/* Card List */}
        <ScrollView style={{ paddingVertical: 10 }}>
          {typeData.map((type) => (
            <View
              key={type.id}
              style={{
                display: handleCountData(type.name) ? "flex" : "none",
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
                {type.name}
              </Text>
              {productData.map((product) => (
                <View key={product.id}>
                  {(product.type_name == type.name && (
                    <CartCard
                      data={product}
                      refresh={handleRefresh}
                      openModal={handleOpenModal}
                    />
                  )) ||
                    null}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
      
      <CartModal isOpen={modalVisible} setIsModalOpen={setModalVisible} data={modalData} />
    </>
  );
}

const styles = StyleSheet.create({});
