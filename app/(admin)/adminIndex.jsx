import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  Animated,
  ScrollView,
  Image,
} from "react-native";
import React, { useCallback, useState, useEffect, useRef } from "react";

import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import { fetchAll, fetchProduct, insert, update } from "../../sqlConfig";
import Card from "../components/Card";
import PopupModal from "../components/PopupModal";
import Dropdown from "../components/Dropdown";

export default function Index() {
  const router = useRouter();

  const [refresh, setRefresh] = useState(false);
  const [currencyData, setCurrencyData] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Dropdown and Input Value State
  const [selectedName, setSelectedName] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [selectedEditData, setSelectedEditData] = useState(null);

  // Card List Animation Refs
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  // Data Fetching on Load and on Refresh
  useFocusEffect(
    useCallback(() => {
      fetchAll("currency", setCurrencyData);
      fetchAll("type", setTypeData);
      fetchProduct(setProductData);
    }, [refresh])
  );

  // Get User Image Permission
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    })();
  }, []);

  useEffect(() => {
    setRefresh(!refresh);
    setSelectedName(selectedEditData?.name);
  }, [selectedEditData]);

  // Card List Transition Animations
  useFocusEffect(
    useCallback(() => {
      setRefresh(!refresh);

      Animated.timing(scaleAnim, {
        toValue: isAddModalOpen ? 0.95 : 1,
        duration: 100,
        useNativeDriver: true,
      }).start();

      Animated.timing(opacityAnim, {
        toValue: isAddModalOpen ? 0.5 : 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }, [isAddModalOpen])
  );

  const handleSubmit = () => {
    // Null Check
    if (!selectedName || !selectedPrice || !selectedCurrency || !selectedType || !selectedImage) {
      return alert("Please fill up all fields");
    }

    const insertData = [
      handleNameSanitizer(selectedName),
      selectedPrice,
      selectedCurrency,
      selectedType,
      selectedImage
    ];

    insert(insertData);
    setSelectedName(null);
    setRefresh(!refresh);
    setIsAddModalOpen(false);
  };

  const handleNameSanitizer = (input) => {
    if (!input) {
      return alert("Name is required");
    } else {
      return input
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
  };

  const handleOpenEdit = (data) => {
    setSelectedEditData(data);
    console.log("Selected update data: ", data);
    setIsEditModalOpen(true);
  };

  const handleEdit = (id) => {
    const sanitizedName = handleNameSanitizer(selectedName);

    if (
      sanitizedName == null ||
      sanitizedName == "" ||
      selectedCurrency == null ||
      selectedPrice == null ||
      selectedType == null
    ) {
      return;
    }

    update(id, [
      handleNameSanitizer(selectedName),
      selectedCurrency,
      selectedType,
      parseFloat(selectedPrice),
    ]);
    setRefresh(!refresh);
    setIsEditModalOpen(false);
  };

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

  const handlePickImage = async () => {

    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.Images,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result)
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Card List */}
      <ScrollView>
        <Animated.View
          style={[
            styles.cardWrapper,
            {
              transform: [{ scale: scaleAnim }],
              opacity: opacityAnim,
            },
          ]}
        >
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
                    <Card
                      data={product}
                      refresh={handleRefresh}
                      openModal={handleOpenEdit}
                    />
                  )) ||
                    null}
                </View>
              ))}
            </View>
          ))}
        </Animated.View>
      </ScrollView>

      {/* Floating Button Wrapper */}
      <View style={styles.buttonsWrapper}>
        <Pressable onPress={() => setIsAddModalOpen(true)}>
          <AntDesign name="upcircleo" size={50} />
        </Pressable>
      </View>

      {/* Add Product Popup Modal Content */}
      <PopupModal isOpen={isAddModalOpen} setIsModalOpen={setIsAddModalOpen}>
        {/* Modal Header */}
        <View style={styles.modalHeaderWrapper}>
          <Text style={styles.titleText}>Modal Content</Text>
        </View>

        {/* Modal Body */}
        <View style={styles.modalBodyWrapper}>
          {/* Image Picker Wrapper */}

          <View style={{ alignItems: "center" }}>
            <Pressable onPress={() => handlePickImage()}>
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={{ backgroundColor: "grey", height: 200, width: 200 }}
                />
              ) : (
                <View
                  style={{ backgroundColor: "grey", height: 200, width: 200 }}
                />
              )}
            </Pressable>
          </View>

          {/* Name Input Wrapper */}
          <View style={styles.modalFormWrapper}>
            <Text>Name:</Text>
            <TextInput
              value={selectedName}
              onChangeText={setSelectedName}
              placeholder="Input"
              style={styles.input}
            />
          </View>

          {/* Price Input Wrapper */}
          <View style={styles.modalFormWrapper}>
            <Text>Price:</Text>
            <TextInput
              value={selectedPrice}
              onChangeText={setSelectedPrice}
              placeholder="Input"
              style={styles.input}
              keyboardType="numeric"
            />
          </View>

          {/* Currency Input Wrapper */}
          <View style={styles.modalFormWrapper}>
            <Text>Currency:</Text>
            <Dropdown
              refresh={refresh}
              value={setSelectedCurrency}
              data={currencyData}
            />
          </View>

          {/* Type Input Wrapper */}
          <View style={styles.modalFormWrapper}>
            <Text>Item Type:</Text>
            <Dropdown
              refresh={refresh}
              value={setSelectedType}
              data={typeData}
            />
          </View>
        </View>

        {/* Modal Footer */}
        <View style={styles.modalFooterWrapper}>
          {/* Submit Button Wrapper */}
          <Pressable
            onPress={() => handleSubmit()}
            android_ripple={{ color: "grey" }}
            style={[styles.button, { backgroundColor: "lightgreen" }]}
          >
            <Text>Submit</Text>
          </Pressable>

          {/* Cancel Button Wrapper */}
          <Pressable
            onPress={() => setIsAddModalOpen(false)}
            android_ripple={{ color: "grey" }}
            style={[styles.button, { backgroundColor: "lightcoral" }]}
          >
            <Text>Cancel</Text>
          </Pressable>
        </View>
      </PopupModal>

      {/* Edit Product Popup Modal Content */}
      <PopupModal isOpen={isEditModalOpen} setIsModalOpen={setIsEditModalOpen}>
        {/* Modal Header */}
        <View style={styles.modalHeaderWrapper}>
          <Text style={styles.titleText}>EDIIITTTT</Text>
        </View>

        {/* Modal Body */}
        <View style={styles.modalBodyWrapper}>
          {/* Name Input Wrapper */}
          <View style={styles.modalFormWrapper}>
            <Text>Name:</Text>
            <TextInput
              value={selectedName}
              onChangeText={setSelectedName}
              defaultValue={selectedEditData?.name}
              placeholder="Input"
              style={styles.input}
            />
          </View>

          {/* Price Input Wrapper */}
          <View style={styles.modalFormWrapper}>
            <Text>Price: {selectedEditData?.price}</Text>
            <TextInput
              keyboardType="numeric"
              value={selectedPrice}
              onChangeText={setSelectedPrice}
              defaultValue={selectedEditData?.price.toString()}
              placeholder="Input"
              style={styles.input}
            />
          </View>

          {/* Currency Input Wrapper */}
          <View style={styles.modalFormWrapper}>
            <Text>Currency</Text>
            <Dropdown
              refresh={refresh}
              value={setSelectedCurrency}
              data={currencyData}
              defaultValue={selectedEditData?.currency_name}
            />
          </View>

          {/* Type Input Wrapper */}
          <View style={styles.modalFormWrapper}>
            <Text>Item Type</Text>
            <Dropdown
              refresh={refresh}
              value={setSelectedType}
              data={typeData}
              defaultValue={selectedEditData?.type_name}
            />
          </View>
        </View>

        {/* Modal Footer */}
        <View style={styles.modalFooterWrapper}>
          {/* Submit Button Wrapper */}
          <Pressable
            // onPress={() => console.log("Original data: ", selectedEditData, "\t", "New data: ", selectedName, selectedCurrency, selectedType, selectedEditData.id)}
            onPress={() => handleEdit(selectedEditData.id)}
            android_ripple={{ color: "grey" }}
            style={[styles.button, { backgroundColor: "lightgreen" }]}
          >
            <Text>Submit</Text>
          </Pressable>

          {/* Cancel Button Wrapper */}
          <Pressable
            onPress={() => setIsEditModalOpen(false)}
            android_ripple={{ color: "grey" }}
            style={[styles.button, { backgroundColor: "lightcoral" }]}
          >
            <Text>Cancel</Text>
          </Pressable>
        </View>
      </PopupModal>
    </View>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    paddingRight: 15,
    paddingLeft: 15,
    paddingVertical: 20,
    gap: 20,
    // filter: "blur(6px)",
  },
  buttonsWrapper: {
    position: "absolute",
    right: 5,
    bottom: 5,
  },
  modalHeaderWrapper: {
    alignItems: "center",
    marginBottom: 10,
  },
  modalBodyWrapper: {
    gap: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  modalFooterWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  modalFormWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: "10%",
    gap: 20,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    alignItems: "center",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    flex: 1,
    height: 40,
  },
});
