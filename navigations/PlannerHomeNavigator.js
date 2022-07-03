import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import EventPlannerHomeScreen from "../screens/EventPlannerHome"
import TableSelectScreen from "../screens/TableSelect"
import EventDetailsScreen from "../screens/EventDetails"
import TableConfirmScreen from "../screens/TableConfirm"
import PaymentScreen from "../screens/PaymentScreen"
import FaqScreen from "../screens/FAQ"
import EventMenuScreen from "../screens/EventMenu"

const Stack = createStackNavigator()

const PlannerHomeNavigator = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="HomeScreen" component={EventPlannerHomeScreen} />
      <Stack.Screen name="TableSelectScreen" component={TableSelectScreen} />
      <Stack.Screen name="EventDetailsScreen" component={EventDetailsScreen} />
      <Stack.Screen name="TableConfrimScreen" component={TableConfirmScreen} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="FaqScreen" component={FaqScreen} />
      <Stack.Screen name="EventMenuScreen" component={EventMenuScreen} />
    </Stack.Navigator>
  )
}

export default PlannerHomeNavigator
