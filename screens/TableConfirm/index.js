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
  FlatList,
  ScrollView
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, Input, CustomModal } from "../../components"
import { Colors, Typography } from "../../styles"
import NavigationHeader from "../../components/NavigationHeader"
import { useNavigation } from "@react-navigation/native"
import FastImage from 'react-native-fast-image';

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
import RatioImage from "../../assets/images/table_select/Date.png"
import { Slider } from "@miblanchard/react-native-slider"

import { data } from "../../data"

const { width, height } = Dimensions.get("window")

const TableConfirmScreen = () => {
  const route = useRoute()
  const { event } = route?.params
  console.log(JSON.stringify(event, null, 2))

  const calculatePriceToPay = () => {
    let v = ((valueToPayPercentage / 100) * event?.price).toFixed(2)
    setPriceToPay(v)
  }

  const navigation = useNavigation()

  const [data, setData] = useState([])
  const [valueToPayPercentage, setValueToPayPercentage] = useState(10)
  const [priceToPay, setPriceToPay] = useState()

  useEffect(() => {
    calculatePriceToPay()

    let arr = []
    arr.push({
      title: event?.start_date,
      desc: event?.start_date,
      image: CalendarImg
    })

    arr.push({
      title: event?.location,
      desc: event?.location,
      image: LocationImg
    })

    arr.push({
      title: "Pay $50 now to reserve",
      desc: "You can reserve spot in this event and wait to be filled.",
      image: RatioImage
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
            <FastImage style={styles.itemIcon} source={item.image}></FastImage>
          </View>
          <View
            style={{
              flex: 1
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
    <ScrollView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      <NavigationHeader
        showLeftBtn1={true}
        showLeftBtn2={true}
      ></NavigationHeader>
      {/* <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: Colors.WHITE }]}>Disclaimer</Text>
      </View> */}
      <View style={styles.banner}>
        <FastImage
          style={styles.full}
          source={{
            uri: event?.event_images ? event?.event_images[0].image : ""
          }}
        />
      </View>

      <View style={[styles.flex1, { marginBottom: "4%", marginTop: "4%" }]}>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={renderDetailItem}
        />
      </View>
      <View style={styles.nextBtnContainer}>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: "5%",
            marginTop: "5%",
            marginBottom: "3%"
          }}
        >
          <Text
            style={{
              flex: 1,
              alignItems: "center",
              alignSelf: "center",
              color: Colors.NETURAL_2,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontSize: Typography.FONT_SIZE_14,
              fontWeight: Typography.FONT_WEIGHT_400
            }}
          >
            Event Name
          </Text>
          <Text
            style={{
              alignItems: "center",
              alignSelf: "center",
              color: Colors.NETURAL_2,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontSize: Typography.FONT_SIZE_14,
              fontWeight: Typography.FONT_WEIGHT_400
            }}
          >
            {event?.title}
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginHorizontal: "5%" }}>
          <Text
            style={{
              flex: 1,
              alignItems: "center",
              alignSelf: "center",
              color: Colors.NETURAL_2,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontSize: Typography.FONT_SIZE_14,
              fontWeight: Typography.FONT_WEIGHT_400
            }}
          >
            Total Price
          </Text>
          <Text
            style={{
              alignItems: "center",
              alignSelf: "center",
              color: Colors.NETURAL_2,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontSize: Typography.FONT_SIZE_14,
              fontWeight: Typography.FONT_WEIGHT_400
            }}
          >
            {`$${event?.price}`}
          </Text>
        </View>
        <View
          style={{
            alignSelf: "center",
            marginVertical: "5%",
            width: "90%",
            borderBottomColor: Colors.WHITE,
            borderBottomWidth: 1,
            opacity: 1
          }}
        />
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: "5%",
            marginBottom: "5%"
          }}
        >
          <Text
            style={{
              flex: 1,
              alignItems: "center",
              alignSelf: "center",
              color: Colors.WHITE,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontSize: Typography.FONT_SIZE_16,
              fontWeight: Typography.FONT_WEIGHT_400
            }}
          >
            Pay now to reserve
          </Text>
          <Text
            style={{
              alignItems: "center",
              alignSelf: "center",
              color: Colors.WHITE,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontSize: Typography.FONT_SIZE_16,
              fontWeight: Typography.FONT_WEIGHT_400
            }}
          >
            {`$${50}`}
          </Text>
        </View>
        {/* <Text style={styles.downpaymentPayText}>
          Decide the percentage you want to pay upfront
        </Text> */}
        {/* <View style={{ flexDirection: "row", marginHorizontal: "5%" }}>
          <Text
            style={[
              styles.downpaymentPayText,
              {
                flex: 1,
                textAlign: "left",
                color: Colors.PRIMARY_1,
                fontSize: Typography.FONT_SIZE_16
              }
            ]}
          >
            {`Pay ${valueToPayPercentage}% now`}
          </Text>
          <Text
            style={[
              styles.downpaymentPayText,
              {
                color: Colors.PRIMARY_1,
                fontSize: Typography.FONT_SIZE_18,
                fontWeight: Typography.FONT_WEIGHT_BOLD
              }
            ]}
          >
            {`$${priceToPay}`}
          </Text>
        </View> */}

        {/* <View style={{ flex: 1, width: "90%", marginVertical: "5%" }}>
          <Slider
            step={1}
            maximumTrackTintColor={Colors.GREY}
            thumbTintColor={Colors.PRIMARY_1}
            animationType={"spring"}
            thumbTouchSize={{ width: 40, height: 40 }}
            minimumTrackTintColor={Colors.PRIMARY_1}
            containerStyle={{ height: "100%", width: "100%", flex: 1 }}
            value={valueToPayPercentage}
            maximumValue={100}
            minimumValue={10}
            onValueChange={value => {
              setValueToPayPercentage(value)
              calculatePriceToPay()
            }}
            renderThumbComponent={() => {
              return (
                <View
                  style={{
                    borderWidth: 1,
                    borderRadius: 20,
                    borderColor: Colors.PRIMARY_1,
                    backgroundColor: Colors.NETURAL_3
                  }}
                >
                  <Text
                    style={{
                      margin: 10,
                      color: Colors.PRIMARY_1,
                      fontSize: Typography.FONT_SIZE_18,
                      fontWeight: Typography.FONT_WEIGHT_BOLD
                    }}
                  >
                    {`$${valueToPayPercentage}`}
                  </Text>
                </View>
              )
            }}
          />
        </View> */}

        <View style={{ marginVertical: "5%" }}>
          <Button
            btnWidth={width * 0.8}
            backgroundColor={Colors.BUTTON_RED}
            viewStyle={{
              borderColor: Colors.facebook,
              marginBottom: "5%"
            }}
            height={35}
            textFontWeight={Typography.FONT_WEIGHT_600}
            textStyle={{
              color: Colors.white,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontSize: Typography.FONT_SIZE_14
            }}
            onPress={() => {
              navigation.navigate("PaymentScreen", {
                price: priceToPay,
                attendeeCount: event?.attendeeCount,
                event: event
              })
            }}
          >
            NEXT
          </Button>
        </View>
      </View>
    </ScrollView>
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
  downpaymentPayText: {
    fontSize: Typography.FONT_SIZE_13,
    fontWeight: Typography.FONT_WEIGHT_500,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    textAlign: "left",
    color: Colors.GREY,
    marginVertical: "5%"
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
    backgroundColor: Colors.NETURAL_4,
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
