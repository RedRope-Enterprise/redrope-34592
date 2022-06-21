import { useNavigation } from "@react-navigation/native"
import React, { useEffect } from "react"
import { View, StyleSheet, Image, SafeAreaView, StatusBar } from "react-native"
import { getDataStorage, clearStorage } from "../../utils/storage"

let NEXT_SCREEN_NAME = "Onboarding"

const Splash = ({}) => {
  const navigation = useNavigation()
  useEffect(async () => {
    

    setTimeout(async() => {
      // await clearStorage()
      let key = await getDataStorage("@key")
      if (key) {
        NEXT_SCREEN_NAME = "Dashboard"
        navigation.replace(NEXT_SCREEN_NAME)
      }else
        navigation.navigate(NEXT_SCREEN_NAME)
    }, 3000)
  }, [])

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />

      <View style={styles.container}>
        <Image
          resizeMode="cover"
          style={styles.image}
          source={require("../../assets/images/splash.png")}
        />
        <Image
          resizeMode="contain"
          style={styles.icon}
          source={require("../../assets/images/Icon.png")}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  image: { width: "100%", height: "100%" },
  icon: {
    position: "absolute",
    width: "75%",
    height: "100%",
    bottom: "25%",

    alignSelf: "center"
  }
})

export default {
  title: "SplashScreen",
  navigator: Splash,
  options: {
    headerShown: false
  }
}
