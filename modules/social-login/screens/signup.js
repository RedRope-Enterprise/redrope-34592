import React, { useState, useContext } from "react"
import { useSelector, useDispatch } from "react-redux"
import { HOME_SCREEN_NAME, validateEmail } from "./constants"

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
  useWindowDimensions,
  Platform
} from "react-native"
import { unwrapResult } from "@reduxjs/toolkit"
import { useNavigation } from "@react-navigation/native"
import { Colors, Typography } from "../../../styles"
import { Input, Button } from "../../../components"
import { TabView, SceneMap, TabBar } from "react-native-tab-view"
import { LoginManager, AccessToken } from "react-native-fbsdk"
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from "../auth/utils"
import { appleForAndroid, appleForiOS } from "../auth/apple"
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
import { setDataStorage } from "../../../utils/storage"
import CheckBox from "@react-native-community/checkbox"

const { width, height } = Dimensions.get("window")
import { mapErrorMessage } from "../auth/utils"

const SignupScreen = ({}) => {
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [validationError, setValidationError] = useState({
    email: "",
    password: "",
    username: ""
  })

  const state = useSelector(state => state)
  console.log("state", state)
  const layout = useWindowDimensions()

  const onSignupPress = async payload => {
    dispatch(signupRequest(payload))
      .then(unwrapResult)
      .then(res => {
        console.log("signup data ", res)

        if (res.error) {
          Alert.alert("INFO", res.error)
          return
        }
        setDataStorage("@key", res?.token)
        setDataStorage("@user", res)

        global.user = res
        if (res.event_planner) {
          navigation.navigate("PlannerProfileEdit")
        } else {
          navigation.navigate("Profile", {
            initialSetup : true
          })
        }
      })
      .catch(err => {
        let error = mapErrorMessage(err)
        if (error.code == "400") {
          Alert.alert("INFO", "Email already in use!")
        } else {
          Alert.alert("INFO", error.message)
        }
      })
  }

  const onFacebookConnect = async (dispatch, event_planner) => {
    try {
      const fb_result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email"
      ])
      if (!fb_result.isCancelled) {
        const data = await AccessToken.getCurrentAccessToken()
        dispatch(facebookLogin({ access_token: data.accessToken, event_planner: event_planner  }))
          .then(unwrapResult)
          .then(res => {
            if (res.key) navigation.navigate(HOME_SCREEN_NAME)
          })
      }
    } catch (err) {
      console.log("Facebook Login Failed: ", JSON.stringify(err))
    }
  }

  const onGoogleConnect = async (dispatch, event_planner) => {
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
      dispatch(googleLogin({ access_token: tokens.accessToken, event_planner: event_planner }))
        .then(unwrapResult)
        .then(res => {
          if (res.key) navigation.navigate(HOME_SCREEN_NAME)
        })
    } catch (err) {
      if (err.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert("Error", "The user canceled the signin request.")
      }
    }
  }

  const onAppleConnect = async (dispatch, event_planner) => {
    try {
      const signinFunction = Platform.select({
        ios: appleForiOS,
        android: appleForAndroid
      })
      const result = await signinFunction()
      console.log("result ", result)
      dispatch(
        appleLogin({ id_token: result.id_token, access_token: result.code, event_planner: event_planner  })
      )
        .then(unwrapResult)
        .then(res => {
          if (res.key) navigation.navigate(HOME_SCREEN_NAME)
        })
    } catch (err) {
      console.log(JSON.stringify(err))
    }
  }

  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: "first", title: "User" },
    { key: "second", title: "Event Planner" }
  ])

  const FirstRoute = () => {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [repassword, setRepassword] = useState("")
    const [termsAndConditionsCheckBox, setTermsAndConditionsCheckBox] =
      useState(false)

    const [validationError, setValidationError] = useState({
      email: "",
      password: ""
    })

    return (
      <ScrollView>
        <KeyboardAvoidingView
          style={{
            flex: 1,
            marginTop: "5%",
            backgroundColor: Colors.NETURAL_3,
            alignItems: "center"
          }}
          behavior={Platform.OS === "ios" ? "padding" : null}
        >
          <Input
            keyboardType={"default"}
            width={"90%"}
            onChangeText={value => setName(value)}
            value={name}
            placeholder="Enter your name"
            iconLeft={
              <Image
                style={{ width: 24, height: 24, margin: 10 }}
                source={require("../../../assets/images/login_signup/person.png")}
              />
            }
            iconHighlighted={
              <Image
                style={{ width: 24, height: 24, margin: 10 }}
                source={require("../../../assets/images/login_signup/person_active.png")}
              />
            }
          />

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

          <Input
            width={"90%"}
            onChangeText={value => setRepassword(value)}
            value={repassword}
            secureTextEntry={true}
            placeholder="Re-enter password"
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

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: "10%"
            }}
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
            <TouchableOpacity onPress={() => onGoogleConnect(dispatch, false)}>
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
              <TouchableOpacity onPress={() => onAppleConnect(dispatch, false)}>
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

            <TouchableOpacity onPress={() => onFacebookConnect(dispatch, false)}>
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
            style={{ flexDirection: "row", margin: "5%", alignItems: "center" }}
          >
            <CheckBox
              onCheckColor={"#fff"}
              onTintColor={Colors.PRIMARY_1}
              boxType={"square"}
              onFillColor={Colors.PRIMARY_1}
              style={{marginRight: width *0.04,width: 20, height: 20, color: "#fff" }}
              disabled={false}
              value={termsAndConditionsCheckBox}
              onValueChange={newValue =>
                setTermsAndConditionsCheckBox(newValue)
              }
            />
            <Text
              style={{
                fontSize: Typography.FONT_SIZE_12,
                color: Colors.WHITE,
                fontFamily: Typography.FONT_FAMILY_POPPINS_LIGHT,
                fontWeight: Typography.FONT_WEIGHT_400,
                flex: 1,
                // marginLeft: "3%"
              }}
              multiline={true}
            >
              Consent to our email notifications and marketing communications
            </Text>
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
              onPress={() => {
                if (!validateEmail.test(email))
                  return setValidationError({
                    email: "Please enter a valid email address.",
                    password: ""
                  })

                if (!password)
                  return setValidationError({
                    email: "",
                    password: "Please enter a valid password"
                  })

                if (password !== repassword)
                  return setValidationError({
                    email: "",
                    password: "Confirm password and password do not match."
                  })
                if (!termsAndConditionsCheckBox) {
                  Alert.alert("", "Please accept terms and conditions")
                  return
                }
                onSignupPress({
                  name: name,
                  email: email,
                  password: password,
                  password2: repassword,
                  event_planner: false,
                  accept_tc: termsAndConditionsCheckBox
                })
              }}
            >
              SIGN UP
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
                Have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.replace("LoginScreen")}
              >
                <Text
                  style={{
                    color: Colors.PRIMARY_1,
                    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                    fontSize: Typography.FONT_SIZE_14,
                    fontWeight: Typography.FONT_WEIGHT_400
                  }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    )
  }

  const SecondRoute = () => {
    const [businessName, setBusinessName] = useState("")
    const [employerNumber, setEmployerNumber] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [repassword, setRepassword] = useState("")
    const [termsAndConditionsCheckBox, setTermsAndConditionsCheckBox] =
      useState(false)

    const [validationError, setValidationError] = useState({
      email: "",
      password: ""
    })

    return (
      <ScrollView>
        <KeyboardAvoidingView
          style={{
            flex: 1,
            marginTop: "5%",
            backgroundColor: Colors.NETURAL_3,
            alignItems: "center"
          }}
          behavior={Platform.OS === "ios" ? "padding" : null}
        >
          <Input
            width={"90%"}
            onChangeText={value => setBusinessName(value)}
            value={businessName}
            placeholder="Business/ Venue Name"
            iconLeft={
              <Image
                style={{ width: 24, height: 24, margin: 10 }}
                source={require("../../../assets/images/login_signup/suit.png")}
              />
            }
            iconHighlighted={
              <Image
                style={{ width: 24, height: 24, margin: 10 }}
                source={require("../../../assets/images/login_signup/suit_active.png")}
              />
            }
          />

          <Input
            width={"90%"}
            onChangeText={value => setEmployerNumber(value)}
            value={employerNumber}
            placeholder="Employer Identification Number "
            iconLeft={
              <Image
                style={{ width: 24, height: 24, margin: 10 }}
                source={require("../../../assets/images/login_signup/codeBook.png")}
              />
            }
            iconHighlighted={
              <Image
                style={{ width: 24, height: 24, margin: 10 }}
                source={require("../../../assets/images/login_signup/codeBook_active.png")}
              />
            }
          />

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
            error={validationError.password}
            iconHighlighted={
              <Image
                style={{ width: 24, height: 24, margin: 10 }}
                source={require("../../../assets/images/login_signup/lock_active.png")}
              />
            }
          />

          <Input
            width={"90%"}
            onChangeText={value => setRepassword(value)}
            value={repassword}
            secureTextEntry={true}
            placeholder="Re-enter password"
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
          />

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: "10%"
            }}
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
            <TouchableOpacity onPress={() => onGoogleConnect(dispatch, true)}>
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
              <TouchableOpacity onPress={() => onAppleConnect(dispatch, true)}>
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

            <TouchableOpacity onPress={() => onFacebookConnect(dispatch, true)}>
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
            style={{ flexDirection: "row", margin: "5%", alignItems: "center" }}
          >
            <CheckBox
              onCheckColor={"#000"}
              onTintColor={Colors.PRIMARY_1}
              boxType={"square"}
              onFillColor={Colors.PRIMARY_1}
              style={{ marginHorizontal: "2%", width: 20, height: 20 }}
              disabled={false}
              value={termsAndConditionsCheckBox}
              onValueChange={newValue =>
                setTermsAndConditionsCheckBox(newValue)
              }
            />
            <Text
              style={{
                fontSize: Typography.FONT_SIZE_12,
                color: Colors.WHITE,
                fontFamily: Typography.FONT_FAMILY_POPPINS_LIGHT,
                fontWeight: Typography.FONT_WEIGHT_400,
                flex: 1
              }}
              multiline={true}
            >
              Consent to our email notifications and marketing communications
            </Text>
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
              onPress={() => {
                if (!validateEmail.test(email))
                  return setValidationError({
                    email: "Please enter a valid email address.",
                    password: ""
                  })

                if (!password)
                  return setValidationError({
                    email: "",
                    password: "Please enter a valid password"
                  })

                if (password !== repassword)
                  return setValidationError({
                    email: "",
                    password: "Confirm password and password do not match."
                  })

                if (!termsAndConditionsCheckBox) {
                  Alert.alert("", "Please accept terms and conditions")
                  return
                }
                onSignupPress({
                  business_name: businessName,
                  business_reg_no: employerNumber,
                  email: email,
                  password: password,
                  password2: repassword,
                  event_planner: true,
                  accept_tc: termsAndConditionsCheckBox
                })
              }}
            >
              SIGN UP
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
                Have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.replace("LoginScreen")}
              >
                <Text
                  style={{
                    color: Colors.PRIMARY_1,
                    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                    fontSize: Typography.FONT_SIZE_14,
                    fontWeight: Typography.FONT_WEIGHT_400
                  }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    )
  }

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute
  })

  _renderTabBar = props => {
    return (
      <TabBar
        {...props}
        inactiveColor={Colors.text}
        activeColor={Colors.PRIMARY_2}
        indicatorStyle={{
          backgroundColor: Colors.PRIMARY_2,
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
    <View style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      <Text
        style={{
          alignSelf: "center",
          fontSize: Typography.FONT_SIZE_34,
          color: Colors.WHITE,
          marginTop: "15%",
          marginBottom: "5%",
          fontWeight: Typography.FONT_WEIGHT_BOLD
        }}
      >
        Sign Up
      </Text>
      <TabView
        renderTabBar={_renderTabBar}
        style={{ flex: 1 }}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: "100%", height: 100 }}
      />
    </View>
  )
}
export default SignupScreen
