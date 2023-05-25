import React, { useState, useContext } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  View,
  ScrollView,
  Alert,
  StyleSheet,
  Platform
} from "react-native"
import { unwrapResult } from "@reduxjs/toolkit"
import { LoginManager, AccessToken } from "react-native-fbsdk"
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from "../auth/utils"
import { appleForAndroid, appleForiOS } from "../auth/apple"

import { useNavigation } from "@react-navigation/native"
import { Colors, Typography } from "../../../styles"
import { Input, Button } from "../../../components"
import {
  loginRequest,
  signupRequest,
  facebookLogin,
  googleLogin,
  appleLogin
} from "../auth"
import {
  GoogleSigninButton,
  GoogleSignin,
  statusCodes
} from "@react-native-google-signin/google-signin"
const { width, height } = Dimensions.get("window")
import { setDataStorage } from "../../../utils/storage"
import { mapErrorMessage } from "../auth/utils"
import { getUser } from "../../../services/user"

const LoginScreen = ({}) => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [validationError, setValidationError] = useState({
    email: "",
    password: ""
  })

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onLoginPressed = () => {
    dispatch(loginRequest({ email, password }))
      .then(unwrapResult)
      .then(async res => {
        await setDataStorage("@key", res?.token)
        await setDataStorage("@user", res?.user)

        global.user = res?.user
        if (global.user.event_planner) {
          navigation.replace("EventPlannerDashboard")
        } else navigation.replace("Dashboard")
        // Alert.alert("", "Login success!")
      })
      .catch(err => {
        let error = mapErrorMessage(err)
        if (error.code == "403") {
          Alert.alert("INFO", "Email already in use!")
        } else {
          Alert.alert("INFO", error.message)
        }
      })
  }

  const onFacebookConnect = async dispatch => {
    try {
      const fb_result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email"
      ])
      if (!fb_result.isCancelled) {
        const data = await AccessToken.getCurrentAccessToken()
        dispatch(
          facebookLogin({
            access_token: data.accessToken
          })
        )
          .then(unwrapResult)
          .then(async res => {
            await setDataStorage("@key", res?.token)
            await setDataStorage("@user", res?.user)

            global.user = res?.user
            if (global.user.event_planner) {
              navigation.replace("EventPlannerDashboard")
            } else navigation.replace("Dashboard")
          })
      }
    } catch (err) {
      console.log("Facebook Login Failed: ", JSON.stringify(err))
    }
  }

  const onGoogleConnect = async dispatch => {
    GoogleSignin.configure({
      webClientId: GOOGLE_WEB_CLIENT_ID, // client ID of type WEB for your server
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceCodeForRefreshToken: false,
      iosClientId: GOOGLE_IOS_CLIENT_ID
    })
    try {
      await GoogleSignin.hasPlayServices()
      await GoogleSignin.signIn()
      const tokens = await GoogleSignin.getTokens()
      dispatch(
        googleLogin({
          access_token: tokens.accessToken
        })
      )
        .then(unwrapResult)
        .then(async res => {
          await setDataStorage("@key", res?.token)
          await setDataStorage("@user", res?.user)

          global.user = res?.user
          if (global.user.event_planner) {
            navigation.replace("EventPlannerDashboard")
          } else navigation.replace("Dashboard")
        })
    } catch (err) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Error", "The user canceled the signin request.")
      }
    }
  }

  const onAppleConnect = async dispatch => {
    try {
      const signinFunction = Platform.select({
        ios: appleForiOS,
        android: appleForAndroid
      })
      const result = await signinFunction()
      console.log("result ", result)
      dispatch(
        appleLogin({
          id_token: result.id_token,
          access_token: result.code
        })
      )
        .then(unwrapResult)
        .then(async res => {
          await setDataStorage("@key", res?.token)
          await setDataStorage("@user", res?.user)

          global.user = res?.user
          if (global.user.event_planner) {
            navigation.replace("EventPlannerDashboard")
          } else navigation.replace("Dashboard")
        })
    } catch (err) {
      console.log(JSON.stringify(err))
    }
  }

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: Colors.NETURAL_3,
        alignItems: "center"
      }}
      behavior={Platform.OS === "ios" ? "padding" : null}
    >
      <Text
        style={{
          fontSize: Typography.FONT_SIZE_34,
          color: Colors.WHITE,
          marginTop: "25%",
          marginBottom: "20%",
          fontWeight: Typography.FONT_WEIGHT_BOLD
        }}
      >
        Sign In
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
        error={validationError.email}
      />

      <Input
        width={"90%"}
        onChangeText={value => setPassword(value)}
        value={password}
        secureTextEntry={true}
        placeholder="Enter password"
        iconLeft={
          <Image
            style={{ width: 24, height: 24, margin: 10 }}
            source={require("../../../assets/images/login_signup/lock.png")}
          />
        }
        iconHighlighted={
          <Image
            style={{ width: 24, height: 24, margin: 10 }}
            source={require("../../../assets/images/login_signup/lock_active.png")}
          />
        }
        error={validationError.password}
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("ResetPasswordScreen")}
        style={{
          alignItems: "flex-end",
          alignSelf: "flex-end",
          marginHorizontal: "5%"
        }}
      >
        <Text
          style={{
            fontSize: Typography.FONT_SIZE_14,
            fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
            color: Colors.NETURAL_2
          }}
        >
          Forget Password?
        </Text>
      </TouchableOpacity>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: "10%" }}
      >
        <View
          style={{
            borderBottomColor: Colors.NETURAL_2,
            borderBottomWidth: 1,
            flex: 1,
            marginHorizontal: "7%"
          }}
        />
        <Text
          style={{
            fontSize: Typography.FONT_SIZE_14,
            color: Colors.GREY,
            fontFamily: Typography.FONT_FAMILY_POPPINS_LIGHT,
            fontWeight: Typography.FONT_WEIGHT_400
          }}
        >
          Or
        </Text>
        <View
          style={{
            borderBottomColor: Colors.NETURAL_2,
            borderBottomWidth: 1,
            flex: 1,
            marginHorizontal: "7%"
          }}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          marginVertical: "10%",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <TouchableOpacity onPress={() => onGoogleConnect(dispatch)}>
          <Image
            style={{
              resizeMode: "contain",
              width: 50,
              height: 50,
              marginHorizontal: 15
            }}
            source={require("../../../assets/images/login_signup/Google.png")}
          />
        </TouchableOpacity>

        {Platform.OS !== "android" && (
          <TouchableOpacity onPress={() => onAppleConnect(dispatch)}>
            <Image
              style={{
                resizeMode: "contain",
                width: 50,
                height: 50,
                marginHorizontal: 15
              }}
              source={require("../../../assets/images/login_signup/Apple.png")}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => onFacebookConnect(dispatch)}>
          <Image
            style={{
              resizeMode: "contain",
              width: 50,
              height: 50,
              marginHorizontal: 15
            }}
            source={require("../../../assets/images/login_signup/Facebook.png")}
          />
        </TouchableOpacity>
      </View>

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
          onPress={() => onLoginPressed()}
          // onPress={async() => {
          //   navigation.navigate("Dashboard")
          // }}
        >
          SIGN IN
        </Button>

        <View style={{ flexDirection: "row", marginTop: "10%" }}>
          <Text
            style={{
              color: Colors.WHITE,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontSize: Typography.FONT_SIZE_14,
              fontWeight: Typography.FONT_WEIGHT_400
            }}
          >
            Don't you have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.replace("login")}>
            <Text
              style={{
                color: Colors.PRIMARY_1,
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                fontSize: Typography.FONT_SIZE_14,
                fontWeight: Typography.FONT_WEIGHT_400
              }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
export default LoginScreen
