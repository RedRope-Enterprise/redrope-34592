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
  ScrollView
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, Input, CustomModal } from "../../components"
import { Colors, Typography, Mixins } from "../../styles"
import NavigationHeader from "../../components/NavigationHeader"
import { useNavigation } from "@react-navigation/native"
import {
  getDataStorage,
  setDataStorage,
  clearStorage
} from "../../utils/storage"

import { useSelector, useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
const { width, height } = Dimensions.get("window")

const FiltersScreen = () => {
  const navigation = useNavigation()
  const [user, setUser] = useState(global.user)
  const [selectedEvent, setSelectedEvent] = useState(1)
  const [dateTabSelection, setDateTabSelection] = useState(0)

  const eventTypes = [
    { id: 1, type: "Yacht Parties" },
    { id: 2, type: "Bottle Service" },
    { id: 3, type: "Pool Parties" }
  ]

  const timeDateSection = () => {
    return (
      <View style={{ margin: "5%" }}>
        <Text style={styles.heading}>{"Time & Date"}</Text>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity
            onPress={() => setDateTabSelection(0)}
            style={[
              dateTabSelection === 0
                ? styles.selectedBoxStyle
                : styles.unselectedBoxStyle,
              {
                borderRadius: 10,
                borderWidth: 1,
                alignItems: "center",
                justifyContent: "center",
                width: "30%"
              }
            ]}
          >
            <Text
              style={[
                dateTabSelection === 0
                  ? styles.selectedTextColor
                  : styles.unselectedTextColor,
                {
                  fontSize: Typography.FONT_SIZE_14,
                  fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
                }
              ]}
            >
              {"Today"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setDateTabSelection(1)}
            style={[
              dateTabSelection === 1
                ? styles.selectedBoxStyle
                : styles.unselectedBoxStyle,
              {
                borderRadius: 10,
                borderWidth: 1,
                alignItems: "center",
                justifyContent: "center",
                width: "30%"
              }
            ]}
          >
            <Text
              style={[
                dateTabSelection === 1
                  ? styles.selectedTextColor
                  : styles.unselectedTextColor,
                {
                  marginVertical: "10%",
                  fontSize: Typography.FONT_SIZE_14,
                  fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
                }
              ]}
            >
              {"Tomorrow"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setDateTabSelection(2)}
            style={[
              dateTabSelection === 2
                ? styles.selectedBoxStyle
                : styles.unselectedBoxStyle,
              {
                borderRadius: 10,
                borderWidth: 1,
                alignItems: "center",
                justifyContent: "center",
                width: "30%"
              }
            ]}
          >
            <Text
              style={[
                dateTabSelection === 2
                  ? styles.selectedTextColor
                  : styles.unselectedTextColor,
                {
                  marginHorizontal: "3%",
                  //   marginVertical: "10%",
                  fontSize: Typography.FONT_SIZE_14,
                  fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
                }
              ]}
            >
              {"This week"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setDateTabSelection(0)}
          style={[
            styles.unselectedBoxStyle,
            {
              marginTop: "5%",
              borderRadius: 10,
              borderWidth: 1,
              alignItems: "center",
              flex: 1,
              flexDirection: "row"
            }
          ]}
        >
          <Image
            source={require("../../assets/dashboard/calendar-off.png")}
            style={{ margin: "3%", width: 25, height: 25 }}
          />
          <Text
            style={{
              fontSize: Typography.FONT_SIZE_16,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              marginVertical: "7%",
              color: Colors.GREY,
              flex: 1
            }}
          >
            Choose from calender
          </Text>

          <Text
            style={{
              fontSize: Typography.FONT_SIZE_24,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              marginRight: "5%",
              color: Colors.GREY
            }}
          >
            {">"}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  const locationSection = () => {
    return (
      <View style={{ marginHorizontal: "5%", maginBottom: "5%" }}>
        <Text style={styles.heading}>{"Location"}</Text>

        <TouchableOpacity
          onPress={() => setDateTabSelection(0)}
          style={[
            styles.unselectedBoxStyle,
            {
              borderRadius: 10,
              borderWidth: 1,
              alignItems: "center",
              flex: 1,
              flexDirection: "row"
            }
          ]}
        >
          <Image
            source={require("../../assets/dashboard/location-filled.png")}
            style={{ margin: "3%", width: 25, height: 25 }}
          />
          <Text
            style={{
              fontSize: Typography.FONT_SIZE_16,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              marginVertical: "7%",
              color: Colors.GREY,
              flex: 1
            }}
          >
            Choose location
          </Text>

          <Text
            style={{
              fontSize: Typography.FONT_SIZE_24,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              marginRight: "5%",
              color: Colors.GREY
            }}
          >
            {">"}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.flex1, { backgroundColor: Colors.NETURAL_3 }]}>
      <NavigationHeader></NavigationHeader>
      <ScrollView>
        <View style={{ flexDirection: "row", flex: 1, marginHorizontal: "5%" }}>
          <TouchableOpacity
            onPress={() => setSelectedEvent(1)}
            style={[
              selectedEvent === eventTypes[0].id
                ? styles.selectedBoxStyle
                : styles.unselectedBoxStyle,
              {
                borderRadius: 10,
                marginTop: "10%",
                borderWidth: 1,
                alignItems: "center",
                justifyContent: "center"
              }
            ]}
          >
            <Text
              style={[
                selectedEvent === eventTypes[0].id
                  ? styles.selectedTextColor
                  : styles.unselectedTextColor,
                {
                  marginHorizontal: "10%",
                  marginVertical: "10%",
                  fontSize: Typography.FONT_SIZE_14,
                  fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
                }
              ]}
            >
              {eventTypes[0].type}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelectedEvent(2)}
            style={[
              selectedEvent === eventTypes[1].id
                ? styles.selectedBoxStyle
                : styles.unselectedBoxStyle,
              {
                borderRadius: 10,
                marginLeft: "3%",
                marginTop: "10%",
                flex: 1,
                borderWidth: 1,
                alignItems: "center",
                justifyContent: "center"
              }
            ]}
          >
            <Text
              style={[
                selectedEvent === eventTypes[1].id
                  ? styles.selectedTextColor
                  : styles.unselectedTextColor,
                {
                  marginHorizontal: "10%",
                  marginVertical: "10%",
                  fontSize: Typography.FONT_SIZE_14,
                  fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
                }
              ]}
            >
              {eventTypes[1].type}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setSelectedEvent(3)}
          style={[
            selectedEvent === eventTypes[2].id
              ? styles.selectedBoxStyle
              : styles.unselectedBoxStyle,
            {
              borderRadius: 10,
              marginTop: "3%",
              marginHorizontal: "5%",
              flex: 1,
              borderWidth: 1,
              alignItems: "center",
              justifyContent: "center"
            }
          ]}
        >
          <Text
            style={[
              selectedEvent === eventTypes[2].id
                ? styles.selectedTextColor
                : styles.unselectedTextColor,
              {
                marginHorizontal: "10%",
                marginVertical: "5%",
                fontSize: Typography.FONT_SIZE_14,
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
              }
            ]}
          >
            {eventTypes[0].type}
          </Text>
        </TouchableOpacity>

        {timeDateSection()}
        {locationSection()}

        <View style={{ flexDirection: "row", marginVertical: "5%" }}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: Colors.BUTTON_RED,
              borderRadius: 10,
              flex: 1,
              marginHorizontal: 15
            }}
          >
            <Text
              style={{
                color: Colors.WHITE,
                fontSize: Typography.FONT_SIZE_14,
                fontFamily: Typography.FONT_FAMILY_POPPINS_MEDIUM,
                margin: 15,
                textAlign: "center",
                fontWeight: Typography.FONT_WEIGHT_BOLD
              }}
            >
              RESET
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: Colors.BUTTON_RED,
              backgroundColor: Colors.BUTTON_RED,
              borderRadius: 10,
              flex: 1,
              marginHorizontal: 15
            }}
            onPress={async () => {}}
          >
            <Text
              style={{
                color: Colors.WHITE,
                fontSize: Typography.FONT_SIZE_14,
                fontFamily: Typography.FONT_FAMILY_POPPINS_MEDIUM,
                margin: 15,
                textAlign: "center",
                fontWeight: Typography.FONT_WEIGHT_BOLD
              }}
            >
              APPLY
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default FiltersScreen

let styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  flex1: {
    flex: 1
  },

  selectedBoxStyle: {
    backgroundColor: "#3f3720",
    borderColor: Colors.PRIMARY_1
  },
  unselectedBoxStyle: {
    borderColor: Colors.BORDER
  },
  selectedTextColor: {
    color: Colors.PRIMARY_1,
    fontWeight: Typography.FONT_WEIGHT_BOLD
  },
  unselectedTextColor: {
    color: Colors.WHITE,
    fontWeight: Typography.FONT_WEIGHT_400
  },
  heading: {
    marginVertical: "5%",
    fontWeight: Typography.FONT_WEIGHT_600,
    color: Colors.PRIMARY_1,
    fontSize: Typography.FONT_SIZE_14,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
  }
})
