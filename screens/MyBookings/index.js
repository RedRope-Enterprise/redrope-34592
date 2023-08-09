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
  TextInput,
  ScrollView,
  FlatList
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, Input, CustomModal, UserBookingsItem } from "../../components"
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
const { width, height } = Dimensions.get("window")
import {
  getMyEvents,
  markEventAsInterested,
  addEventToFavorite
} from "../../services/events"

const MyBookingsScreen = () => {
  const navigation = useNavigation()
  const [searchValue, setSearchValue] = useState("")
  const [myBookings, setMyBookings] = useState([])
  const [searchedEvents, setSearchedEvents] = useState([])

  const [user, setUser] = useState()

  useEffect(async () => {
    getEventsFromBE()
    getUser()
  }, [])

  const getEventsFromBE = async () => {
    const events = await getMyEvents()
    console.log("MY events ", events)

    if (events) setMyBookings(events.results)
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setUser(global.user)
      getEventsFromBE()
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [navigation])

  SearchForEvent = value => {
    setSearchValue(value)
    let searchResult = []
    if (value.length >= 3) {
      myBookings.forEach(event => {
        console.log("event ", event)
        if (event.event_title.toLowerCase().includes(value.toLowerCase())) {
          searchResult.push(event)
        }
      })

      setSearchedEvents(searchResult)
    } else {
      setSearchedEvents([])
    }
  }

  const getUser = async () => {
    let u = global.user
    setUser(u)
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      {!user?.event_planner && (
        <TouchableOpacity
          onPress={() => navigation.navigate("UserProfile")}
          style={{ alignSelf: "flex-end", marginRight: "5%" }}
        >
          <Image
            style={{ width: 30, height: 30, borderRadius: 1000 }}
            source={{ uri: user?.profile_picture }}
          />
        </TouchableOpacity>
      )}

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
            placeholder={"Search my events"}
            placeholderTextColor={Colors.NETURAL_2}
            value={searchValue}
            onChangeText={value => SearchForEvent(value)}
          />
        </View>

        <FlatList
          style={{
            marginHorizontal: "5%",
            marginTop: "5%"
          }}
          contentContainerStyle={{ paddingRight: 10 }}
          numColumns={1}
          data={searchValue.length >= 3 ? searchedEvents : myBookings}
          extraData={searchedEvents}
          renderItem={({ item }) => (
            <UserBookingsItem
              event={item}
              onPress={() => {
                if (item.event_id) item.id = item.event_id
                navigation.navigate("EventDetails", { event: item })
              }}
            />
          )}
          keyExtractor={(item, index) => index}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default MyBookingsScreen
