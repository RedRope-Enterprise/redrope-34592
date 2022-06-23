import React, { useState, useEffect } from "react"
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator
} from "react-native"
import { Colors, Typography } from "../../styles"
import NavigationHeader from "../../components/NavigationHeader"

const FeedbackSupportScreen = () => {
  useEffect(() => {}, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      <NavigationHeader></NavigationHeader>
      <Text style={styles.header}>Feedback & Support</Text>
    </SafeAreaView>
  )
}

export default FeedbackSupportScreen

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
