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
import {
  Button,
  Input,
  CustomModal,
  HomeEventItem,
  LoaderComponent
} from "../../components"
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
import { useRoute } from "@react-navigation/native"

const { width, height } = Dimensions.get("window")

const EventsByCategoryScreen = () => {
  LogBox.ignoreLogs(["Warning: ..."]) // Ignore log notification by message
  LogBox.ignoreAllLogs()
  const route = useRoute()

  const navigation = useNavigation()
  const [events, setEvents] = useState(route.params?.events)
  const [eventCategories, setEventCategories] = useState([])

  const [searchedEvents, setSearchedEvents] = useState([])

  const [searchValue, setSearchValue] = useState("")
  const [userImage, setUserImage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { hasFilters, filterObj } = useSelector(state => state.home)

  const dispatch = useDispatch()

  useEffect(async () => {}, [])

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      <NavigationHeader></NavigationHeader>
      {events?.length > 0 && (
        <ScrollView>
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
              {`${route.params?.category} events`}
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
        </ScrollView>
      )}

      {events?.length === 0 && (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <Text
            style={{
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontSize: Typography.FONT_SIZE_14,
              fontWeight: Typography.FONT_WEIGHT_600,
              color: Colors.PRIMARY_1
            }}
          >
            {`No event available for ${route.params?.category} category`}
          </Text>
        </View>
      )}
      {isLoading && <LoaderComponent></LoaderComponent>}
    </SafeAreaView>
  )
}

export default EventsByCategoryScreen

let styles = StyleSheet.create({
  button: {
    width: 100,
    height: 50,
    backgroundColor: "red"
  }
})
