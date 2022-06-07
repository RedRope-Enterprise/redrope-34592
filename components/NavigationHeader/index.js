import { useNavigation } from "@react-navigation/native"
import React, { useState } from "react"
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  SafeAreaView,
  Platform
} from "react-native"
import { Colors, Typography, Mixins } from "../../styles"
import ArrowLeft from "./../../assets/images/ArrowLeft.png"

const { width, height } = Dimensions.get("window")

const NavigationHeader = ({
  noShadowToggle = false,
  allowSkip = false,
  onSkip,
  headerText = "",
  hideBackButton = false
}) => {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.header}>
      {!hideBackButton && (
        <Pressable
          onPress={() => {
            navigation.goBack()
          }}
        >
          <View style={{ marginLeft: width * 0.03 }}>
            <Image style={{ width: 24, height: 24 }} source={ArrowLeft} />
          </View>
        </Pressable>
      )}

      <Text
        style={[
          hideBackButton && styles.headerTextWithHideBackButton,
          {
            fontSize: Typography.FONT_SIZE_16,
            fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
            color: Colors.WHITE
          }
        ]}
      >
        {headerText}
      </Text>
      <Pressable onPress={onSkip} style={{ marginRight: width * 0.03 }}>
        <View>
          <Text style={styles.skipText}>{allowSkip ? "SKIP" : ""}</Text>
        </View>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: Platform.os === "android"? 25:  30,
    zIndex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%"
  },
  iconCard: {
    width: 48,
    height: 48
  },
  skipText: {
    fontSize: Typography.FONT_SIZE_14,
    fontWeight: Typography.FONT_WEIGHT_500,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
  },
  headerTextWithHideBackButton: {
    flex: 1,
    alignSelf: "center",
    textAlign: "center"
  }
})
export default NavigationHeader
