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
  ScrollView
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, Input, CustomModal } from "../../components"
import { Colors, Typography, Mixins } from "../../styles"
import NavigationHeader from "../../components/NavigationHeader"
import { useNavigation } from "@react-navigation/native"
import {
  getDataStorage,
  setDataStorage,
  clearStorage
} from "../../utils/storage"
import { deleteAccount } from "../../services/user"

import { useSelector, useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
const { width, height } = Dimensions.get("window")

const SettingsScreen = () => {
  const navigation = useNavigation()
  const [user, setUser] = useState(global.user)
  const [deleteLoading, setDeleteLoading] = useState(false)

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setUser(global.user)
      // The screen is focused
      // Call any action
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [navigation])

  const settingsMenu = [
    {
      key: 0,
      text: "Profile Settings",
      onPress: () =>
        user?.event_planner
          ? navigation.navigate("PlannerProfileEdit")
          : navigation.navigate("Profile")
    },
    {
      key: 1,
      text: user?.event_planner ? "Wallet" : "Payment Settings",
      onPress: () =>
        user?.event_planner
          ? navigation.navigate("EventPlannerWallet")
          : navigation.navigate("CardsScreen")
    },
    { key: 2, text: "FAQ", onPress: () => navigation.navigate("FAQ") },
    {
      key: 1,
      text: "Feedback & Support",
      onPress: () => navigation.navigate("FeedbackSupport")
    },
    {
      key: 1,
      text: "Terms and Conditions",
      onPress: () =>
        navigation.navigate("CustomWebView", {
          url: "https://app.termly.io/document/terms-of-use-for-ecommerce/21ad8bdf-5126-4329-8d36-79003b7d996a"
        })
    },
    {
      key: 1,
      text: "Privacy Policy",
      onPress: () =>
        navigation.navigate("CustomWebView", {
          url: "https://app.termly.io/document/privacy-policy/ffe5e1d0-ab91-4d33-956c-57bdbdd99d59"
        })
    },
    { key: 1, text: "About us", onPress: () => navigation.navigate("AboutUs") }
  ]

  return (
    <SafeAreaView style={[styles.flex1, { backgroundColor: Colors.NETURAL_3 }]}>
      {/* <NavigationHeader></NavigationHeader> */}
      <ScrollView>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: "5%"
          }}
        >
          <View style={styles.userImageContainer}>
            <Image
              style={styles.userImage}
              source={{ uri: user?.profile_picture }}
            />
          </View>
          <Text style={styles.nameText}>
            {user?.event_planner ? user?.business_name : user?.name}
          </Text>
        </View>

        {settingsMenu.map(menuItem => {
          return (
            <TouchableOpacity
              style={styles.menuItem}
              key={menuItem.key}
              onPress={menuItem.onPress}
            >
              <Text style={styles.menuItemText}>{menuItem.text}</Text>
              <Text style={styles.menuItemTextArrow}>{">"}</Text>
            </TouchableOpacity>
          )
        })}

        <View style={{ alignSelf: "center", marginTop: "5%" }}>
          <Button
            btnWidth={width * 0.8}
            backgroundColor={Colors.BUTTON_RED}
            viewStyle={{
              borderColor: Colors.facebook,
              marginBottom: 2,
              alignSelf: "center"
            }}
            height={35}
            textFontWeight={Typography.FONT_WEIGHT_600}
            textStyle={{
              color: Colors.white,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontSize: Typography.FONT_SIZE_14
            }}
            // loading={props.loading}
            onPress={async () => {
              await clearStorage()
              navigation.replace("login")
            }}
          >
            LOGOUT
          </Button>
        </View>

        <View style={{ alignSelf: "center", marginTop: "5%" }}>
          <Button
            btnWidth={width * 0.8}
            backgroundColor={Colors.NETURAL_3}
            borderColor={Colors.BUTTON_RED}
            borderType={"outlined"}
            textColor={Colors.BUTTON_RED}
            viewStyle={{
              borderColor: Colors.BUTTON_RED,
              marginBottom: 2,
              alignSelf: "center"
            }}
            loading={deleteLoading}
            height={35}
            textFontWeight={Typography.FONT_WEIGHT_600}
            textStyle={{
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontSize: Typography.FONT_SIZE_14
            }}
            onPress={async () => {
              try {
                setDeleteLoading(true)
                const resp = await deleteAccount()
                setDeleteLoading(false)
                if (resp.success) {
                  await clearStorage()
                  navigation.replace("login")
                }

                console.log("delete account resp ", resp)
              } catch (error) {
                setDeleteLoading(false)
              }
            }}
          >
            DELETE ACCOUNT
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SettingsScreen

let styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  flex1: {
    flex: 1
  },
  userImageContainer: {
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
  menuItem: {
    flexDirection: "row",
    backgroundColor: Colors.NETURAL_4,
    marginVertical: "2%",
    marginHorizontal: "5%",
    borderRadius: 10,
    alignItems: "center"
  },
  menuItemText: {
    fontSize: Typography.FONT_SIZE_16,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    fontWeight: Typography.FONT_WEIGHT_400,
    color: Colors.WHITE,
    marginVertical: "4%",
    marginHorizontal: "5%",
    flex: 1
  },
  menuItemTextArrow: {
    fontSize: Typography.FONT_SIZE_24,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    fontWeight: Typography.FONT_WEIGHT_400,
    color: Colors.NETURAL_2,
    textAlignVertical: "center",
    alignSelf: "center",
    marginRight: "5%"
  }
})
