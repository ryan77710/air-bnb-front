import React, { useState, useEffect } from "react";

import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import { useNavigation } from "@react-navigation/core";

import StarIcon from "./StarIcon";

function Room(props) {
  const navigation = useNavigation();
  const { title, price, ratingValue, reviews, userUrl, roomUrl, id } = props;

  return (
    <TouchableOpacity
      style={[styles.marginTop, styles.borderBottom]}
      onPress={() => {
        navigation.navigate("RoomDetail", { id: id });
      }}
    >
      <View>
        <Image style={styles.image} source={{ uri: roomUrl }} />
        <View style={[styles.display, styles.price]}>
          <Text style={{ color: "white" }}>{` ${price} €`}</Text>
        </View>
      </View>
      <View style={styles.starsContainer}>
        <View>
          <Text
            style={{ fontSize: 25, width: 290 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {title}
          </Text>
          <View style={styles.detail}>
            <View style={styles.starsContainer}>
              <StarIcon value={ratingValue} />
            </View>
            <Text style={{ fontSize: 17, color: "grey" }}>
              {`${reviews} reviews`}
            </Text>
          </View>
        </View>
        <Image style={styles.userImage} source={{ uri: userUrl }} />
      </View>
    </TouchableOpacity>
  );
}
export default Room;
const styles = StyleSheet.create({
  display: {
    justifyContent: "center",
    alignItems: "center",
  },
  marginTop: {
    marginTop: 10,
  },
  borderBottom: {
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    borderStyle: "solid",
  },
  border: {
    borderColor: "red",
    borderWidth: 1,
    borderStyle: "solid",
  },
  borderr: {
    borderColor: "blue",
    borderWidth: 1,
    borderStyle: "solid",
  },
  image: {
    width: "100%",
    resizeMode: "cover",
    height: 220,
  },
  price: {
    position: "absolute",
    bottom: 15,
    backgroundColor: "black",
    height: 60,
    width: 100,
  },
  userImage: {
    borderRadius: 50,
    height: 100,
    width: 100,
    marginTop: 10,
    marginBottom: 10,
  },
  détailContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  detail: {
    flexDirection: "row",
    marginTop: 10,
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    width: 130,
    justifyContent: "space-between",
    alignItems: "center",
    marginRight: 15,
  },
  stars: {
    flexDirection: "row",
  },
});
