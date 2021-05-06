import React from "react";
import { TextInput, StyleSheet } from "react-native";

function Input({ placeholder, setFunction, secureTextEntry, style }) {
  return (
    <TextInput
      autoCapitalize="none"
      style={[styles.input, style]}
      secureTextEntry={
        placeholder === "Password" || placeholder === "Confirm password"
          ? true
          : false
      }
      placeholder={placeholder}
      onChangeText={(text) => {
        setFunction(text);
      }}
    />
  );
}
export default Input;
const styles = StyleSheet.create({
  input: {
    marginTop: 35,
    width: "100%",
    height: 45,
    borderBottomColor: "#EE9696",
    borderStyle: "solid",
    borderBottomWidth: 2,
    fontSize: 20,
    color: "grey",
  },
});
