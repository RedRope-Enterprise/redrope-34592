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
  FlatList,
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
import { SwipeListView } from "react-native-swipe-list-view"
import { useRoute } from "@react-navigation/native"

const EventDetailsScreen = () => {
  const route = useRoute()

  const navigation = useNavigation()
  const { event } = route?.params

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      <NavigationHeader
        showLeftBtn1={true}
        showLeftBtn2={true}
      ></NavigationHeader>

      <Image
        style={{ width: "100%", height: height * 0.3 }}
        source={event?.image}
      />
      <View style={{ marginHorizontal: "5%" }}>
        <View style={{ flexDirection: "row", marginTop: "5%" }}>
          <Text
            style={{
              fontSize: Typography.FONT_SIZE_24,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontWeight: Typography.FONT_WEIGHT_BOLD,
              color: Colors.WHITE,
              flex: 1
            }}
          >
            {event.name}
          </Text>
          <Text
            style={{
              fontSize: Typography.FONT_SIZE_24,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontWeight: Typography.FONT_WEIGHT_BOLD,
              color: Colors.PRIMARY_1
            }}
          >{`$${event.price}`}</Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: "8%" }}>
          <Image source={event.organizerImage} />
          <View style={{ marginLeft: "4%", justifyContent: "center" }}>
            <Text
              style={{
                fontSize: Typography.FONT_SIZE_13,
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                fontWeight: Typography.FONT_WEIGHT_500,
                color: Colors.WHITE
              }}
            >
              {event.organizerName}
            </Text>
            <Text
              style={{
                fontSize: Typography.FONT_SIZE_13,
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                fontWeight: Typography.FONT_WEIGHT_BOLD,
                color: Colors.GREY
              }}
            >
              {"Organizer"}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          alignSelf: "center",
          flex: 1,
          marginVertical: "5%",
          width: "90%",
          borderBottomColor: Colors.GREY,
          borderBottomWidth: 2,
          opacity: 0.2
        }}
      />

      <View style={{ flexDirection: "row", marginHorizontal: "5%" }}>
        <Image source={require("../../assets/eventDetails/Group.png")} />
        <Text
          style={{
            marginLeft: "5%",
            alignSelf: "center",
            fontSize: Typography.FONT_SIZE_16,
            fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
            fontWeight: Typography.FONT_WEIGHT_500,
            color: Colors.PRIMARY_1
          }}
        >
          {"100+ going"}
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginHorizontal: "5%",
          marginTop: "5%"
        }}
      >
        <Image
          style={{ width: 50, height: 50 }}
          resizeMode="contain"
          source={require("../../assets/eventDetails/Calendar.png")}
        />
        <View style={{ marginLeft: "5%" }}>
          <Text
            style={{
              fontSize: Typography.FONT_SIZE_16,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontWeight: Typography.FONT_WEIGHT_500,
              color: Colors.WHITE
            }}
          >
            {event.fullDate}
          </Text>
          <Text
            style={{
              fontSize: Typography.FONT_SIZE_13,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontWeight: Typography.FONT_WEIGHT_500,
              color: Colors.GREY
            }}
          >
            {event.fullTime}
          </Text>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          marginHorizontal: "5%",
          marginTop: "5%"
        }}
      >
        <Image
          style={{ width: 50, height: 50 }}
          resizeMode="contain"
          source={require("../../assets/eventDetails/Location.png")}
        />
        <View style={{ marginLeft: "5%" }}>
          <Text
            style={{
              fontSize: Typography.FONT_SIZE_16,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontWeight: Typography.FONT_WEIGHT_500,
              color: Colors.WHITE
            }}
          >
            {event.location}
          </Text>
          <Text
            style={{
              fontSize: Typography.FONT_SIZE_13,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontWeight: Typography.FONT_WEIGHT_500,
              color: Colors.GREY
            }}
          >
            {event.location}
          </Text>
        </View>
      </View>

      <View
        style={{
          alignSelf: "center",
          flex: 1,
          marginVertical: "5%",
          width: "90%",
          borderBottomColor: Colors.GREY,
          borderBottomWidth: 2,
          opacity: 0.2
        }}
      />

      <View style={{ marginHorizontal: "5%" }}>
        <Text
          style={{
            fontSize: Typography.FONT_SIZE_14,
            fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
            fontWeight: Typography.FONT_WEIGHT_600,
            color: Colors.PRIMARY_1
          }}
        >
          About Event
        </Text>

        <Text
          style={{
            marginVertical: "5%",
            fontSize: Typography.FONT_SIZE_16,
            fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
            fontWeight: Typography.FONT_WEIGHT_400,
            color: Colors.WHITE
          }}
        >
          {event.about}
        </Text>

        <View
          style={{
            width: width * 0.3,
            alignItems: "center",
            // marginHorizontal: 10,
            backgroundColor: "#3f3720",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: Colors.PRIMARY_1
          }}
        >
          <Text
            style={{
              margin: 10,
              fontSize: Typography.FONT_SIZE_14,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              color: Colors.PRIMARY_1
            }}
          >
            {event.type}
          </Text>
        </View>
      </View>

      <View
        style={{
          alignSelf: "center",
          flex: 1,
          marginVertical: "5%",
          width: "90%",
          borderBottomColor: Colors.GREY,
          borderBottomWidth: 2,
          opacity: 0.2
        }}
      />

      <View style={{ marginBottom: "15%", marginHorizontal: "5%" }}>
        <Text
          style={{
            fontSize: Typography.FONT_SIZE_14,
            fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
            fontWeight: Typography.FONT_WEIGHT_600,
            color: Colors.PRIMARY_1
          }}
        >
          Entry Options
        </Text>

        <TouchableOpacity
          style={{
            flexDirection: "row",
            backgroundColor: Colors.BUTTON_RED,
            alignItems: "center",
            marginTop: "5%",
            borderRadius: 10
          }}
        >
          <Text
            style={{
              fontSize: Typography.FONT_SIZE_16,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontWeight: Typography.FONT_WEIGHT_BOLD,
              color: Colors.WHITE,
              marginHorizontal: "5%",
              marginVertical: "5%",
              flex: 1
            }}
          >
            Interested
          </Text>
          <Text
            style={{
              fontSize: Typography.FONT_SIZE_24,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontWeight: Typography.FONT_WEIGHT_600,
              color: Colors.WHITE,
              marginHorizontal: "5%"
            }}
          >
            {">"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("TableSelect", { event })}
          style={{
            flexDirection: "row",
            backgroundColor: Colors.BUTTON_RED,
            alignItems: "center",
            marginTop: "5%",
            borderRadius: 10
          }}
        >
          <Text
            style={{
              fontSize: Typography.FONT_SIZE_16,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontWeight: Typography.FONT_WEIGHT_BOLD,
              color: Colors.WHITE,
              marginHorizontal: "5%",
              marginVertical: "5%",
              flex: 1
            }}
          >
            Reserve
          </Text>
          <Text
            style={{
              fontSize: Typography.FONT_SIZE_24,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontWeight: Typography.FONT_WEIGHT_600,
              color: Colors.WHITE,
              marginHorizontal: "5%"
            }}
          >
            {">"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default EventDetailsScreen
