import React, { useContext, useEffect } from "react"
import { Provider } from "react-redux"
import "react-native-gesture-handler"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import {
  configureStore,
  createReducer,
  combineReducers
} from "@reduxjs/toolkit"

import { screens } from "@screens"
import { modules, reducers, hooks, initialRoute } from "@modules"
import { connectors } from "@store"

const Stack = createStackNavigator()

import { GlobalOptionsContext, OptionsContext, getOptions } from "@options"
import OneSignal from "react-native-onesignal"

const getNavigation = (modules, screens, initialRoute) => {
  const Navigation = () => {
    const routes = modules.concat(screens).map(mod => {
      const pakage = mod.package
      const name = mod.value.title
      const Navigator = mod.value.navigator
      const options = mod.value.options
      const Component = () => {
        return (
          <OptionsContext.Provider value={getOptions(pakage)}>
            <Navigator />
          </OptionsContext.Provider>
        )
      }
      return (
        <Stack.Screen
          key={name}
          name={name}
          component={Component}
          options={options}
        />
      )
    })

    const screenOptions = { headerShown: true }

    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={"login"}
          screenOptions={screenOptions}
        >
          {routes}
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
  return Navigation
}

const getStore = globalState => {
  const appReducer = createReducer(globalState, _ => {
    return globalState
  })

  const reducer = combineReducers({
    app: appReducer,
    ...reducers,
    ...connectors
  })

  return configureStore({
    reducer: reducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware()
  })
}

const App = () => {
  const global = useContext(GlobalOptionsContext)
  const Navigation = getNavigation(modules, screens, initialRoute)
  const store = getStore(global)
  useEffect(() => {
    OneSignal.setAppId("QQQQQQQ")
    OneSignal.setLogLevel(6, 0)
    OneSignal.setRequiresUserPrivacyConsent(false)
    OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
      console.log(notifReceivedEvent)
      let notif = notifReceivedEvent.getNotification()

      const button1 = {
        text: "Cancel",
        onPress: () => {
          notifReceivedEvent.complete()
        },
        style: "cancel"
      }
      const button2 = {
        text: "Complete",
        onPress: () => {
          notifReceivedEvent.complete(notif)
        }
      }
      Alert.alert("Complete notification?", "Test", [button1, button2], {
        cancelable: true
      })
    })
    OneSignal.setNotificationOpenedHandler(notification => {
      console.log(notification)
    })
    OneSignal.setInAppMessageClickHandler(event => {
      console.log(event)
    })
    const deviceState = OneSignal.getDeviceState()

    deviceState.then(res => {
      setIsSubscribed(res)
    })
  }, [])
  let effects = {}
  hooks.map(hook => {
    effects[hook.name] = hook.value()
  })

  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  )
}

export default App
