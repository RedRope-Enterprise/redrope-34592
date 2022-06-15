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
    // setValidationError({ email: "", password: "", username: "" })
    // if (!fullName) {
    //   setValidationError({
    //     username: "Please enter your name"
    //   })
    // }
    // if (!validateEmail.test(email))
    //   setValidationError({
    //     ...validationError,
    //     email: "Please enter a valid email address."
    //   })

    // if (!password)
    //   setValidationError({
    //     ...validationError,
    //     password: "Please enter a valid password"
    //   })

    // if (password !== confirmPassword)
    //   setValidationError({
    //     ...validationError,
    //     password: "Confirm password and password do not match."
    //   })

    // console.log("validationError ", validationError)
    // if (
    //   validationError.email != "" ||
    //   validationError.password != "" ||
    //   validationError.username != ""
    // )
    //   return validationError

    await setDataStorage("userName", payload.name)
    navigation.navigate("Profile")

    return

    dispatch(signupRequest(payload))
      .then(unwrapResult)
      .then(res => {
        console.log("login data ", res)
        setDataStorage("@user", res?.user)
        setDataStorage("@profile", res?.profile)
        setDataStorage("@key", res?.key)
        Alert.alert("", "Signup success!")
        navigation.replace("Dashboard")
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
        dispatch(facebookLogin({ access_token: data.accessToken }))
          .then(unwrapResult)
          .then(res => {
            if (res.key) navigation.navigate(HOME_SCREEN_NAME)
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
      dispatch(googleLogin({ access_token: tokens.accessToken }))
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

  const onAppleConnect = async dispatch => {
    try {
      const signinFunction = Platform.select({
        ios: appleForiOS,
        android: appleForAndroid
      })
      const result = await signinFunction()
      dispatch(
        appleLogin({ id_token: result.id_token, access_token: result.code })
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
    return (
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
            onPress={() => {
              onSignupPress({
                name: name,
                email: email,
                password: password,
                password2: repassword,
                event_planner: false,
                accept_tc: true
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
            <TouchableOpacity onPress={() => navigation.replace("LoginScreen")}>
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
    )
  }

  const SecondRoute = () => {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [repassword, setRepassword] = useState("")
    return (
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
          onChangeText={value => setName(value)}
          value={name}
          placeholder="Business/ Venue Name"
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
            onPress={() => {
              navigation.navigate("Profile")
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
            <TouchableOpacity onPress={() => navigation.replace("LoginScreen")}>
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
