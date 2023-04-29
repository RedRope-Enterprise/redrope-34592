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
import ImgLocation from "../../assets/images/location.png"
import ImgDollar from "../../assets/images/Dollar.png"

import ImgArrow from "../../assets/images/arrow.png"

import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, Input, CustomModal } from "../../components"
import { Colors, Typography, Mixins } from "../../styles"
import NavigationHeader from "../../components/NavigationHeader"
import { useNavigation } from "@react-navigation/native"
import ImagePicker from "react-native-image-crop-picker"
import { getUser, updateUser } from "../../services/user"
import {
  getDataStorage,
  setDataStorage,
  clearStorage
} from "../../utils/storage"

import { useSelector, useDispatch, connect } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
const { width, height } = Dimensions.get("window")
import { useRoute } from "@react-navigation/native"
import { TabView, SceneMap, TabBar } from "react-native-tab-view"

import { createToken } from "@stripe/stripe-react-native"
import { addBankAccount, getBankAccount } from "../../services/Payment"
import {
  getUserAccountBalance,
  withdrawToBank,
  getWalletHistory
} from "../../services/user"

const EventPlannerWallet = () => {
  const navigation = useNavigation()
  const route = useRoute()

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      // The screen is focused
      // Call any action
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [navigation])

  useEffect(() => {}, [])

  const [index, setIndex] = React.useState(0)

  const [bankAccountData, setBankAccountData] = useState()
  const [userBalance, setUserBalance] = useState()
  const [recipits, setRecipits] = useState([])

  useEffect(() => {
    getUserBankAccount()
    getBalance()
    getRecipts()
  }, [])

  const getUserBankAccount = async () => {
    const resp = await getBankAccount()
    if (
      resp.bank_accounts &&
      resp.bank_accounts.data &&
      resp.bank_accounts.data.length > 0
    ) {
      setBankAccountData(resp.bank_accounts.data[0])
    }
  }

  const getBalance = async () => {
    const resp = await getUserAccountBalance()
    setUserBalance(resp?.balance?.available[0])
  }

  const getRecipts = async () => {
    const resp = await getWalletHistory()
    setRecipits(resp)
  }

  const [routes] = React.useState([
    { key: "first", title: "Overview" },
    { key: "second", title: "Withdrawal History" }
  ])

  const FirstRoute = () => {
    const renderGenericItem = (
      title,
      img,
      bottleService,
      isLocation = false,
      onPress = null
    ) => {
      return (
        <View style={[styles.shortFieldContainer, { aspectRatio: 5.02 }]}>
          <TouchableOpacity
            onPress={() => {
              if (onPress) {
                onPress()
                return
              }

              if (!isLocation) {
                navigation.navigate("AddNewBottleScreen", {
                  onSubmit: addNewBottleServices,
                  onUpdate: updateBottleService,
                  bottleService: bottleService
                })
                return
              }
              navigation.navigate("AddNewLocationScreen", {
                isPrimaryLocation: true
              })
            }}
          >
            <View style={styles.genericItemContainer}>
              <Image
                style={{ width: "8%", height: undefined, aspectRatio: 1 }}
                source={img}
              ></Image>
              <Text
                style={[
                  styles.FONT_16,
                  styles.flex1,
                  { color: Colors.WHITE, marginHorizontal: "6%", flex: 1 }
                ]}
              >
                {title}
              </Text>
              <Image
                resizeMode="contain"
                style={styles.imgArrow}
                source={ImgArrow}
              ></Image>
            </View>
          </TouchableOpacity>
        </View>
      )
    }

    return (
      <View style={{ flex: 1, alignItems: "center", marginTop: "5%" }}>
        <View style={{ marginVertical: "3%" }}>
          <Text
            style={{
              fontSize: Typography.FONT_SIZE_14,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontWeight: Typography.FONT_WEIGHT_BOLD,
              color: Colors.PRIMARY_1
            }}
          >
            Total Balance
          </Text>
        </View>

        <View>
          <Text
            style={{
              fontSize: Typography.FONT_SIZE_40,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontWeight: Typography.FONT_WEIGHT_BOLD,
              color: Colors.PRIMARY_1
            }}
          >{`$${userBalance?.amount | ""}`}</Text>
        </View>

        <View style={{ alignItems: "center", marginVertical: "5%" }}>
          <Button
            disabled={userBalance?.amount === 0}
            btnWidth={width * 0.9}
            backgroundColor={Colors.BUTTON_RED}
            viewStyle={{
              borderColor: Colors.facebook,
              marginBottom: 2
            }}
            height={35}
            textFontWeight={Typography.FONT_WEIGHT_600}
            textStyle={{
              color: Colors.WHITE,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontSize: Typography.FONT_SIZE_14
            }}
            // loading={props.loading}
            onPress={async () => {
              const resp = await withdrawToBank({ amount: userBalance?.amount })
              await getBalance()
            }}
          >
            WITHDRAW
          </Button>
        </View>

        <View style={{ marginVertical: "2%" }}>
          <Text
            style={{
              color: Colors.PRIMARY_1,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontSize: Typography.FONT_SIZE_14,
              fontWeight: Typography.FONT_WEIGHT_600,
              marginVertical: "2%"
            }}
          >
            {"Bank Account"}
          </Text>
          {renderGenericItem(
            bankAccountData
              ? `${bankAccountData.bank_name} - ${bankAccountData.account_holder_name}`
              : "Connect Your Bank Account",
            ImgDollar,
            null,
            false,
            () => {
              navigation.navigate("ConnectBankAccount")
            }
          )}
        </View>
      </View>
    )
  }
  const SecondRoute = () => {
    const orders = [
      { date: "May 3, 2023", reciept_number: "5476633", amount: 100 },
      { date: "May 4, 2023", reciept_number: "5476633", amount: 200 },
      { date: "May 4, 2023", reciept_number: "5476633", amount: 200 },
      { date: "May 4, 2023", reciept_number: "5476633", amount: 200 },
      { date: "May 4, 2023", reciept_number: "5476633", amount: 200 },
      { date: "May 4, 2023", reciept_number: "5476633", amount: 200 },
      { date: "May 4, 2023", reciept_number: "5476633", amount: 200 },
      { date: "May 4, 2023", reciept_number: "5476633", amount: 200 },
      { date: "May 4, 2023", reciept_number: "5476633", amount: 200 },
      { date: "May 4, 2023", reciept_number: "5476633", amount: 200 }
    ]
    return (
      <View style={{ flex: 1, marginTop: "5%" }}>
        <FlatList
          contentContainerStyle={{ marginHorizontal: "5%" }}
          numColumns={1}
          data={recipits}
          extraData={recipits}
          renderItem={({ item }) => {
            return (
              <View>
                <Text
                  style={{
                    color: Colors.NETURAL_2,
                    fontSize: Typography.FONT_SIZE_12,
                    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                    fontWeight: Typography.FONT_WEIGHT_400,
                    marginVertical: "3%"
                  }}
                >
                  {item.date}
                </Text>
                <View style={{ flexDirection: "row", marginVertical: "3%" }}>
                  <Text
                    style={{
                      flex: 1,
                      color: Colors.NETURAL_2,
                      fontSize: Typography.FONT_SIZE_14,
                      fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                      fontWeight: Typography.FONT_WEIGHT_BOLD
                    }}
                  >{`Receipt #: ${item.reciept_number}`}</Text>
                  <Text
                    style={{
                      color: Colors.NETURAL_2,
                      fontSize: Typography.FONT_SIZE_14,
                      fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                      fontWeight: Typography.FONT_WEIGHT_400
                    }}
                  >{`$${item.amount}`}</Text>
                </View>
                <View
                  style={{
                    alignSelf: "center",
                    flex: 1,
                    marginVertical: "3%",
                    width: "100%",
                    borderBottomColor: Colors.WHITE,
                    borderBottomWidth: 1,
                    opacity: 0.5
                  }}
                />
              </View>
            )
          }}
          keyExtractor={(item, index) => index}
        />
      </View>
    )
  }

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute
  })

  _renderTabBar = props => {
    console.log("props: " + JSON.stringify(props))
    return (
      <TabBar
        {...props}
        inactiveColor={Colors.text}
        activeColor={Colors.PRIMARY_2}
        indicatorStyle={{
          backgroundColor:
            props.navigationState.index === index
              ? Colors.PRIMARY_2
              : Colors.NETURAL_1,
          width: width * 0.5,
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      <StatusBar
        animated={true}
        backgroundColor={Colors.NETURAL_3}
        barStyle={"light-content"}
        hidden={false}
      />

      <NavigationHeader />

      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: Colors.WHITE }]}>Wallet</Text>
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

export default EventPlannerWallet

let styles = StyleSheet.create({
  titleContainer: {
    justifyContent: "center",
    alignContent: "center",
    height: undefined,
    width: "100%",
    aspectRatio: 4.64
  },
  title: {
    fontSize: Typography.FONT_SIZE_24,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    lineHeight: Typography.LINE_HEIGHT_36,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    marginLeft: "5%",
    marginTop: "4%"
  },
  shortFieldContainer: {
    width: "90%",
    height: undefined,
    aspectRatio: 6.84,
    borderRadius: 12,
    backgroundColor: Colors.NETURAL_4,
    justifyContent: "center"
  },
  genericItemContainer: {
    marginHorizontal: "6%",
    flexDirection: "row",
    alignItems: "center"
  },
  imgArrow: {
    width: "6%",
    height: undefined,
    aspectRatio: 1,
    transform: [{ rotate: "270deg" }]
  },
  FONT_16: {
    fontSize: Typography.FONT_SIZE_16,
    fontWeight: Typography.FONT_WEIGHT_400,
    lineHeight: Typography.LINE_HEIGHT_20,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
  }
})
