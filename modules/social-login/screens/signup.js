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
import { Input } from "../../../components"

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
            tintColor={Colors.NETURAL_2}
            source={require("../../../assets/images/login_signup/person.png")}
          />
        }
        iconHighlighted={
          <Image
            style={{ width: 24, height: 24, margin: 10 }}
            tintColor={Colors.PRIMARY_2}
            source={require("../../../assets/images/login_signup/person.png")}
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
            tintColor={Colors.NETURAL_2}
            source={require("../../../assets/images/login_signup/email.png")}
          />
        }
        iconHighlighted={
          <Image
            style={{ width: 24, height: 24, margin: 10 }}
            tintColor={Colors.PRIMARY_2}
            source={require("../../../assets/images/login_signup/email.png")}
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
            tintColor={Colors.NETURAL_2}
            source={require("../../../assets/images/login_signup/lock.png")}
          />
        }
        iconHighlighted={
          <Image
            style={{ width: 24, height: 24, margin: 10 }}
            tintColor={Colors.PRIMARY_2}
            source={require("../../../assets/images/login_signup/lock.png")}
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
            tintColor={Colors.NETURAL_2}
            style={{ width: 24, height: 24, margin: 10 }}
            source={require("../../../assets/images/login_signup/lock.png")}
          />
        }
        iconHighlighted={
          <Image
            tintColor={Colors.PRIMARY_2}
            style={{ width: 24, height: 24, margin: 10 }}
            source={require("../../../assets/images/login_signup/lock.png")}
          />
        }
      />
    </KeyboardAvoidingView>
  )
}
export default SignupScreen
