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
  FlatList,
  StyleSheet,
  useWindowDimensions
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import {
  Button,
  Input,
  CustomModal,
  UserBookingsItem,
  HomeEventItem
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
const { width, height } = Dimensions.get("window")
import { TabView, SceneMap, TabBar } from "react-native-tab-view"
import { getMyEvents } from "../../services/events"

const UserProfileScreen = () => {
  const navigation = useNavigation()

  const [name, setName] = React.useState("")
  const [user, setUser] = React.useState("")
  const [myEvents, setMyEvents] = React.useState([])

  useEffect(() => {
    getUser()
    getEventsFromBE()
  }, [])

  const getEventsFromBE = async () => {
    const events = await getMyEvents()
    console.log("MY events ", events)

    if (events) setMyEvents(events.results)
  }

  const getUser = async () => {
    let user = await getDataStorage("@user")
    setUser(user)
  }

  const [index, setIndex] = React.useState(0)

  const [routes] = React.useState([
    { key: "first", title: "About" },
    { key: "second", title: "Events" }
  ])

  _renderTabBar = props => {
    return (
      <TabBar
        {...props}
        inactiveColor={Colors.NETURAL_2}
        activeColor={Colors.PRIMARY_1}
        indicatorStyle={{
          backgroundColor: Colors.PRIMARY_1,
          alignSelf: "center"
        }}
        style={{ backgroundColor: null }}
        labelStyle={{
          fontSize: Typography.FONT_SIZE_14,
          fontWeight: Typography.FONT_WEIGHT_600
        }}
      />
    )
  }

  const AboutSection = () => {
    const [userInterests, setUserInterests] = useState(user?.likes)

    return (
      <View style={{ marginHorizontal: "5%" }}>
        <Text style={styles.aboutText}>{user?.bio || ""}</Text>

        <View>
          <Text style={styles.interestsText}>Interests</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {userInterests?.map((element, i) => (
              <View
                style={{
                  alignItems: "center",
                  marginHorizontal: 10,
                  backgroundColor: "#423a28",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: Colors.PRIMARY_1,
                  marginBottom: 10
                }}
              >
                <Text
                  style={{
                    margin: 5,
                    fontSize: Typography.FONT_SIZE_14,
                    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                    color: Colors.PRIMARY_1
                  }}
                >
                  {element.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    )
  }

  const EventsSection = () => {
    const [events, setEvents] = useState([])
    useEffect(async () => {
      const events = data.getEvents()
      setEvents(events)
    }, [])

    return (
      <View style={{}}>
        <FlatList
          style={{
            marginTop: "5%"
          }}
          contentContainerStyle={{ marginHorizontal: "5%" }}
          numColumns={1}
          data={myEvents}
          extraData={myEvents}
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
    )
  }

  const renderScene = SceneMap({
    first: AboutSection,
    second: EventsSection
  })

  return (
    <SafeAreaView style={[styles.flex1, { backgroundColor: Colors.NETURAL_3 }]}>
      <NavigationHeader></NavigationHeader>

      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginTop: "10%"
        }}
      >
        <View style={styles.userImageContainer}>
          <Image
            style={styles.userImage}
            source={{ uri: user?.profile_picture }}
          />
        </View>
        <Text style={styles.nameText}>{user?.name}</Text>
      </View>

      <TabView
        renderTabBar={_renderTabBar}
        style={{ flex: 1 }}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: "100%", height: 100 }}
      />
    </SafeAreaView>
  )
}

export default UserProfileScreen

let styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  flex1: {
    flex: 1
  },
  userImageContainer: {
    borderWidth: 1,
    borderRadius: 1000,
    overflow: "hidden",
    width: 140,
    height: 140
  },
  userImage: {
    width: "100%",
    height: "100%"
  },
  nameText: {
    fontSize: Typography.FONT_SIZE_16,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    fontWeight: Typography.FONT_WEIGHT_500,
    color: Colors.WHITE,
    marginVertical: "5%"
  },
  aboutText: {
    fontSize: Typography.FONT_SIZE_16,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    fontWeight: Typography.FONT_WEIGHT_400,
    color: Colors.WHITE,
    marginVertical: "5%",
    lineHeight: Typography.FONT_SIZE_24
  },
  interestsText: {
    fontSize: Typography.FONT_SIZE_14,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    fontWeight: Typography.FONT_WEIGHT_600,
    color: Colors.PRIMARY_1,
    marginVertical: "5%"
  }
})
