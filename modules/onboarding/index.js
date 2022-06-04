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
import { useNavigation } from "@react-navigation/native"

import {Typography} from "../../styles"

const REDIRECT_SCREEN_NAME = "login"

const Onboarding = ( ) => {
  const navigation = useNavigation()

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
        renderNextButton={() => (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row"
            }}
          >
            <Pressable>
              {
                <Text
                  style={{
                    fontSize: 14,
                    paddingVertical: 10,
                    paddingHorizontal: 40,
                    backgroundColor: "#FF0000",
                    borderRadius: 100,
                    textAlign: "center",
                    alignSelf: "flex-start",
                    color: "white"
                  }}
                >
                  {"NEXT"}
                </Text>
              }
            </Pressable>
          </View>
        )}
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
    color: "rgba(255, 255, 255, 1)",
    textAlign: "center",
    fontSize: Typography.FONT_SIZE_16,
    maxWidth: 270,
    fontFamily : Typography.FONT_FAMILY_POPPINS_REGULAR

  },
  title: {
    fontSize: Typography.FONT_SIZE_50,
    color: "white",
    textAlign: "center",
    fontFamily : Typography.FONT_FAMILY_POPPINS_REGULAR
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
