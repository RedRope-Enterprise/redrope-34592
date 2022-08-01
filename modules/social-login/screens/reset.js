import React, { useState } from "react"
import {
  Image,
  Alert,
  View,
  TouchableOpacity,
  TextInput,
  Text,
  Dimensions
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { useSelector, useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import { styles, textInputStyles } from "./styles"
import { validateEmail, LOGO_URL } from "./constants"
import { resetPassword } from "../auth"
import NavigationHeader from "./../../../components/NavigationHeader"
import { Colors, Typography } from "../../../styles"
import { Input, Button } from "../../../components"

const { width, height } = Dimensions.get("window")

const PasswordRecover = ({ navigation }) => {
  const [email, setEmail] = useState("")
  // const { api } = useSelector(state => state.login)
  const dispatch = useDispatch()

  const handlePasswordReset = () => {
    if (!validateEmail.test(email))
      return Alert.alert("Error", "Please enter a valid email address.")

    dispatch(resetPassword({ email }))
      .then(unwrapResult)
      .then(() => {
        Alert.alert(
          "Password Reset",
          "Password reset link has been sent to your email address"
        )
        navigation.goBack()
      })
      .catch(err => console.log(err.message))
  }

  const renderImage = () => {
    const imageSize = {
      width: 365,
      height: 161
    }
    return (
      <Image
        style={[styles.image, imageSize]}
        source={{
          uri: LOGO_URL
        }}
      />
    )
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.NETURAL_3,
        alignItems: "center"
      }}
    >
      <NavigationHeader></NavigationHeader>
      <Text
        style={{
          fontSize: Typography.FONT_SIZE_34,
          color: Colors.WHITE,
          marginTop: "25%",
          marginBottom: "20%",
          fontWeight: Typography.FONT_WEIGHT_BOLD
        }}
      >
        Forget Password
      </Text>

      <Input
        width={"90%"}
        onChangeText={value => setEmail(value)}
        value={email}
        placeholder="Enter mail address"
        iconLeft={
          <Image
            style={{ width: 24, height: 24, margin: 10 }}
            source={require("../../../assets/images/login_signup/email.png")}
          />
        }
        iconHighlighted={
          <Image
            style={{ width: 24, height: 24, margin: 10 }}
            source={require("../../../assets/images/login_signup/email_active.png")}
          />
        }
      />

      <Text
        style={{
          marginTop: "20%",
          marginHorizontal: "20%",
          fontSize: Typography.FONT_SIZE_14,
          color: Colors.WHITE,
          fontWeight: Typography.FONT_WEIGHT_400,
          fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
          textAlign: "center",
        }}
      >
        {"We will send a verification code to your email"}
      </Text>

      <View
        style={{
          alignItems: "center",
          flex: 1,
          justifyContent: "flex-end",
          marginBottom: "10%"
        }}
      >
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
          // loading={props.loading}
          onPress={handlePasswordReset}
        >
          SEND
        </Button>
      </View>
    </View>
  )
}

export default PasswordRecover
