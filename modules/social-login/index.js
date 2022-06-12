import React from "react";
import {
  View,
  ImageBackground,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  NavigationHelpersContext,
  useNavigationBuilder,
  TabRouter,
  TabActions,
  createNavigatorFactory,
} from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { createStackNavigator } from "@react-navigation/stack";
import { BACKGROUND_URL, LOGO_URL } from "./screens/constants.js";
import { slice } from "./auth";
import { styles } from "./screens/styles";
import { SignInTab, SignupTab } from "./screens/loginsignup";
import ResetPasswordScreen from "./screens/reset";

import LoginScreen from "./screens/login"
import SignupScreen from "./screens/signup"

const LoginTabBar = ({ navigation, state, descriptors }) => {
  const currentTab = state.routes[state.index];
  return (
    <View style={styles.tabStyle}>
      {state.routes.map((route) => (
        <View
          key={route.key}
          style={route.key == currentTab.key ? styles.activeTabStyle : null}
        >
          <TouchableOpacity
            onPress={() => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!event.defaultPrevented) {
                navigation.dispatch({
                  ...TabActions.jumpTo(route.name),
                  target: state.key,
                });
              }
            }}
          >
            <Text style={styles.tabStyle}>
              {descriptors[route.key].options.title || route.name}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

function LoginSignupTabs({ initialRouteName, children, screenOptions }) {
  const { state, navigation, descriptors } = useNavigationBuilder(TabRouter, {
    children,
    screenOptions,
    initialRouteName,
  });

  return (
    <NavigationHelpersContext.Provider value={navigation}>
      <KeyboardAwareScrollView contentContainerStyle={{ flex: 1 }}>
        <ScrollView style={[styles.container]}>
          <View style={{ flex: 1 }}>
            <View style={styles.imageContainer}>
              <ImageBackground
                source={{
                  uri: BACKGROUND_URL,
                }}
                style={{
                  flex: 1,
                  justifyContent: "center",
                  resizeMode: "cover",
                  height: "100%",
                  width: "100%",
                }}
              >
                <Image
                  source={{
                    uri: LOGO_URL,
                  }}
                  style={{
                    width: 155,
                    height: 155,
                    alignSelf: "center",
                    resizeMode: "contain",
                  }}
                />
              </ImageBackground>
            </View>
          </View>
          <View style={[styles.cardView]}>
            <LoginTabBar
              navigation={navigation}
              state={state}
              descriptors={descriptors}
            />
            <View style={styles.tabContainerStyle}>
              {descriptors[state.routes[state.index].key].render()}
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </NavigationHelpersContext.Provider>
  );
}

const createLoginNavigator = createNavigatorFactory(LoginSignupTabs);

const LoginStack = createLoginNavigator();
const Stack = createStackNavigator();

const LoginSignup = () => {
  return (
    <Stack.Navigator headerMode="none">
      <LoginStack.Screen name="SignupScreen" component={SignupScreen} />
      <LoginStack.Screen name="LoginScreen" component={LoginScreen} />

      <LoginStack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />
    </Stack.Navigator>
  )
}

export default {
  title: "login",
  navigator: LoginSignup,
  slice: slice,
};
