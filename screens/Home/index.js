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
  FlatList
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

import { useSelector, useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
const { width, height } = Dimensions.get("window")

const HomeScreen = () => {
  const navigation = useNavigation()
  const [events, setEvents] = useState([])
  const [searchValue, setSearchValue] = useState("")

  useEffect(async () => {
    const events = data.getEvents()
    setEvents(events)
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      <TouchableOpacity style={{ alignSelf: "flex-end", marginRight: "5%" }}>
        <Image
          style={{ width: 30, height: 30, borderRadius: 1000 }}
          source={require("../../assets/images/userImage.png")}
        />
      </TouchableOpacity>

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
          onChangeText={value => setSearchValue(value)}
        />

        <TouchableOpacity>
          <Image
            style={{ width: 24, height: 24, margin: 15 }}
            source={require("../../assets/images/home/Adjust.png")}
          />
        </TouchableOpacity>
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
              style={{
                // paddingLeft: Mixins.scaleWidth(10),
                marginBottom: 250,
                // marginTop: "5%"
              }}
              contentContainerStyle={{ paddingRight: 10 }}
              numColumns={1}
              data={events}
              extraData={events}
              renderItem={({ item }) => <HomeEventItem event={item} />}
              keyExtractor={(item, index) => index}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  )
}

export default HomeScreen
