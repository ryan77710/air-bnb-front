import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

import axios from "axios";
import * as ImagePicker from "expo-image-picker";

import Input from "../components/Input";
import TextArea from "../components/TextArea";

// import { LineDotsLoader } from "react-native-indicator";
// import { Surface, Shape } from "@react-native-community/art";
import { BallIndicator, DotIndicator } from "react-native-indicators";

export default function ProfileScreen(props) {
  //
  const { userToken, setToken } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({});

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");

  const [image, setImage] = useState();
  const [imgUploading, setImgUploading] = useState(false);
  const [updateUploading, setUpdateUploading] = useState(false);
  const [pickerResult, setPickerResult] = useState(null);

  const getId = async () => {
    try {
      const id = await AsyncStorage.getItem("id");

      if (id !== null) {
        return id;
      }
    } catch (error) {
      console.log(error);
      alert("An error has occured");
    }
  };

  const handleLogOut = async () => {
    try {
      const clear = await AsyncStorage.clear();
      setToken(null);
    } catch (error) {
      console.log(error);
      alert("An error has occurred");
    }
  };

  const handleImagePicked = async (picture) => {
    try {
      const uri = picture.uri;
      const uriParts = uri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const formData = new FormData();

      formData.append("photo", {
        uri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });

      const uploadResponse = await axios.put(
        `https://express-airbnb-api.herokuapp.com/user/upload_picture/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (
        Array.isArray(uploadResponse.data.photo) === true &&
        uploadResponse.data.photo.length > 0
      ) {
        setPickerResult(uploadResponse.data.photo[0].url);
      }
    } catch (error) {
      console.log(error);
      alert("upload picture failed");
      setImgUploading(false);
    } finally {
      setImgUploading(false);
    }
  };

  const handleGalleryPicturePerm = async () => {
    setImgUploading(true);
    const cameraRollPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (cameraRollPerm.status === "granted") {
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!pickerResult.cancelled) {
        handleImagePicked(pickerResult);
      } else {
        alert("picture cancelled");
        setImgUploading(false);
      }
    }
  };
  const handleCameraPerm = async () => {
    setImgUploading(true);
    const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
    const cameraRollPerm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (
      cameraPerm.status === "granted" &&
      cameraRollPerm.status === "granted"
    ) {
      const pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });
      if (!pickerResult.cancelled) {
        handleImagePicked(pickerResult);
      } else {
        alert("picture cancelled");
        setImgUploading(false);
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = await getId();
        const response = await axios.get(
          `https://express-airbnb-api.herokuapp.com/user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setImage(response.data.photo[0].url);
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error.response.data);
        alert(" An error has occurred");
      }
    };
    fetchData();
  }, []);

  const UpdateData = async () => {
    setUpdateUploading(true);
    const updateData = {
      email: email || data.email,
      username: username || data.username,
      description: description || data.description,
    };

    try {
      const response = await axios.put(
        "https://express-airbnb-api.herokuapp.com/user/update",
        updateData,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
    } catch (error) {
      console.log(error.response);
      alert("an error has occurred ");
      setUpdateUploading(false);
    } finally {
      setUpdateUploading(false);
    }
  };
  return (
    <>
      {isLoading ? (
        <Text>chagement</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.container}>
          <View>
            <View style={[styles.flexRow, { marginTop: 20 }]}>
              <View style={styles.imageContainer}>
                {!pickerResult && !image ? (
                  <Image
                    source={require("../assets/img/picture-missing.jpg")}
                    style={styles.image}
                  />
                ) : (
                  <Image
                    style={styles.image}
                    source={{ uri: pickerResult || image }}
                  />
                )}
              </View>
              <View style={styles.viewIcon}>
                {imgUploading ? (
                  <BallIndicator color="black" />
                ) : (
                  <TouchableOpacity onPress={handleCameraPerm}>
                    <Ionicons name="camera" size={24} color="black" />
                  </TouchableOpacity>
                )}
                {imgUploading ? (
                  <BallIndicator color="black" />
                ) : (
                  <TouchableOpacity onPress={handleGalleryPicturePerm}>
                    <FontAwesome5 name="images" size={24} color="black" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Input
              placeholder={data.email || "email"}
              setFunction={setEmail}
              style={{ marginTop: 0 }}
            />
            <Input
              placeholder={data.username || "username"}
              setFunction={setUsername}
            />
            <TextArea
              placeholder={data.description || "description"}
              setFunction={setDescription}
            />
          </View>
          {updateUploading && (
            <View style={styles.updateLoading}>
              <DotIndicator color="red" size={13} />
            </View>
          )}

          <View style={styles.buttonContainer}>
            {updateUploading ? (
              <View style={styles.button}>
                <BallIndicator color="black" />
              </View>
            ) : (
              <TouchableOpacity style={styles.button} onPress={UpdateData}>
                <Text style={styles.textButton}>Update</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "lightgrey" }]}
            >
              <Text style={styles.textButton} onPress={handleLogOut}>
                Log out
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  border: {
    borderColor: "red",
    borderStyle: "solid",
    borderWidth: 1,
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    height: 170,
    width: 170,
    overflow: "hidden",
    marginRight: 20,
    borderRadius: 80,
  },
  image: {
    height: 170,
    width: 170,
    resizeMode: "cover",
  },
  viewIcon: { justifyContent: "space-around", height: 150 },
  inputContainer: {
    paddingLeft: 25,
    paddingRight: 25,
  },
  updateLoading: { alignItems: "center" },
  buttonContainer: {
    marginTop: 30,
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    marginBottom: 30,
    width: 200,
    height: 60,
    borderColor: "red",
    borderStyle: "solid",
    borderWidth: 1.5,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  textButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "grey",
  },
});
