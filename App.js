import React, { useState, useEffect } from "react";
import { Image } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

import HomeScreen from "./containers/HomeScreen";
import ProfileScreen from "./containers/ProfileScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import RoomDetailScreen from "./containers/RoomDetailScreen";
import AroundScreen from "./containers/AroundScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function App() {
  //
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const setToken = async (token) => {
    if (token) {
      AsyncStorage.setItem("userToken", token);
    } else {
      AsyncStorage.removeItem("userToken");
    }

    setUserToken(token);
  };
  const StoreId = async (id) => {
    try {
      await AsyncStorage.setItem("id", id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      // We should also handle error for production apps
      const userToken = await AsyncStorage.getItem("userToken");

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setIsLoading(false);
      setUserToken(userToken);
    };

    bootstrapAsync();
  }, []);

  return (
    <NavigationContainer>
      {isLoading ? null : userToken === null ? ( // We haven't finished checking for the token yet
        // No token found, user isn't signed in
        <Stack.Navigator>
          <Stack.Screen name="SignIn" options={{ animationEnabled: false }}>
            {() => <SignInScreen setToken={setToken} StoreId={StoreId} />}
          </Stack.Screen>
          <Stack.Screen name="SignUp">
            {() => <SignUpScreen setToken={setToken} StoreId={StoreId} />}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        // User is signed in
        <Stack.Navigator>
          <Stack.Screen
            name="Tab"
            options={{ headerShown: false, animationEnabled: false }}
          >
            {() => (
              <Tab.Navigator
                tabBarOptions={{
                  activeTintColor: "tomato",
                  inactiveTintColor: "gray",
                }}
              >
                <Tab.Screen
                  name="Home"
                  options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"ios-home"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Home"
                        options={{
                          headerStyle: { flexDirection: "column" },
                          title: (
                            <Image
                              source={require("./assets/img/logo-red.jpg")}
                              style={{
                                height: "100%",
                                width: 90,
                              }}
                              resizeMode="contain"
                            />
                          ),
                          headerStyle: { backgroundColor: "#FE595E" },
                          headerTitleStyle: { color: "white" },
                        }}
                      >
                        {() => <HomeScreen />}
                      </Stack.Screen>

                      <Stack.Screen
                        name="RoomDetail"
                        options={{
                          title: (
                            <Image
                              source={require("./assets/img/logo-blanc.png")}
                              style={{ height: "100%", resizeMode: "contain" }}
                            />
                          ),
                        }}
                      >
                        {() => <RoomDetailScreen />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="Around"
                  options={{
                    tabBarLabel: "Around",
                    tabBarIcon: ({ color, size }) => (
                      <MaterialCommunityIcons
                        name="map-marker-multiple-outline"
                        size={size}
                        color={color}
                      />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Around"
                        options={{
                          title: (
                            <Image
                              source={require("./assets/img/logo-blanc.png")}
                              style={{ height: "100%", resizeMode: "contain" }}
                            />
                          ),
                          tabBarLabel: "Around",
                        }}
                      >
                        {() => <AroundScreen setToken={setToken} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>

                <Tab.Screen
                  name="Profile"
                  options={{
                    tabBarLabel: "My profile",
                    tabBarIcon: ({ color, size }) => (
                      <FontAwesome5 name="user-tie" size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator>
                      <Stack.Screen
                        name="Profile"
                        options={{
                          title: (
                            <Image
                              source={require("./assets/img/logo-blanc.png")}
                              style={{ height: "100%", resizeMode: "contain" }}
                            />
                          ),
                          tabBarLabel: "My profile",
                        }}
                      >
                        {(props) => (
                          <ProfileScreen
                            {...props}
                            setToken={setToken}
                            userToken={userToken}
                          />
                        )}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
