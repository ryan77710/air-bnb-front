import React from "react";

import { Ionicons } from "@expo/vector-icons";

import { Text } from "react-native";
function StarIcon({ value }) {
  const tab = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= value) {
      tab.push(
        <Ionicons name="md-star-sharp" size={24} color="gold" key={i} />
      );
    } else {
      tab.push(
        <Ionicons name="md-star-sharp" size={24} color="grey" key={i} />
      );
    }
  }
  return <Text style={{ flex: 1 }}>{tab}</Text>;
}
export default StarIcon;
