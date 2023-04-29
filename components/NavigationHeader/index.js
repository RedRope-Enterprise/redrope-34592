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
import ShareImg from "../../assets/naviigation/share.png"
import HeartImg from "../../assets/naviigation/heart.png"
import Like from "../../assets/naviigation/like.png"


const { width, height } = Dimensions.get("window")

const NavigationHeader = ({
  noShadowToggle = false,
  allowSkip = false,
  onSkip,
  headerText = "",
  hideBackButton = false,
  showLeftBtn1 = false,
  showLeftBtn2 = false,
  onLeftBtn1,
  onLeftBtn2,
  iconRight1,
  iconRight2
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
            <Image style={styles.icon} source={ArrowLeft} />
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
      <View style={{ right: 0, flexDirection: "row" }}>
        <Pressable onPress={onSkip} style={{ marginRight: width * 0.03 }}>
          <View>
            <Text style={styles.skipText}>{allowSkip ? "SKIP" : ""}</Text>
          </View>
        </Pressable>
        {showLeftBtn1 && (
          <Pressable
            onPress={() => {
              onLeftBtn1()
            }}
          >
            <View style={styles.leftBtn}>
              <Image
                style={styles.icon}
                source={iconRight1 ? iconRight1 : ShareImg}
              />
            </View>
          </Pressable>
        )}
        {showLeftBtn2 && (
          <Pressable
            onPress={() => {
              onLeftBtn2()
            }}
          >
            <View style={styles.leftBtn}>
              <Image
                style={styles.icon}
                source={iconRight2 ? iconRight2 : HeartImg}
              />
            </View>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: Platform.OS === "android" ? 25 : 50,
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
  },
  icon: { width: 24, height: 24 },
  leftBtn: {
    marginRight: 20
  }
})
export default NavigationHeader
