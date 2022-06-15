import React, { useState, useEffect } from "react"
import {
  Image,
  Alert,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  FlatList,
  ImageBackground,
  ScrollView,
  ActivityIndicator
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, Input, CustomModal, HomeEventItem } from "../../components"
import { Colors, Typography, Mixins } from "../../styles"
import NavigationHeader from "../../components/NavigationHeader"
import { useNavigation } from "@react-navigation/native"
import { data } from "../../data"
import { useRoute } from "@react-navigation/native"

import { useSelector, useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
const { width, height } = Dimensions.get("window")
import { WebView } from "react-native-webview"

const CustomWebViewScreen = () => {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(true)
  const route = useRoute()

  const { url } = route?.params

  useEffect(async () => {}, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.WHITE }}>
      <NavigationHeader></NavigationHeader>
      <WebView
        onLoadEnd={() => {
          setLoading(false)
        }}
        source={{
          uri: url
        }}
        style={{ marginTop: 20, backgroundColor: Colors.WHITE }}
      />

      {loading && (
        <View
          style={{
            top: 0,
            bottom: 0,
            position: "absolute",
            alignSelf: "center",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ActivityIndicator
            style={{ alignSelf: "center" }}
            color={"#898"}
            size={"large"}
          />
        </View>
      )}
    </SafeAreaView>
  )
}

export default CustomWebViewScreen

let styles = StyleSheet.create({
  button: {
    width: 100,
    height: 50,
    backgroundColor: "red"
  }
})
