import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";

const Dropdown = ({
  data = [],
  placeHolder = "Select",
  value = String,
  defaultValue = null,
  refresh,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValue ?? placeHolder);

  function handleSelect(itemName) {
    setSelected(itemName);
    setIsOpen(false);
  }

  useEffect(() => {
    setSelected(defaultValue);
  }, [refresh]);

  useEffect(() => {
    value(selected);
    selected ? console.log("selected: ", selected) : null;
  }, [selected]);

  return (
    <View style={styles.wrapper}>
      {/* Dropdown Trigger */}
      <Pressable
        style={styles.triggerContainer}
        onPress={() => setIsOpen(!isOpen)}
        android_ripple={{ color: "grey" }}
      >
        <Text style={{ color: selected ? "black" : "rgba(0, 0, 0, .4)" }}>
          {selected ?? "Select"}
        </Text>
        <AntDesign style={styles.icon} name={isOpen ? "up" : "down"} />
      </Pressable>

      {/* Dropdown Selection */}
      <ScrollView
        style={[styles.optionsContainer, { borderWidth: isOpen ? 1 : 0 }]}
      >
        {data?.map((item, index) => (
          <Pressable
            key={index}
            android_ripple={{ color: "grey" }}
            onPress={() => handleSelect(item.name)}
          >
            <Text
              style={[
                styles.options,
                { height: isOpen ? 30 : 0, padding: isOpen ? 5 : 0 },
              ]}
            >
              {item.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  wrapper: {
    minWidth: 100,
  },
  triggerContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    padding: 5,
  },
  optionsContainer: {
    backgroundColor: "white",
    position: "absolute",
    top: "100%",
    width: "100%",
    maxHeight: 100,
    left: 0,
    zIndex: 10,
  },
  icon: {
    borderLeftColor: "grey",
    borderLeftWidth: 1,
    paddingLeft: 3,
    marginLeft: 3,
  },
});
