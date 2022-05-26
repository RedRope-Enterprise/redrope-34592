import React from "react"
import {
  View,
  Image,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Pressable
} from "react-native"
import { slides } from "./slides"
import AppIntroSlider from "react-native-app-intro-slider"

const REDIRECT_SCREEN_NAME = "LoginAndSignup177769"

const Onboarding = ({ navigation }) => {
  const renderItem = ({ item }) => {
    return (
      <ImageBackground style={styles.image} source={item.image}>
        <View style={[styles.slide]}>
          <View style={{ height: 160 }} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <View style={{ height: 60 }} />

            <Text style={styles.text}>{item.text}</Text>
          </View>
        </View>
      </ImageBackground>
    )
  }
  const renderSkipButton = eee => {
    console.log(eee, "eeeee")
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row"
        }}
      >
        <Text
          style={{
            fontSize: 13,
            paddingVertical: 10,
            paddingHorizontal: 40,
            borderRadius: 100,
            textAlign: "center",
            alignSelf: "flex-start",
            color: "white",
            fontFamily: "Poppins-Regular",
            fontWeight: "normal",
            textDecorationLine: "underline"
          }}
        >
          {"skip for now"}
        </Text>
      </View>
    )
  }
  const renderDoneButton = () => {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row"
        }}
      >
        <Text
          style={{
            fontSize: 14,
            paddingVertical: 10,
            paddingHorizontal: 40,
            backgroundColor: "#FF0000",
            borderRadius: 100,
            textAlign: "center",
            alignSelf: "flex-start",
            color: "white",
            fontFamily: "Poppins-Regular",
            fontWeight: "bold"
          }}
        >
          {"Start"}
        </Text>
      </View>
    )
  }
  const renderNextButton = () => {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row"
        }}
      >
        <Text
          style={{
            fontSize: 14,
            paddingVertical: 10,
            paddingHorizontal: 40,
            backgroundColor: "#FF0000",
            borderRadius: 100,
            textAlign: "center",
            alignSelf: "flex-start",
            color: "white",
            fontFamily: "Poppins-Regular",
            fontWeight: "bold"
          }}
        >
          {"NEXT"}
        </Text>
      </View>
    )
  }

  const onDone = () => {
    navigation.navigate(REDIRECT_SCREEN_NAME)
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar hidden />
      <AppIntroSlider
        showNextButton
        showDoneButton
        renderItem={renderItem}
        data={slides}
        bottomButton
        showSkipButton
        onDone={onDone}
        renderNextButton={renderNextButton}
        renderSkipButton={renderSkipButton}
        renderDoneButton={renderDoneButton}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  image: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start"
  },
  text: {
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    fontSize: 16,
    maxWidth: 270,
    fontWeight: "500",
    fontFamily: "Poppins-Regular"
  },
  title: {
    fontSize: 41,
    color: "white",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    fontWeight: "400"
  },
  titleContainer: {
    marginTop: 37
  }
})

export default {
  title: "Onboarding",
  navigator: Onboarding,
  options: {
    headerShown: false
  }
}
