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
import { useNavigation } from "@react-navigation/native"
import { Colors, Typography } from "../../../styles"
import { Input, Button } from "../../../components"

const { width, height } = Dimensions.get("window")

const SignupScreen = ({}) => {
  const navigation = useNavigation()

  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [repassword, setRepassword] = useState("")

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
        Sign Up
      </Text>

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
        style={{ alignItems: "center", flex: 1, justifyContent: "flex-end", marginBottom: "10%"}}
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
        onPress={() => {}}
      >
        SIGN UP
      </Button>

      <View style={{ flexDirection: "row", marginTop:"10%" }}>
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
export default SignupScreen
