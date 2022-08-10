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
  TextInput
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

import ImgCalendar from "../../assets/images/payment/calendar.png"
import ImgUserIcon from "../../assets/images/payment/usericon.png"
import ImgCardIcon from "../../assets/images/payment/cardicon.png"
import ImgLock from "../../assets/images/payment/lock.png"
import VisaIcon from "../../assets/images/payment/visa.png"
import DotsIcon from "../../assets/images/dots.png"
import EditIcon from "../../assets/images/edit.png"
import DeleteIcon from "../../assets/images/delete.png"
import BigCardDesign from "../../components/BigCard"
import DeleteModal from "../../components/DeleteModal"
import { useRoute } from "@react-navigation/native"
import Popover, { Rect } from "react-native-popover-view"

import { data } from "../../data"
import {
  createToken,
  CardField,
  CardFieldInput,
  useStripe,
  CardForm
} from "@stripe/stripe-react-native"
import { createCard, deleteCard } from "../../services/Payment"

const { width, height } = Dimensions.get("window")
const popoverWidth = width * 0.6
const popoverYPos = height * 0.08

const AddNewCardScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const [showPopover, setShowPopover] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [name, setName] = useState("")
  const [cardNo, setCardNo] = useState("****************")
  const [expDate, setDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [brand, setBrand] = useState("")
  const [screenTitle, setScreenTitle] = useState("Add New Card")

  const [card, setCard] = useState(CardFieldInput.Details | null)
  const { confirmPayment, handleCardAction } = useStripe()

  // viewType: add, view, edit
  const { viewType, cardDetails } = route?.params

  useEffect(() => {
    if (viewType == "view") {
      setName(cardDetails?.name)
      // setCardNo("3827 **** **** 9876")
      // setDate("02/30")
      // setCvv("123")
      setScreenTitle("Card Details")
    }
  }, [])

  const renderItem = (icon, placeholder, stateFunc, state) => {
    return (
      <View style={[styles.itemContainer]}>
        <View
          style={[
            styles.center,
            {
              marginHorizontal: "3%",
              flexDirection: "row",
              width: "95%"
            }
          ]}
        >
          <View style={styles.cardImage}>
            <Image
              resizeMode="center"
              style={styles.itemIcon}
              source={icon}
            ></Image>
          </View>
          <View style={[styles.flex1, { width: "100%" }]}>
            <TextInput
              style={[styles.FONT_16, styles.inputStyle]}
              placeholder={placeholder}
              placeholderTextColor={Colors.NETURAL_2}
              onChangeText={newText => stateFunc(newText)}
              defaultValue={state}
            />
          </View>
        </View>
      </View>
    )
  }

  const renderPopoverItem = (title, icon, action) => {
    return (
      <View
        style={{
          flexDirection: "row",
          width: "100%"
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            action()
          }}
        >
          <View
            style={{
              backgroundColor: Colors.NETURAL_5,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Text
              style={[
                styles.FONT_16_2,
                { marginHorizontal: "10%", marginVertical: "5%" }
              ]}
            >
              {title}
            </Text>
            <Image
              style={{
                width: "10%",
                height: undefined,
                aspectRatio: 1,
                marginRight: "5%"
              }}
              source={icon}
            ></Image>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      <NavigationHeader
        showLeftBtn1={viewType == "view" ? true : false}
        onLeftBtn1={() => {
          setShowPopover(true)
        }}
        iconRight1={DotsIcon}
      ></NavigationHeader>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: Colors.WHITE }]}>
          {screenTitle}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.flex1} style={styles.flex1}>
        <BigCardDesign
          cardDetails={cardDetails}
          cardNumber={cardNo}
          icon={null}
          name={name}
          date={expDate}
        ></BigCardDesign>
        {viewType != "view" && (
          <>
            <View style={{ flex: 1, alignItems: "center" }}>
              {renderItem(ImgUserIcon, "Full Name", setName, name)}
              {/* {renderItem(ImgCardIcon, "Card No", setCardNo, cardNo)}
              {renderItem(ImgCalendar, "Expiry Date", setDate, date)}
              {renderItem(ImgLock, "CVV", setCvv, cvv)} */}
              <CardField
              dangerouslyGetFullCardDetails={true}
                postalCodeEnabled={false}
                cardStyle={{
                  backgroundColor: Colors.NETURAL_5,
                  textColor: Colors.WHITE
                }}
                style={[styles.itemContainer]}
                onCardChange={cardDetails => {
                  setCard(cardDetails)
                  setBrand(cardDetails.brand)
                  setCardNo(
                    new Array(16 - cardDetails.last4.length)
                      .fill("*")
                      .join("") + cardDetails.last4
                  )
                  setDate(
                    cardDetails.expiryMonth + "/" + cardDetails.expiryYear
                  )
                }}
                onFocus={focusedField => {
                  console.log("focusField", focusedField)
                }}
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
                onPress={async () => {
                  try {
                    const token = await createToken({ type: "Card", ...card })
                    const result = await createCard({ token: token.token.id })
                    navigation.goBack()
                  } catch (e) {}
                }}
              >
                {"ADD CARD"}
              </Button>
            </View>
          </>
        )}

        <Popover
          from={new Rect(width - 150, popoverYPos, 0, 0)}
          isVisible={showPopover}
          onRequestClose={() => setShowPopover(false)}
          arrowSize={{ height: 0, width: 0 }}
          arrowShift={1}
        >
          <View style={{ width: popoverWidth }}>
            {renderPopoverItem("Edit Card", EditIcon, () => {
              console.log("clicked")
            })}
            <View
              style={{ backgroundColor: Colors.WHITE_OPACITY_50, height: 1 }}
            ></View>
            {renderPopoverItem("Delete Card", DeleteIcon, () => {
              setShowPopover(false)
              setTimeout(() => {
                setShowDeleteModal(true)
              }, 1000)
            })}
          </View>
        </Popover>
        <DeleteModal
          isVisible={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
          }}
          onYes={async () => {
            setShowDeleteModal(false)
            await deleteCard({ card_id: cardDetails?.id })
            navigation.goBack()
          }}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default AddNewCardScreen

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
  itemIcon: {
    width: undefined,
    height: "80%",
    aspectRatio: 1
  },
  cardImage: {
    justifyContent: "center",
    marginRight: "2%"
  },
  nextBtnContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "5%"
  },
  Font_13: {
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
    aspectRatio: 4.64
  },
  itemContainer: {
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
    backgroundColor: Colors.NETURAL_5,
    aspectRatio: 6.84,
    borderRadius: 6,
    marginBottom: "5%",
    justifyContent: "center"
  },
  inputStyle: {
    color: Colors.WHITE,
    textAlignVertical: "top",
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0
  },
  FONT_24: {
    fontSize: Typography.FONT_SIZE_24,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    lineHeight: Typography.LINE_HEIGHT_32,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    marginTop: "4%"
  },
  FONT_16: {
    fontSize: Typography.FONT_SIZE_16,
    fontWeight: Typography.FONT_WEIGHT_400,
    lineHeight: Typography.LINE_HEIGHT_20,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    marginTop: "4%"
  },
  FONT_16_2: {
    fontSize: Typography.FONT_SIZE_16,
    fontWeight: Typography.FONT_WEIGHT_500,
    lineHeight: Typography.LINE_HEIGHT_24,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    color: Colors.WHITE
  },
  FONT_12: {
    fontSize: Typography.FONT_SIZE_12,
    fontWeight: Typography.FONT_WEIGHT_400,
    lineHeight: Typography.LINE_HEIGHT_16,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    marginTop: "4%"
  }
})
