import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";

import axios from "axios";
import Input from "../components/Input";
import TextArea from "../components/TextArea";

export default function SignUpScreen({ setToken, StoreId }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async () => {
    if (email && username && description && password && confirmPassword) {
      if (password !== confirmPassword) {
        alert("mot de passe différent");
      } else {
        try {
          const data = {
            email: email,
            username: username,
            description: description,
            password: password,
          };
          const response = await axios.post(
            "https://express-airbnb-api.herokuapp.com/user/sign_up",
            data
          );
          const userToken = response.data.token;
          const id = response.data.id;
          StoreId(id);
          setToken(userToken);
        } catch (error) {
          alert(error.response.data.error);
        }
      }
    } else {
      alert("Remplissé tous les champs");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={[{ flex: 1 }, styles.container]}>
        <Image
          style={styles.image}
          source={require("../assets/img/logo.png")}
        />
        <Text style={styles.title}>Sign up</Text>
        <Input placeholder="Email" setFunction={setEmail} />
        <Input placeholder="Username" setFunction={setUsername} />
        <TextArea placeholder="Description" setFunction={setDescription} />
        <Input placeholder="Password" setFunction={setPassword} />
        <Input
          placeholder="Confirm password"
          setFunction={setConfirmPassword}
        />

        <TouchableOpacity
          style={[styles.display, styles.signupButton]}
          onPress={handleSubmit}
        >
          <Text style={{ fontSize: 20, color: "grey" }}>Sign up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.redirectButton}
          onPress={() => navigation.navigate("login")}
        >
          <Text style={{ fontSize: 15 }}>
            Already have an account ? Sign in
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
Platform;
const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    alignItems: "center",
    paddingLeft: 30,
    paddingRight: 30,
  },

  display: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 270,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "grey",
  },
  signupButton: {
    marginTop: 50,
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
