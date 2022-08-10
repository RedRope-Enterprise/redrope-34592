import React, { useState, useEffect } from "react"
import {
  View,
  ActivityIndicator
} from "react-native"
import { Colors, Typography } from "../../styles"


const LoaderComponent = () => {
  return (
    <View
      style={{
        position: "absolute",
        flex: 1,
        width: "100%",
        height: "100%",
        backgroundColor: Colors.BLACK_OPACITY_50,
        alignItems: "center",
        justifyContent: "center",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
      }}
    >
      <ActivityIndicator size="large" color={Colors.BUTTON_RED} />
    </View>
  )
}

export default LoaderComponent
