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
  StyleSheet
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

import { useSelector, useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
const { width, height } = Dimensions.get("window")
import { useRoute } from "@react-navigation/native"

const ConnectBankAccount = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const [bankName, setBankName] = useState()
  const [accountName, setAccountName] = useState()
  const [accountNumber, setAccountNumber] = useState()
  const [rountingNumber, setRountingNumber] = useState()
  const [iban, setIban] = useState()
  const [swift, setSwift] = useState()

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      // The screen is focused
      // Call any action
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [navigation])

  useEffect(() => {
    setInitialValues()
  }, [])

  setInitialValues = async () => {}

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
        <Text style={[styles.title, { color: Colors.WHITE }]}>
          Connect Bank Account
        </Text>
      </View>

      <KeyboardAwareScrollView
        style={{
          marginBottom: "10%"
        }}
        contentContainerStyle={{
          alignItems: "center"
        }}
      >
        <Input
          width={"90%"}
          onChangeText={value => setBankName(value)}
          value={bankName}
          placeholder={"Bank Name"}
          selectedBorderColor={Colors.PRIMARY_1}
          height={Mixins.scaleHeight(40)}
        />

        <Input
          width={"90%"}
          onChangeText={value => setAccountName(value)}
          value={accountName}
          placeholder={"Account Name"}
          selectedBorderColor={Colors.PRIMARY_1}
          height={Mixins.scaleHeight(40)}
        />

        <Input
          width={"90%"}
          onChangeText={value => setAccountNumber(value)}
          value={accountNumber}
          placeholder={"Account Number"}
          selectedBorderColor={Colors.PRIMARY_1}
          height={Mixins.scaleHeight(40)}
          keyboardType={"numeric"}
        />

        <Input
          width={"90%"}
          onChangeText={value => setRountingNumber(value)}
          value={rountingNumber}
          placeholder={"Rounting Number"}
          selectedBorderColor={Colors.PRIMARY_1}
          height={Mixins.scaleHeight(40)}
          keyboardType={"numeric"}
        />

        <Input
          width={"90%"}
          onChangeText={value => setIban(value)}
          value={iban}
          placeholder={"IBAN"}
          height={Mixins.scaleHeight(40)}
          selectedBorderColor={Colors.PRIMARY_1}
        />

        <Input
          width={"90%"}
          onChangeText={value => setSwift(value)}
          value={swift}
          placeholder={"SWIFT"}
          height={Mixins.scaleHeight(40)}
          selectedBorderColor={Colors.PRIMARY_1}
        />
      </KeyboardAwareScrollView>
      <View style={{ alignItems: "center", marginBottom: "5%" }}>
        <Button
          disabled={
            !swift ||
            !iban ||
            !accountName ||
            !accountNumber ||
            !bankName ||
            !rountingNumber
          }
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
          // loading={props.loading}
          onPress={() => {}}
        >
          SAVE
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default ConnectBankAccount

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
  }
})
