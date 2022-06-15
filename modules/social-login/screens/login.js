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
  StyleSheet
} from "react-native"
import { unwrapResult } from "@reduxjs/toolkit"

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
const { width, height } = Dimensions.get("window")
import { setDataStorage } from "../../../utils/storage"
import { mapErrorMessage } from "../auth/utils"

const LoginScreen = ({}) => {
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onLoginPressed = () => {
    dispatch(loginRequest({ email, password }))
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
        <TouchableOpacity>
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

        <TouchableOpacity>
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

        <TouchableOpacity>
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
          // onPress={() => onLoginPressed()}
          onPress={async() => {
            navigation.navigate("Dashboard")
          }}
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
