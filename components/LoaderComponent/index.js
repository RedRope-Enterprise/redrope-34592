import React, { useState, useEffect } from "react"
import { View, ActivityIndicator } from "react-native"
import { Colors, Typography } from "../../styles"

const LoaderComponent = () => {
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors.BLACK_OPACITY_50
      }}
    >
      <ActivityIndicator size="large" color={Colors.BUTTON_RED} />
    </View>
  )
}

export default LoaderComponent
