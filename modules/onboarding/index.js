import React, { useRef, useState, useEffect } from "react"
import {
  View,
  Image,
  Text,
  StyleSheet,
  StatusBar,
  ImageBackground,
  Pressable,
  TouchableOpacity,
  Dimensions
} from "react-native"
import { slides } from "./slides"
import AppIntroSlider from "react-native-app-intro-slider"
import { useNavigation } from "@react-navigation/native"

import { Colors, Typography } from "../../styles"
import { Button } from "../../components"

const REDIRECT_SCREEN_NAME = "login"
const { width, height } = Dimensions.get("window")

const Onboarding = () => {
  const navigation = useNavigation()
  const slideRef = useRef()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    slideRef?.current.goToSlide(currentIndex)
  }, [])

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
        ref={slideRef}
        onSlideChange={a => setCurrentIndex(a)}
        showNextButton
        renderItem={renderItem}
        data={slides}
        bottomButton
        showSkipButton
        onDone={onDone}
        renderSkipButton={() => (
          <TouchableOpacity
            onPress={onDone}
            style={{ alignSelf: "center", marginVertical: "5%" }}
          >
            <Text
              style={{
                color: Colors.WHITE,
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                fontSize: Typography.FONT_SIZE_13,
                fontWeight: Typography.FONT_WEIGHT_500,
                textDecorationLine: "underline"
              }}
            >
              Skip for now
            </Text>
          </TouchableOpacity>
        )}
        renderDoneButton={() => (
          <View style={{ alignSelf: "center" }}>
            <Button
              btnWidth={width * 0.3}
              borderedRadius={20}
              bordered={true}
              backgroundColor={Colors.BUTTON_RED}
              viewStyle={{
                borderColor: Colors.facebook,
                marginBottom: 2
              }}
              height={35}
              textFontWeight={Typography.FONT_WEIGHT_600}
              textStyle={{
                color: Colors.white,
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                fontSize: Typography.FONT_SIZE_14
              }}
              // loading={props.loading}
              onPress={onDone}
            >
              START
            </Button>
          </View>
        )}
        renderNextButton={() => (
          <View style={{ alignSelf: "center" }}>
            <Button
              btnWidth={width * 0.3}
              borderedRadius={20}
              bordered={true}
              backgroundColor={Colors.BUTTON_RED}
              viewStyle={{
                borderColor: Colors.facebook,
                marginBottom: 2
              }}
              height={35}
              textFontWeight={Typography.FONT_WEIGHT_600}
              textStyle={{
                color: Colors.white,
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                fontSize: Typography.FONT_SIZE_14
              }}
              // loading={props.loading}
              onPress={() => {
                slideRef?.current.goToSlide(currentIndex + 1)
                setCurrentIndex(currentIndex + 1)
              }}
            >
              NEXT
            </Button>
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
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
  },
  title: {
    fontSize: Typography.FONT_SIZE_50,
    color: "white",
    textAlign: "center",
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
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
