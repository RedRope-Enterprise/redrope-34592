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
  LogBox
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, Input, CustomModal, HomeEventItem, LoaderComponent } from "../../components"
import { Colors, Typography, Mixins } from "../../styles"
import NavigationHeader from "../../components/NavigationHeader"
import { useNavigation } from "@react-navigation/native"
import {
  getDataStorage,
  setDataStorage,
  clearStorage
} from "../../utils/storage"
import { data } from "../../data"

import { useSelector, useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import { getUser } from "../../services/user"
import { getCategories, getEvents } from "../../services/events"
import { applyFilter } from "../../store/custom/Home/home.slice"
import FastImage from "react-native-fast-image"

const { width, height } = Dimensions.get("window")

const HomeScreen = () => {
  LogBox.ignoreLogs(["Warning: ..."]) // Ignore log notification by message
  LogBox.ignoreAllLogs()
  const navigation = useNavigation()
  const [events, setEvents] = useState([])
  const [eventCategories, setEventCategories] = useState([])

  const [searchedEvents, setSearchedEvents] = useState([])

  const [searchValue, setSearchValue] = useState("")
  const [userImage, setUserImage] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const { hasFilters, filterObj } = useSelector(state => state.home)

  const dispatch = useDispatch()

  useEffect(async () => {
    const events = data.getEvents()
    setEvents(events)
    getUser()
  }, [])

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      let user = global.user
      setUserImage(user?.profile_picture)

      // The screen is focused
      // Call any action
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [navigation])

  useEffect(async () => {
    getEventsFromBackend()
    getEventCategories()
  }, [hasFilters])

  const getEventsFromBackend = async () => {
    let resp = await getEvents(hasFilters ? filterObj : {})
    setEvents(resp.results)
  }

  const getEventCategories = async () => {
    let resp = await getCategories()
    setEventCategories(resp?.results)
  }

  const getUser = async () => {
    const user = await getDataStorage("@user")
    console.log("user ", user)
    if (user) {
      global.user = user
      setUserImage(user?.profile_picture)
    }
    setIsLoading(false)
  }

  SearchForEvent = value => {
    setSearchValue(value)
    let searchResult = []
    if (value.length >= 3) {
      events.forEach(event => {
        if (event.title.toLowerCase().includes(value.toLowerCase())) {
          searchResult.push(event)
        }
      })

      setSearchedEvents(searchResult)
    } else {
      setSearchedEvents([])
    }
  }

  const CategoryRender = ({ event }) => (
    <TouchableOpacity
      style={{
        height: 190,
        width: 160,
        marginHorizontal: 5,
        flex: 1,
        alignItems: "flex-end"
      }}
      key={event.id}
    >
      <FastImage
        imageStyle={{
          borderRadius: 10,
          backgroundColor: Colors.NETURAL_3
        }}
        style={{
          width: "100%",
          height: "100%",
          // height: Mixins.scaleHeight(120),
          borderRadius: 30,
          backgroundColor: Colors.NETURAL_3
        }}
        resizeMode="cover"
        source={{ uri: event.image }}
      >
        <Text
          style={{
            position: "absolute",
            bottom: 20,
            marginLeft: 10,
            marginRight: 20,
            color: Colors.WHITE,
            fontSize: Typography.FONT_SIZE_14,
            fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
            fontWeight: Typography.FONT_WEIGHT_BOLD
          }}
        >
          {event.name}
        </Text>
      </FastImage>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      <TouchableOpacity
        onPress={() => navigation.navigate("UserProfile")}
        style={{ alignSelf: "flex-end", marginRight: "5%" }}
      >
        <Image
          style={{ width: 30, height: 30, borderRadius: 1000 }}
          source={{ uri: userImage }}
        />
      </TouchableOpacity>

      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            borderRadius: 10,
            marginHorizontal: "5%",
            backgroundColor: Colors.NETURAL_4,
            marginTop: "5%"
          }}
        >
          <TouchableOpacity>
            <Image
              style={{ width: 24, height: 24, margin: 15 }}
              source={require("../../assets/dashboard/search-on.png")}
            />
          </TouchableOpacity>

          <TextInput
            style={{
              color: Colors.WHITE,

              flex: 1,
              height: "100%",
              fontSize: Typography.FONT_SIZE_16,
              fontWeight: Typography.FONT_WEIGHT_REGULAR,
              fontFamily: Typography.FONT_FAMILY_POPPINS_LIGHT
            }}
            placeholder={"What do you want to experience "}
            placeholderTextColor={Colors.NETURAL_2}
            value={searchValue}
            onChangeText={value => SearchForEvent(value)}
          />

          <TouchableOpacity onPress={() => navigation.navigate("Filters")}>
            <Image
              style={{ width: 24, height: 24, margin: 15 }}
              source={require("../../assets/images/home/Adjust.png")}
            />
          </TouchableOpacity>
        </View>

        <View style={{ marginTop: "5%", marginHorizontal: "5%" }}>
          <Text
            style={{
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontSize: Typography.FONT_SIZE_14,
              fontWeight: Typography.FONT_WEIGHT_600,
              color: Colors.PRIMARY_1,
              marginVertical: "5%"
            }}
          >
            Categories
          </Text>

          <FlatList
            style={
              {
                // paddingLeft: Mixins.scaleWidth(10),
                // marginTop: "5%"
              }
            }
            horizontal={true}
            data={eventCategories}
            extraData={eventCategories}
            renderItem={({ item }) => <CategoryRender event={item} />}
            keyExtractor={(item, index) => index}
          />
        </View>

        {events?.length > 0 && (
          <View style={{ marginTop: "5%", marginHorizontal: "5%" }}>
            <Text
              style={{
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                fontSize: Typography.FONT_SIZE_14,
                fontWeight: Typography.FONT_WEIGHT_600,
                color: Colors.PRIMARY_1,
                marginVertical: "5%"
              }}
            >
              Events that match your interests
            </Text>

            <View style={{}}>
              <FlatList
                style={
                  {
                    // paddingLeft: Mixins.scaleWidth(10),
                    // marginTop: "5%"
                  }
                }
                contentContainerStyle={{ paddingRight: 10 }}
                numColumns={1}
                data={searchValue.length >= 3 ? searchedEvents : events}
                extraData={searchedEvents}
                renderItem={({ item }) => (
                  <HomeEventItem
                    event={item}
                    onPress={() =>
                      navigation.navigate("EventDetails", { event: item })
                    }
                  />
                )}
                keyExtractor={(item, index) => index}
              />
            </View>
          </View>
        )}
      </ScrollView>
      {isLoading &&<LoaderComponent></LoaderComponent>}
    </SafeAreaView>
  )
}

export default HomeScreen

let styles = StyleSheet.create({
  button: {
    width: 100,
    height: 50,
    backgroundColor: "red"
  }
})
