import React, { useContext } from "react"
import { View, Image, Text } from "react-native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Colors, Typography } from "../../styles"

import Foundation from "react-native-vector-icons/Foundation"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import HomeNavigator from "../../navigations/HomeNavigator"
import MyBookingsScreen from "../MyBookings"
import NotificationScreen from "../Notifications"
import SearchScreen from "../Search"
import SettingsScreen from "../Settings"

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
          height: 90,
          borderTopWidth: 0.2
        }
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
        tabBarLabelStyle={{
          color: Colors.WHITE
        }}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.PRIMARY_2 : Colors.WHITE,
                fontSize: Typography.FONT_SIZE_10,
                fontWeight: Typography.FONT_WEIGHT_400,
                fontFamily: Typography.FONT_FAMILY_POPPINS_MEDIUM
              }}
            >
              Home
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                style={{ width: 24, height: 24 }}
                source={
                  focused
                    ? require("../../assets/dashboard/home-on.png")
                    : require("../../assets/dashboard/home-off.png")
                }
              />
            </View>
          )
        }}
      />

      <Tab.Screen
        name="My Events"
        component={MyBookingsScreen}
        tabBarLabelStyle={{
          color: Colors.WHITE
        }}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.PRIMARY_2 : Colors.WHITE,
                fontSize: Typography.FONT_SIZE_10,
                fontWeight: Typography.FONT_WEIGHT_400,
                fontFamily: Typography.FONT_FAMILY_POPPINS_MEDIUM
              }}
            >
              My Events
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                style={{ width: 24, height: 24 }}
                source={
                  focused
                    ? require("../../assets/dashboard/calendar-on.png")
                    : require("../../assets/dashboard/calendar-off.png")
                }
              />
            </View>
          )
        }}
      />

      <Tab.Screen
        name="Search"
        component={SearchScreen}
        tabBarLabelStyle={{
          color: Colors.WHITE
        }}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.PRIMARY_2 : Colors.WHITE,
                fontSize: Typography.FONT_SIZE_10,
                fontWeight: Typography.FONT_WEIGHT_400,
                fontFamily: Typography.FONT_FAMILY_POPPINS_MEDIUM
              }}
            >
              Search
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                style={{ width: 24, height: 24 }}
                source={
                  focused
                    ? require("../../assets/dashboard/search-on.png")
                    : require("../../assets/dashboard/search-off.png")
                }
              />
            </View>
          )
        }}
      />

      <Tab.Screen
        name="Notifications"
        component={NotificationScreen}
        tabBarLabelStyle={{
          color: Colors.WHITE
        }}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.PRIMARY_2 : Colors.WHITE,
                fontSize: Typography.FONT_SIZE_10,
                fontWeight: Typography.FONT_WEIGHT_400,
                fontFamily: Typography.FONT_FAMILY_POPPINS_MEDIUM
              }}
            >
              Notifications
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                style={{ width: 24, height: 24 }}
                source={
                  focused
                    ? require("../../assets/dashboard/notifications-on.png")
                    : require("../../assets/dashboard/notifications-off.png")
                }
              />
            </View>
          )
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        tabBarLabelStyle={{
          color: Colors.WHITE
        }}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                color: focused ? Colors.PRIMARY_2 : Colors.WHITE,
                fontSize: Typography.FONT_SIZE_10,
                fontWeight: Typography.FONT_WEIGHT_400,
                fontFamily: Typography.FONT_FAMILY_POPPINS_MEDIUM
              }}
            >
              Settings
            </Text>
          ),
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                style={{ width: 24, height: 24 }}
                source={
                  focused
                    ? require("../../assets/dashboard/settings-on.png")
                    : require("../../assets/dashboard/settings-off.png")
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
