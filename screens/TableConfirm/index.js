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
  FlatList
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, Input, CustomModal } from "../../components"
import { Colors, Typography } from "../../styles"
import NavigationHeader from "../../components/NavigationHeader"
import { useNavigation } from "@react-navigation/native"
import {
  getDataStorage,
  setDataStorage,
  clearStorage
} from "../../utils/storage"
import { useRoute } from "@react-navigation/native"

import { useSelector, useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import DummyBanner from "../../assets/images/table_select/dummy.png"
import LocationImg from "../../assets/images/table_select/location.png"
import CalendarImg from "../../assets/images/table_select/calendar.png"
import PersonImg from "../../assets/images/table_select/person.png"

import { data } from "../../data"

const { width, height } = Dimensions.get("window")

const TableConfirmScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const [data, setData] = useState([])
  const { event } = route?.params

  useEffect(() => {
    let arr = []
    arr.push({
      title: event?.fullDate,
      desc: event?.fullTime,
      image: CalendarImg
    })

    arr.push({
      title: event?.location,
      desc: event?.location,
      image: LocationImg
    })

    arr.push({
      title: "4/12 Filled",
      desc: "Final price not confirmed until total party confirmed 12 hours prior to event.",
      image: PersonImg
    })

    setData(arr)
  }, [])

  const renderDetailItem = ({ item }) => {
    return (
      <View style={styles.center}>
        <View style={styles.itemContainer}>
          <View style={styles.itemImgContainer}>
            <Image style={styles.itemIcon} source={item.image}></Image>
          </View>
          <View
            style={{
              flex:1
            }}
          >
            <Text style={[styles.desc, { color: Colors.WHITE }]}>
              {item.title}
            </Text>
            <Text style={[styles.desc2, { color: Colors.NETURAL_2 }]}>
              {item.desc}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      <NavigationHeader
        showLeftBtn1={true}
        showLeftBtn2={true}
      ></NavigationHeader>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: Colors.WHITE }]}>Disclaimer</Text>
      </View>
      <View style={styles.banner}>
        <Image style={styles.full} source={event?.image} />
      </View>
      <View style={[styles.flex1, { marginBottom: "4%", marginTop: "4%" }]}>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={renderDetailItem}
        />
      </View>
      <View style={styles.nextBtnContainer}>
        <Button
          btnWidth={width * 0.8}
          backgroundColor={Colors.BUTTON_RED}
          viewStyle={{
            borderColor: Colors.facebook,
            marginBottom: 2
          }}
          height={35}
          textFontWeight={Typography.FONT_WEIGHT_600}
          textStyle={{
            color: Colors.white,
            fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
            fontSize: Typography.FONT_SIZE_14
          }}
          onPress={() => {}}
        >
          NEXT
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default TableConfirmScreen

let styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  flex1: {
    flex: 1
  },
  title: {
    fontSize: Typography.FONT_SIZE_24,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    lineHeight: Typography.LINE_HEIGHT_36,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    textAlign: "center"
  },
  desc: {
    fontSize: Typography.FONT_SIZE_16,
    fontWeight: Typography.FONT_WEIGHT_500,
    lineHeight: Typography.LINE_HEIGHT_24,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    marginTop: "2%"
  },
  desc2: {
    fontSize: Typography.FONT_SIZE_13,
    fontWeight: Typography.FONT_WEIGHT_500,
    lineHeight: Typography.LINE_HEIGHT_20,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    marginTop: "1%"
  },
  banner: {
    justifyContent: "center",
    alignContent: "center",
    height: undefined,
    width: "100%",
    aspectRatio: 1.568
  },
  full: {
    width: "100%",
    height: "100%"
  },
  titleContainer: {
    justifyContent: "center",
    alignContent: "center",
    height: undefined,
    width: "100%",
    aspectRatio: 4.64
  },
  nextBtnContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "5%"
  },
  itemContainer: {
    flexDirection: "row",
    width: "85%",
    paddingTop: "6%",
    paddingBottom: "2%"
  },
  itemImgContainer: {
    width: "15%",
    height: undefined,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.PRIMARY_1_OPACITY_10,
    borderRadius: 12,
    marginRight: "6%"
  },
  itemIcon: {
    width: "60%",
    height: undefined,
    aspectRatio: 1
  }
})
