import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import HomeScreen from "../screens/Home"
import EventDetailsScreen from "../screens/EventDetails"

const Stack = createStackNavigator()

const HomeNavigator = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="EventDetailsScreen" component={EventDetailsScreen} />

    </Stack.Navigator>
  )
}

export default HomeNavigator
