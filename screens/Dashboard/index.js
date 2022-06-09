import React, { useContext } from "react"
import { View, Image } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Colors, Typography } from "../../styles"

import Foundation from "react-native-vector-icons/Foundation"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import HomeNavigator from "../../navigations/HomeNavigator"

const Tab = createBottomTabNavigator()

const Dashboard = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: "#161616",
          alignItems: "center",
          justifyContent: "center",
          height: 100,
          borderTopWidth: 0.2
        }
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={
                  focused
                    ? require("../../assets/dashboard/HomeActive.png")
                    : require("../../assets/dashboard/HomeInactive.png")
                }
              />
            </View>
          )
        }}
      />
    </Tab.Navigator>
  )
}

export default Dashboard
