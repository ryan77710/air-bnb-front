import React, { useState } from "react";
import { useNavigation } from "@react-navigation/core";
import {
  Button,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
  Platform,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "axios";

import Input from "../components/Input";

export default function SignInScreen({ setToken, StoreId }) {
  //
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (email && password) {
      try {
        const data = {
          email: email,
          password: password,
        };
        const response = await axios.post(
          "https://express-airbnb-api.herokuapp.com/user/log_in",
          data
        );
        const userToken = response.data.token;
        const id = response.data.id;
        StoreId(id);
        setToken(userToken);
      } catch (error) {
        alert(error.response.data.error);
      }
    } else {
      alert("Remplissé tous les champs");
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image style={styles.image} source={require("../assets/img/logo.png")} />
      <Input setFunction={setEmail} placeholder="emaill" />
      <Input setFunction={setPassword} placeholder="Password" />
      <TouchableOpacity
        style={[styles.display, styles.signinButton]}
        onPress={handleSubmit}
      >
        <Text style={{ fontSize: 20, color: "grey" }}>Sign in</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.redirectButton}
        onPress={() => navigation.navigate("SignUp")}
      >
        <Text style={{ fontSize: 15 }}>No account ? Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    backgroundColor: "blue",
    alignItems: "center",
    paddingLeft: 30,
    paddingRight: 30,
    flex: 1,
  },

  display: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 270,
    marginBottom: 70,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "grey",
  },
  signinButton: {
    marginTop: 200,
    width: 200,
    height: 60,
    borderColor: "red",
    borderStyle: "solid",
    borderWidth: 3,
    borderRadius: 30,
  },
  redirectButton: {
    marginTop: 20,
    height: 30,
  },
});
