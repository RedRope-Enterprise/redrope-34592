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
  ScrollView,
  ActivityIndicator,
  Platform
} from "react-native"
import CheckBox from "@react-native-community/checkbox"

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import {
  Button,
  Input,
  CustomModal,
  CustomImageModal,
  LoaderComponent
} from "../../components"
import { Colors, Typography } from "../../styles"
import NavigationHeader from "../../components/NavigationHeader"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
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

import {
  useConfirmPayment,
  isPlatformPaySupported
} from "@stripe/stripe-react-native"
import { data } from "../../data"

import {
  confirmReservation,
  createPaymentIntent,
  getCardsList,
  makeReservation,
  payBalanceAmount,
  confirmBalanceAmount
} from "../../services/Payment"

import {
  useApplePay,
  confirmPlatformPayPayment,
  PlatformPay
} from "@stripe/stripe-react-native"

const { width, height } = Dimensions.get("window")

const PaymentScreen = () => {
  const route = useRoute()
  const { price, attendeeCount, event } = route?.params

  const navigation = useNavigation()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [selectedCardIndex, setSelectedCardIndex] = useState(-1)
  const [isApplePaySupported, setIsApplePaySupported] = useState(false)

  const { confirmPayment } = useConfirmPayment()
  // const { presentApplePay, confirmApplePayPayment } = useApplePay()

  useEffect(() => {
    ;(async function () {
      const resp = await isPlatformPaySupported()
      console.log(" resp", resp)
      setIsApplePaySupported(await isPlatformPaySupported())
    })()
  }, [isPlatformPaySupported])

  async function getCardsData(params = "") {
    try {
      setLoading(true)
      let response = await getCardsList(params)
      console.log(JSON.stringify(response.data, null, 2))
      setLoading(false)
      setData([])
      setData(response.data)
    } catch (error) {
      setLoading(false)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getCardsData()
    }, [])
  )

  // Apple Pay related config
  const { presentApplePay, confirmApplePayPayment } = useApplePay({
    onShippingMethodSelected: (shippingMethod, handler) => {
      __DEV__ && console.log("shippingMethod", shippingMethod)
      // Update cart summary based on selected shipping method.
    },
    onShippingContactSelected: (shippingContact, handler) => {
      __DEV__ && console.log("shippingContact", shippingContact)
      // Make modifications to cart here e.g. adding tax.
      // handler(cart);
    }
  })

  const renderPaymentMethod = (title, icon) => {
    return (
      <View style={styles.center}>
        <TouchableOpacity
          onPress={async () => {
            if (title == "Apple Pay") {
              setLoading(true)
              if (event?.id && event?.is_reserved) {
                try {
                  let response = await payBalanceAmount({
                    event: event?.id,
                    channel: "apple"
                  })

                  console.log("response ", response)

                  const { error } = await confirmPlatformPayPayment(
                    response.client_secret,
                    {
                      applePay: {
                        cartItems: [
                          {
                            amount: event?.reservation_details?.amount_left,
                            label: event?.title,
                            paymentType: PlatformPay.PaymentType.Immediate
                          }
                        ],
                        merchantCountryCode: "US",
                        currencyCode: "USD",
                        supportedNetworks: ["visa", "mastercard"],
                        requiredBillingContactFields: [
                          PlatformPay.ContactField.PhoneNumber
                        ]
                      }
                    }
                  )

                  if (error) {
                    console.log(
                      "Payment Failed: error: " + JSON.stringify(error)
                    )
                    Alert.alert(
                      "Payment Failed:",
                      error.localizedMessage || error || ""
                    )
                  } else {
                    let resp = await confirmBalanceAmount({
                      payment_intent_id: response.payment_intent_id
                    })
                    console.log("confirm apple pay resp", resp)
                    setIsModalVisible(true)
                  }
                } catch (err) {
                  console.log("error ", err)
                  if (err?.error && err?.error == "Reservation already exists.")
                    Alert.alert(
                      "Reservation already exists.",
                      "This bottle service is already reserved!"
                    )
                  else if (err?.error)
                    Alert.alert("Payment process", err?.error.toString())
                  else
                    Alert.alert(
                      "Payment process",
                      "Unable to complete payment process at the moment. Pleae try again later."
                    )
                  setLoading(false)
                }
              } else if (event?.id && event.bottle_services.length > 0) {
                try {
                  let response = await makeReservation({
                    event: event?.id,
                    attendee: attendeeCount,
                    bottle_service: event?.bottle_services[0].id,
                    // payment_method: paymentResult?.paymentMethod?.id,
                    channel: "apple"
                  })

                  const { error } = await confirmPlatformPayPayment(
                    response.client_secret,
                    {
                      applePay: {
                        cartItems: [
                          {
                            label: event?.title,
                            amount: price,
                            paymentType: PlatformPay.PaymentType.Immediate
                          }
                        ],
                        merchantCountryCode: "US",
                        currencyCode: "USD",
                        supportedNetworks: ["visa", "mastercard"],
                        requiredBillingContactFields: [
                          PlatformPay.ContactField.PhoneNumber
                        ]
                      }
                    }
                  )

                  if (error) {
                    Alert.alert("Payment Failed:", error || "")
                  } else {
                    let result = await confirmReservation({
                      payment_intent_id: response.payment_intent_id
                    })

                    console.log(JSON.stringify(result, null, 2))
                    if (result.status === "OK") {
                      setIsModalVisible(true)
                    }
                  }

                  console.log("error apple pay", error)
                } catch (err) {
                  console.log("error ", err)
                  if (err?.error && err?.error == "Reservation already exists.")
                    Alert.alert(
                      "Reservation already exists.",
                      "This bottle service is already reserved!"
                    )
                  else if (err?.error)
                    Alert.alert("Payment process", err?.error.toString())
                  else
                    Alert.alert(
                      "Payment process",
                      "Unable to complete payment process at the moment. Pleae try again later."
                    )
                  setLoading(false)
                }
              }
              setLoading(false)
            }
          }}
        >
          <View style={styles.itemContainer}>
            <View style={styles.itemImgContainer}>
              <Image
                resizeMode="contain"
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

  const renderCard = (card, index, title, icon) => {
    return (
      <View style={[styles.center, { flexDirection: "row" }]}>
        <CheckBox
          onCheckColor={"#fff"}
          onTintColor={Colors.BUTTON_RED}
          boxType={"circle"}
          onFillColor={Colors.BUTTON_RED}
          style={{
            marginRight: width * 0.04,
            width: 20,
            height: 20,
            color: "#fff"
          }}
          disabled={false}
          value={index === selectedCardIndex}
          onValueChange={newValue => {
            if (newValue === false) {
              setSelectedCardIndex(-1)
            } else setSelectedCardIndex(index)
          }}
        />
        <TouchableOpacity onPress={() => {}}>
          <View style={[styles.itemContainer]}>
            <ImageBackground
              style={[styles.full, styles.cardBackground]}
              source={CardBackImg}
            >
              <View style={{ marginLeft: "8%" }}>
                <Text style={[styles.desc, { color: Colors.WHITE }]}>
                  {card ? "************" + card?.last4 : ""}
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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("AddNewCardScreen", { viewType: "add" })
          }}
        >
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

  const makeBalancePaymentWithCard = async (eventId, paymentMethod) => {
    try {
      const resp = await payBalanceAmount({
        event: eventId,
        payment_method: paymentMethod
      })

      console.log("makeBalancePaymentWithCard payBalanceAmount resp", resp)
      if (
        resp.status === "OK" &&
        resp?.reservation?.payment_status === "succeeded"
      ) {
        setLoading(false)
        setIsModalVisible(true)
      } else if (resp.error) {
        Alert.alert("Payment process", resp.error)
        navigation.goBack()
      } else {
        Alert.alert(
          "Payment process",
          "Something went wrong, Please try again later."
        )
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      Alert.alert("Payment process failed", error?.error || "try again later")
      setLoading(false)

      navigation.reset({
        index: 0,
        routes: [{ name: "Dashboard" }]
      })
    }
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
        {Platform.OS === "android" &&
          renderPaymentMethod("Google Pay", GoogleIcon)}
        {isApplePaySupported && renderPaymentMethod("Apple Pay", AppleIcon)}
        <View style={styles.subTitleContainer}>
          <Text style={[styles.subTitle, { color: Colors.PRIMARY_1 }]}>
            Pay with Debit/Credit Card
          </Text>
        </View>
        {data?.map((cardItem, index) => {
          return renderCard(cardItem, index)
        })}

        <View style={styles.border}></View>
        {data?.length == 0 && renderAddCardButton()}
      </ScrollView>
      <View style={styles.nextBtnContainer}>
        <Button
          btnWidth={width * 0.8}
          backgroundColor={Colors.BUTTON_RED}
          viewStyle={{
            borderColor: Colors.facebook,
            marginBottom: 10
          }}
          height={35}
          textFontWeight={Typography.FONT_WEIGHT_600}
          textStyle={{
            color: Colors.white,
            fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
            fontSize: Typography.FONT_SIZE_14
          }}
          disabled={selectedCardIndex === -1}
          onPress={async () => {
            console.log(event?.id, attendeeCount, price)
            console.log({
              event: event?.id,
              attendee: attendeeCount,
              bottle_service: event?.bottle_services[0].id
            })
            setLoading(true)
            if (event?.is_reserved) {
              await makeBalancePaymentWithCard(
                event?.id,
                data[selectedCardIndex]?.id
              )
              return
            }

            if (event?.id && event.bottle_services.length > 0) {
              try {
                let response = await makeReservation({
                  event: event?.id,
                  attendee: attendeeCount,
                  bottle_service: event?.bottle_services[0].id,
                  payment_method: data[selectedCardIndex]?.id
                })

                if (
                  response?.status === "OK" &&
                  response?.reservation?.payment_status === "succeeded"
                ) {
                  setLoading(false)

                  setIsModalVisible(true)
                }
              } catch (error) {
                console.log("error ", error)
                if (error?.error === "Reservation has already been made.") {
                  Alert.alert(
                    "Payment process",
                    "Reservation has already been made."
                  )
                  setLoading(false)

                  return
                }

                Alert.alert(
                  "Payment process",
                  "Unable to complete payment process at the moment. Pleae try again later."
                )
                setLoading(false)
              }
            }
            setLoading(false)

            // setIsModalVisible(true)
          }}
        >
          {`PAY $${
            event?.is_reserved ? event?.reservation_details?.amount_left : price
          }`}
        </Button>
      </View>

      <CustomImageModal
        isVisible={isModalVisible}
        text={
          event?.is_reserved
            ? `Event reserved completly`
            : `We are going to notify you when all users from your group are paid and`
        }
        image={SuccessPopupImg}
        onClose={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Dashboard" }]
          })
          setIsModalVisible(false)
        }}
      ></CustomImageModal>
      {loading && <LoaderComponent></LoaderComponent>}
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
    marginBottom: "10%"
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
    width: 30,
    height: 30,
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
