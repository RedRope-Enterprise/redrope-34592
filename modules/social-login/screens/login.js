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

const LoginScreen = ({}) => {
  const navigation = useNavigation()

  const [showPassword, setshowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

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
    </KeyboardAvoidingView>
  )
}
export default LoginScreen
