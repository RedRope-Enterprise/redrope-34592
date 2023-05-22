import React, { useContext } from "react"
import { Provider } from "react-redux"
import "react-native-gesture-handler"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"

import { screens } from "@screens"
import { modules, hooks, initialRoute } from "@modules"
import { connectors } from "@store"
import Toast from 'react-native-toast-message';


import configureStore from "@store/custom/Store"
import { PersistGate } from "redux-persist/integration/react"
import { StripeProvider } from "@stripe/stripe-react-native"

const { persistor, store } = configureStore()

const Stack = createStackNavigator()

import { GlobalOptionsContext, OptionsContext, getOptions } from "@options"
import { STRIPE_PUBLISHABLE } from "@modules/social-login/screens/constants"

const getNavigation = (modules, screens, initialRoute) => {
  const Navigation = () => {
    const routes = modules.concat(screens).map(mod => {
      const pakage = mod.package
      const name = mod.value.title
      const Navigator = mod.value.navigator
      const Component = () => {
        return (
          <OptionsContext.Provider value={getOptions(pakage)}>
            <Navigator />
          </OptionsContext.Provider>
        )
      }
      return <Stack.Screen key={name} name={name} component={Component} />
    })

    const screenOptions = { headerShown: false }

    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={screenOptions}
        >
          {routes}
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
  return Navigation
}

const App = () => {
  const global = useContext(GlobalOptionsContext)
  const Navigation = getNavigation(modules, screens, initialRoute)

  let effects = {}
  hooks.map(hook => {
    effects[hook.name] = hook.value()
  })

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <StripeProvider
          publishableKey={STRIPE_PUBLISHABLE}
          merchantIdentifier="merchant.com.crowdbotics.redrope-34592"
        >
          <Navigation />
        </StripeProvider>
        {/* <MainLoader /> */}
        {/* <MainSnackbarAlert /> */}
      </PersistGate>
      <Toast />
    </Provider>
  )
}

export default App
