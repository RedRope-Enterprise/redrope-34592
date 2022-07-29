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
  ImageBackground,
  ScrollView
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, Input, CustomModal, CustomImageModal } from "../../components"
import { Colors, Typography } from "../../styles"
import NavigationHeader from "../../components/NavigationHeader"
import { useNavigation } from "@react-navigation/native"
import {
  getDataStorage,
  setDataStorage,
  clearStorage
} from "../../utils/storage"

import { useSelector, useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import DummyBanner from "../../assets/images/table_select/dummy.png"
import LocationImg from "../../assets/images/table_select/location.png"
import CalendarImg from "../../assets/images/table_select/calendar.png"
import PersonImg from "../../assets/images/table_select/person.png"
import { useRoute } from "@react-navigation/native"

import AppleIcon from "../../assets/images/payment/apple.png"
import CardBackImg from "../../assets/images/payment/card_back.png"
import GoogleIcon from "../../assets/images/payment/google.png"
import VisaIcon from "../../assets/images/payment/visa.png"
import SuccessPopupImg from "../../assets/images/payment/successPopup.png"

import { data } from "../../data"

const { width, height } = Dimensions.get("window")

const PaymentScreen = () => {
  const route = useRoute()
  const { price } = route?.params

  const navigation = useNavigation()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const renderPaymentMethod = (title, icon) => {
    return (
      <View style={styles.center}>
        <TouchableOpacity onPress={() => {}}>
          <View style={styles.itemContainer}>
            <View style={styles.itemImgContainer}>
              <Image
                resizeMode="center"
                style={styles.itemIcon}
                source={icon}
              ></Image>
            </View>
            <View>
              <Text style={[styles.desc, { color: Colors.WHITE }]}>
                {title}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const renderCard = (title, icon) => {
    return (
      <View style={styles.center}>
        <TouchableOpacity onPress={() => {}}>
          <View style={[styles.itemContainer]}>
            <ImageBackground
              style={[styles.full, styles.cardBackground]}
              source={CardBackImg}
            >
              <View style={{ marginLeft: "8%" }}>
                <Text style={[styles.desc, { color: Colors.WHITE }]}>
                  {title}
                </Text>
              </View>
              <View style={styles.cardImage}>
                <Image
                  resizeMode="center"
                  style={styles.itemIcon}
                  source={icon}
                ></Image>
              </View>
            </ImageBackground>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  const renderAddCardButton = () => {
    return (
      <View style={styles.center}>
        <TouchableOpacity onPress={() => {}}>
          <View style={[styles.itemContainer, { justifyContent: "center" }]}>
            <View>
              <Text style={[styles.desc, { color: Colors.WHITE }]}>
                Add New Card
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      <NavigationHeader></NavigationHeader>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: Colors.WHITE }]}>Payment</Text>
      </View>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.subTitleContainer}>
          <Text style={[styles.subTitle, { color: Colors.PRIMARY_1 }]}>
            Payment Method
          </Text>
        </View>
        {renderPaymentMethod("Google Pay", GoogleIcon)}
        {renderPaymentMethod("Apple Pay", AppleIcon)}
        <View style={styles.subTitleContainer}>
          <Text style={[styles.subTitle, { color: Colors.PRIMARY_1 }]}>
            Pay with Debit/Credit Card
          </Text>
        </View>
        {renderCard("3827 **** **** 0007", VisaIcon)}
        <View style={styles.border}></View>
        {renderAddCardButton()}
      </ScrollView>
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
          onPress={() => {
            setIsModalVisible(true)
          }}
        >
          {`PAY $${50}`}
        </Button>
      </View>
      <CustomImageModal
        isVisible={isModalVisible}
        text={`We are going to notify you when all users from your group are paid and`}
        image={SuccessPopupImg}
        onClose={() => setIsModalVisible(false)}
      ></CustomImageModal>
    </SafeAreaView>
  )
}

export default PaymentScreen

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
    marginLeft: "5%",
    marginTop: "4%"
  },
  subTitle: {
    fontSize: Typography.FONT_SIZE_14,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    lineHeight: Typography.LINE_HEIGHT_18,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    marginLeft: "5%"
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
  full: {
    width: "100%",
    height: "100%"
  },
  titleContainer: {
    justifyContent: "center",
    alignContent: "center",
    height: undefined,
    width: "100%",
    aspectRatio: 4.64,
    marginTop: "10%"
  },
  subTitleContainer: {
    justifyContent: "center",
    alignContent: "center",
    marginTop: "6%",
    marginBottom: "6%",
    // height: undefined,
    width: "100%"
    // aspectRatio: 4.64
  },
  nextBtnContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "5%"
  },
  itemContainer: {
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
    backgroundColor: Colors.NETURAL_5,
    aspectRatio: 5.26,
    borderRadius: 16,
    marginBottom: "5%"
  },
  itemImgContainer: {
    width: "15%",
    height: undefined,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginRight: "3%",
    marginLeft: "4%"
  },
  itemIcon: {
    width: "60%",
    height: undefined,
    aspectRatio: 1
  },
  cardBackground: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  cardImage: {
    width: "30%",
    justifyContent: "center",
    alignItems: "center"
  },
  border: {
    width: "90%",
    height: 1,
    backgroundColor: Colors.NETURAL_5,
    marginBottom: "5%",
    alignSelf: "center"
  }
})
