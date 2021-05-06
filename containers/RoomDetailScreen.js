import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { useRoute } from "@react-navigation/core";
import MapView from "react-native-maps";
import * as Location from "expo-location";

import { SwiperFlatList } from "react-native-swiper-flatlist";

import axios from "axios";

import StarIcon from "../components/StarIcon";
import { AntDesign } from "@expo/vector-icons";

function RoomDetailScreen() {
  //
  const { params } = useRoute();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [denialLocation, setDenialLocation] = useState(false);
  const [coords, setCoords] = useState();

  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchDataAndAskPermissions = async () => {
      try {
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/rooms/${id}`
        );

        setData(response.data);

        let { status } = await Location.requestPermissionsAsync();
        if (status === "granted") {
          let location = await Location.getCurrentPositionAsync({});
          const obj = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };
          setCoords(obj);
        } else {
          setDenialLocation(true);
        }
      } catch (error) {
        console.log(error.message);
      }
      setLoading(false);
    };
    fetchDataAndAskPermissions();
  }, []);

  const handleShowText = () => {
    let showText = !showMore;
    setShowMore(showText);
  };
  return (
    <View style={styles.container}>
      {loading ? (
        <Text>
          chargement
          {denialLocation && <Text> Accept location for use this app </Text>}
        </Text>
      ) : (
        <ScrollView>
          <View style={styles.logoContainer}></View>

          <View>
            <SwiperFlatList
              autoplay
              autoplayDelay={2}
              autoplayLoop
              index={2}
              showPagination
              data={data.photos}
              renderItem={({ item }) => (
                <View style={styles.child}>
                  <Image style={styles.image} source={{ uri: item.url }} />
                </View>
              )}
            />
            <View style={[styles.display, styles.price]}>
              <Text style={{ color: "white" }}> {`${data.price} €`}</Text>
            </View>
          </View>
          <View style={styles.starsContainer}>
            <View>
              <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {data.title}
              </Text>
              <View style={styles.detail}>
                <View style={styles.starsContainer}>
                  <StarIcon value={data.ratingValue} />
                </View>
                <Text
                  style={{ fontSize: 17, color: "grey" }}
                >{`${data.reviews} reviews`}</Text>
              </View>
            </View>
            <Image
              style={styles.userImage}
              source={{ uri: data.user.account.photo.url }}
            />
          </View>
          <Text
            style={styles.description}
            ellipsizeMode="tail"
            numberOfLines={showMore ? 11 : 3}
          >
            {data.description}
          </Text>
          <TouchableOpacity
            style={[styles.row, styles.showButton]}
            onPress={handleShowText}
          >
            <Text>Show more </Text>
            <AntDesign
              name={showMore ? "caretdown" : "caretup"}
              size={18}
              color="grey"
            />
          </TouchableOpacity>
          <MapView
            style={styles.mapView}
            initialRegion={{
              latitude: data.location[1],
              longitude: data.location[0],
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            }}
            showsUserLocation={true}
          >
            <MapView.Marker
              coordinate={{
                latitude: data.location[1],
                longitude: data.location[0],
              }}
              title={data.title}
              description={data.description}
            />
          </MapView>
        </ScrollView>
      )}
    </View>
  );
}

export default RoomDetailScreen;
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  row: {
    flexDirection: "row",
  },
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
  container: { flex: 1, backgroundColor: "white" },
  child: { width, justifyContent: "center" },
  image: {
    width: "100%",
    resizeMode: "cover",
    height: 280,
  },
  logoContainer: {
    width: "100%",
    alignItems: "center",
  },
  logo: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },
  price: {
    position: "absolute",
    bottom: 15,
    backgroundColor: "black",
    height: 60,
    width: 100,
  },
  title: {
    fontSize: 25,
    width: 290,
    paddingLeft: 15,
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
  description: {
    width: "100%",
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 18,
  },
  showButton: {
    paddingLeft: 15,
    marginTop: 23,
  },
  mapView: {
    height: 400,
    width: "100%",
  },
});
