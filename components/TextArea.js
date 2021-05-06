import React from "react";
import { TextInput, StyleSheet } from "react-native";

function TextArea({ placeholder, setFunction, style }) {
  return (
    <TextInput
      autoCapitalize="none"
      multiline={true}
      style={[styles.textArea, style]}
      placeholder={placeholder}
      onChangeText={(text) => {
        setFunction(text);
      }}
    ></TextInput>
  );
}

export default TextArea;
const styles = StyleSheet.create({
  textArea: {
    marginTop: 35,
    width: "100%",
    height: 70,
    borderColor: "#EE9696",
    borderStyle: "solid",
    borderWidth: 2,
    fontSize: 20,
    color: "grey",
  },
});
