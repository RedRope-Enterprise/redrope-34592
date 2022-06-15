import React, { useState, useEffect, useCallback } from "react"
import {
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ImageBackground
} from "react-native"
import { Colors, Typography, Mixins } from "../../styles"
import LinearGradient from "react-native-linear-gradient"

const { width, height } = Dimensions.get("window")

const HomeEventItem = props => {
  const { event, onPress } = props

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginBottom: "2%",
        backgroundColor: Colors.NETURAL_3
      }}
    >
      <ImageBackground
        imageStyle={{ borderRadius: 20, backgroundColor: Colors.NETURAL_3 }}
        style={{
          width: "100%",
          height: Mixins.scaleHeight(210),
          borderRadius: 30,
          backgroundColor: Colors.NETURAL_3
        }}
        resizeMode="cover"
        source={event.image}
      >
        <LinearGradient
          colors={[
            "rgba(0, 0, 0, 0.2)",
            "rgba(0, 0, 0, 0.2)",
            "rgba(246, 211, 101, 0.2)"
          ]}
          style={{ width: "100%", height: "100%" }}
        >
          <View style={{ marginHorizontal: "5%", flex: 1 }}>
            <Text
              style={{
                fontSize: Typography.FONT_SIZE_24,
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                fontWeight: Typography.FONT_WEIGHT_BOLD,
                color: Colors.WHITE,
                marginTop: "5%"
              }}
            >
              {event.name}
            </Text>

            <View style={{ flexDirection: "row", marginTop: "2%", flex: 1 }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.WHITE,
                  borderRadius: 10,
                  marginRight: "3%",
                  height: 30
                }}
              >
                <Text style={{ color: Colors.WHITE, margin: 5 }}>
                  {event.type}
                </Text>
              </View>

              <View
                style={{
                  borderColor: Colors.WHITE,
                  borderRadius: 10,
                  backgroundColor: Colors.NETURAL_4,
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: Typography.FONT_SIZE_10,
                    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                    fontWeight: Typography.FONT_WEIGHT_500,
                    color: Colors.WHITE,
                    margin: 5
                  }}
                >
                  {event.date}
                </Text>
              </View>
            </View>

            <View style={{ marginBottom: "5%", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center"}}>
                <Image source={require("../../assets/images/home/location.png")}/>
                <Text
                  style={{
                    fontSize: Typography.FONT_SIZE_12,
                    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                    fontWeight: Typography.FONT_WEIGHT_400,
                    color: Colors.WHITE,
                    marginLeft: 5
                  }}
                >
                  {event.location}
                </Text>
              </View>

              {/* <Text
                style={{
                  fontSize: Typography.FONT_SIZE_18,
                  fontFamily: Typography.FONT_FAMILY_POPPINS_MEDIUM,
                  fontWeight: Typography.FONT_WEIGHT_BOLD,
                  color: Colors.PRIMARY_1
                }}
              >{`$${event.price}`}</Text> */}
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  )
}

export default HomeEventItem
