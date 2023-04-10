import React, { useState, useEffect } from "react"
import {
  Alert,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  SafeAreaView,
  StatusBar,
  FlatList,
  ScrollView,
  ActivityIndicator
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, Input, CustomModal, LoaderComponent } from "../../components"
import { Colors, Typography, Mixins } from "../../styles"
import NavigationHeader from "../../components/NavigationHeader"
import { Image } from "react-native-elements"
import FastImage from "react-native-fast-image"

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
import {
  getEventDetails,
  markEventAsInterested,
  addEventToFavorite,
  removeEventFromFavorite
} from "../../services/events"

import HeartImg from "../../assets/naviigation/heart.png"
import Like from "../../assets/naviigation/like.png"

const EventDetailsScreen = () => {
  const route = useRoute()
  const [event, setEvent] = useState()
  const [loadingDetails, setLoadingDetails] = useState(true)
  const [showFavModal, setShowFavModal] = useState(false)
  const [currentUser, setCurrentUser] = useState()
  const [favEventData, setFavEventData] = useState(null)

  const [isFavEvent, setIsFavEvent] = useState(false)

  const navigation = useNavigation()

  useEffect(() => {
    getEventData()
  }, [])

  const getUser = async () => {
    const user = await getDataStorage("@user")
    if (user) {
      setCurrentUser(user)
      return user
    }
  }

  const getEventData = async () => {
    setLoadingDetails(true)
    const resp = await getEventDetails(route?.params?.event?.id)
    setEvent(resp)
    const u = await getUser()
    if (resp.favorite && resp.favorite.length > 0) {
      resp.favorite.forEach(item => {
        if (item.user == user.pk) {
          setIsFavEvent(true)
          setFavEventData(item)
        }
      })
    }

    setLoadingDetails(false)
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      <NavigationHeader
        showLeftBtn1={!global?.user?.event_planner}
        showLeftBtn2={!global?.user?.event_planner}
        iconRight2={isFavEvent ? Like : HeartImg}
        onLeftBtn2={async () => {
          if (isFavEvent) {
            const resp = await removeEventFromFavorite(favEventData?.id)
            setFavEventData(null)
            setIsFavEvent(false)
            console.log("Already in fav list ")
            return
          }
          const resp = await addEventToFavorite({
            event: event.id
          })
          if (resp) {
            setFavEventData(resp)
            setIsFavEvent(true)
          }
          console.log("adding to favt resp ", resp)
        }}
      ></NavigationHeader>

      <FastImage
        containerStyle={{ backgroundColor: Colors.BLACK }}
        style={{
          width: "100%",
          height: height * 0.3,
          backgroundColor: Colors.BLACK
        }}
        source={{
          uri: event?.event_images ? event?.event_images[0].image : ""
        }}
        PlaceholderContent={<ActivityIndicator color={Colors.BUTTON_RED} />}
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
            {event?.title}
          </Text>
          {/* <Text
            style={{
              fontSize: Typography.FONT_SIZE_24,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontWeight: Typography.FONT_WEIGHT_BOLD,
              color: Colors.PRIMARY_1
            }}
          >{`$${event?.price ?? ""}`}</Text> */}
        </View>

        {!global?.user?.event_planner && (
          <View style={{ flexDirection: "row", marginTop: "8%" }}>
            <Image
              style={{ width: 50, height: 50, borderRadius: 1000 }}
              source={{ uri: event?.organizer?.profile_picture }}
            />
            <View style={{ marginLeft: "4%", justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: Typography.FONT_SIZE_13,
                  fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                  fontWeight: Typography.FONT_WEIGHT_500,
                  color: Colors.WHITE
                }}
              >
                {event?.organizer?.username != "null"
                  ? event?.organizer?.username
                  : ""}
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
        )}
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

      {!global?.user?.event_planner && (
        <View style={{ flexDirection: "row", marginHorizontal: "5%" }}>
          {event?.going.map((goingPerson, index) => {
            return (
              <View
                style={{
                  borderRadius: 1000,
                  borderWidth: 1,
                  overflow: "hidden",
                  borderColor: Colors.WHITE,
                  left: index === 0 ? 0 : -10 * index,
                  zIndex: index === 0 ? 10000 : 1 * -index
                }}
              >
                <FastImage
                  style={{ width: 32, height: 32 }}
                  source={{ uri: goingPerson?.profile_picture }}
                />
              </View>
            )
          })}
          {/* <Image style={{width : 20, height : 20}}source={require("../../assets/eventDetails/Group.png")} /> */}
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
            {`${event?.going_count} going`}
          </Text>
        </View>
      )}

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
            {event?.fullDate}
          </Text>
          <Text
            style={{
              fontSize: Typography.FONT_SIZE_16,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontWeight: Typography.FONT_WEIGHT_BOLD,
              color: Colors.WHITE
            }}
          >
            {event?.start_date}
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
        <View style={{ marginLeft: "5%", justifyContent: "center" }}>
          <Text
            style={{
              fontSize: Typography.FONT_SIZE_16,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontWeight: Typography.FONT_WEIGHT_500,
              color: Colors.WHITE
            }}
          >
            {event?.location}
          </Text>
          {/* <Text
            style={{
              fontSize: Typography.FONT_SIZE_13,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontWeight: Typography.FONT_WEIGHT_500,
              color: Colors.GREY
            }}
          >
            {event?.location}
          </Text> */}
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
          {event?.desc}
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
            numberOfLines={1}
          >
            {event?.event_categories?.length > 0
              ? event?.event_categories[0].name
              : ""}
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

      {!global?.user?.event_planner && (
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
            onPress={async () => {
              try {
                const resp = await markEventAsInterested({ event: event.id })
                console.log(" interested event response ", resp)
                Alert.alert("Thank you for your interest", "Check My Event")
              } catch (error) {
                if(error === "You're already interested in this event")
                  Alert.alert(error)
                
              }
            }}
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

          {event?.bottle_services.length > 0 && (
            <TouchableOpacity
              onPress={() => navigation.navigate("EventMenu", { event })}
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
          )}
        </View>
      )}
      {loadingDetails && <LoaderComponent></LoaderComponent>}
      <CustomModal
        isVisible={showFavModal}
        text={"Added To favourite"}
        onClose={() => setShowFavModal(false)}
      ></CustomModal>
    </ScrollView>
  )
}

export default EventDetailsScreen
