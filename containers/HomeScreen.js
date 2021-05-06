import React, { useEffect, useState } from "react";

import { useNavigation, useRoute } from "@react-navigation/core";
import { Text, View, StyleSheet, FlatList } from "react-native";

import Room from "../components/Room";
import axios from "axios";

export default function HomeScreen() {
  //
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://express-airbnb-api.herokuapp.com/rooms"
        );

        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchData();
  }, []);
  const navigation = useNavigation();
  return (
    <View style={loading ? styles.loading : styles.flex1}>
      {loading ? (
        <Text>chargement</Text>
      ) : (
        <View>
          <View style={[styles.displayCenter, styles.borderBottom]}></View>
          <View style={{ paddingLeft: 15, paddingRight: 15 }}>
            <FlatList
              data={data}
              keyExtractor={(item) => String(item._id)}
              renderItem={({ item }) => (
                <Room
                  title={item.title}
                  price={item.price}
                  ratingValue={item.ratingValue}
                  userUrl={item.user.account.photo.url}
                  roomUrl={item.photos[0].url}
                  reviews={item.reviews}
                  id={item._id}
                />
              )}
            />
          </View>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  displayCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  flex1: {
    flex: 1,
    backgroundColor: "white",
  },
  border: {
    borderColor: "red",
    borderWidth: 1,
    borderStyle: "solid",
  },
  image: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },

  borderBottom: {
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    borderStyle: "solid",
  },
});
