import { useNavigation } from "@react-navigation/native"
import React, { useEffect } from "react"
import { View, StyleSheet, Image, SafeAreaView, StatusBar } from "react-native"

const NEXT_SCREEN_NAME = "Onboarding"

const Splash = ({}) => {
  const navigation = useNavigation()
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate(NEXT_SCREEN_NAME)
    }, 3000)
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar hidden />

      <View style={styles.container}>
        <Image
          resizeMode="cover"
          style={styles.image}
          source={require("../assets/images/splash.png")}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  image: { width: "100%", height: "100%" }
})

export default {
  title: "SplashScreen",
  navigator: Splash,
  options: {
    headerShown: false
  }
}
