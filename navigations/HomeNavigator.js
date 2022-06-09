import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import HomeScreen from "../screens/Home"

const Stack = createStackNavigator()

const HomeNavigator = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  )
}

export default HomeNavigator
