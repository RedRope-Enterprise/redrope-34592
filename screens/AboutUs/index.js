import React, { useState, useEffect } from "react"
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  ScrollView
} from "react-native"
import { Colors, Typography, Mixins } from "../../styles"
import NavigationHeader from "../../components/NavigationHeader"

const AboutUsScreen = () => {
  useEffect(() => {}, [])

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#131313",
        alignItems: "center"
      }}
    >
      <NavigationHeader></NavigationHeader>
      <Text style={styles.header}>About Us</Text>
      <ScrollView>
        <Text
          style={{
            color: Colors.WHITE,
            fontSize: Typography.FONT_SIZE_14,
            fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
            fontWeight: Typography.FONT_WEIGHT_400,
            marginHorizontal: "5%",
            textAlign: "center",
            lineHeight: Typography.FONT_SIZE_24
          }}
        >{`
RedRope’s mission is about connecting people to make unforgettable memories without being pre-occupied with how much it’s going to cost you. In cities all over the world there are people who wish they could find some like-minded people to do things that would otherwise be inaccessible. I relateto this, which is why I started RedRope. 

Celebrate life! 

Celebrate together!


Justin Dubreus, Founder
justindubreus@redrope.club`}</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default AboutUsScreen

let styles = StyleSheet.create({
  header: {
    marginHorizontal: "5%",
    fontSize: Typography.FONT_SIZE_24,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    color: Colors.WHITE,
    marginVertical: "10%"
  }
})
