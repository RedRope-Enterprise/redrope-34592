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
import { Button, Input, CustomModal, HomeEventItem } from "../../components"
import { Colors, Typography, Mixins } from "../../styles"
import NavigationHeader from "../../components/NavigationHeader"
import { useNavigation } from "@react-navigation/native"
import {
  getDataStorage,
  setDataStorage,
  clearStorage
} from "../../utils/storage"
import { data } from "../../data"
import {
  getCategories,
  getEvents,
  getMyEvents,
  deleteEvent
} from "../../services/events"

const { width, height } = Dimensions.get("window")

const EventPlannerHomeScreen = () => {
  LogBox.ignoreLogs(["Warning: ..."]) // Ignore log notification by message
  LogBox.ignoreAllLogs()
  const navigation = useNavigation()
  const [events, setEvents] = useState([])
  const [eventCategories, setEventCategories] = useState([])

  const [searchedEvents, setSearchedEvents] = useState([])

  const [searchValue, setSearchValue] = useState("")
  const [userImage, setUserImage] = useState("")
  const [user, setUser] = useState("")

  useEffect(async () => {
    // const events = data.getEvents()
    // setEvents(events)
    getUser()
  }, [])

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      let user = global.user
      setUser(user)
      getEventsFromBackend()
      setUserImage(user?.profile_picture)

      // The screen is focused
      // Call any action
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [navigation])

  useEffect(async () => {
    getEventsFromBackend()
  }, [])

  const deleteEventNow = async id => {
    await deleteEvent(id)
    getEventsFromBackend()
  }

  const getEventsFromBackend = async () => {
    let resp = await getMyEvents()
    console.log("events ", resp.results)
    setEvents(resp.results)
  }

  const getUser = async () => {
    const user = global.user
    console.log("user ", user)
    if (user) {
      global.user = user
      setUser(user)
      setUserImage(user?.profile_picture)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            margin: "5%",
            justifyContent: "center"
          }}
        >
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                fontSize: Typography.FONT_SIZE_24,
                fontWeight: Typography.FONT_WEIGHT_BOLD,
                color: Colors.WHITE
              }}
            >
              Welcome
            </Text>
            <Text
              style={{
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                fontSize: Typography.FONT_SIZE_24,
                fontWeight: Typography.FONT_WEIGHT_BOLD,
                color: Colors.PRIMARY_1
              }}
            >
              {user?.business_name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("AddNewEventScreen")}
            style={{
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.BUTTON_RED,
              borderRadius: 100,
              marginVertical: "2%"
            }}
          >
            <Text
              style={{
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                fontSize: Typography.FONT_SIZE_14,
                fontWeight: Typography.FONT_WEIGHT_BOLD,
                color: Colors.WHITE,
                marginHorizontal: "5%"
              }}
            >
              ADD EVENT
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            alignSelf: "center",
            marginVertical: "5%",
            width: "100%",
            borderBottomColor: Colors.GREY,
            borderBottomWidth: 2,
            opacity: 0.2
          }}
        />

        {events?.length > 0 && (
          <View style={{ marginHorizontal: "5%" }}>
            <Text
              style={{
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                fontSize: Typography.FONT_SIZE_14,
                fontWeight: Typography.FONT_WEIGHT_600,
                color: Colors.PRIMARY_1,
                marginVertical: "5%"
              }}
            >
              My Events
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
                    deleteEvent={deleteEventNow}
                    navigation={navigation}
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
    </SafeAreaView>
  )
}

export default EventPlannerHomeScreen

let styles = StyleSheet.create({
  button: {
    width: 100,
    height: 50,
    backgroundColor: "red"
  }
})
