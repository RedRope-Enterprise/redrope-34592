import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import HomeScreen from "../screens/Home"
import TableSelectScreen from "../screens/TableSelect"

const Stack = createStackNavigator()

const HomeNavigator = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="TableSelectScreen" component={TableSelectScreen} />
    </Stack.Navigator>
  )
}

export default HomeNavigator
