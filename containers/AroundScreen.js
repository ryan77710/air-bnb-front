import React, { useEffect, useState } from "react";
import { Text, StyleSheet } from "react-native";

import { useNavigation } from "@react-navigation/core";

import MapView from "react-native-maps";
import * as Location from "expo-location";

import axios from "axios";

function AroundScreen() {
  //
  let navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();
  const [coords, setCoords] = useState();

  useEffect(() => {
    const fetchDataAndAskPermissons = async () => {
      try {
        let { status } = await Location.requestPermissionsAsync();
        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({});
          const response = await axios.get(
            `https://express-airbnb-api.herokuapp.com/rooms/around?longitude=${location.coords.longitude}&latitude=${location.coords.latitude}`
          );
          const obj = {
            longitude: location.coords.longitude,
            latitude: location.coords.latitude,
          };
          setCoords(obj);
          setData(response.data);
        } else {
          const response = await axios.get(
            "https://express-airbnb-api.herokuapp.com/rooms/around"
          );
          setData(response.data);
          const obj = {
            latitude: 48.856614,
            longitude: 2.3522219,
          };
          setCoords(obj);
        }
      } catch (error) {
        console.log(error.message);
      }

      setIsLoading(false);
    };
    fetchDataAndAskPermissons();
  }, []);
  const handleRoomPress = (id) => {
    navigation.navigate("RoomDetail", { id: id });
  };

  return (
    <>
      {isLoading ? (
        <Text>loading ...</Text>
      ) : (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.03,
            longitudeDelta: 0.03,
          }}
          showsUserLocation={true}
        >
          {data.map((room, index) => {
            return (
              <MapView.Marker
                key={room._id}
                coordinate={{
                  latitude: room.location[1],
                  longitude: room.location[0],
                }}
                title={room.title}
                description={room.description}
                onPress={() => handleRoomPress(room._id)}
              />
            );
          })}
        </MapView>
      )}
    </>
  );
}

export default AroundScreen;
