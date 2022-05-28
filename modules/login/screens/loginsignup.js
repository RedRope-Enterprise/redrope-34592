import React, { useState, useContext } from "react"
import { OptionsContext } from "@options"
import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert
} from "react-native"
import { buttonStyles, textInputStyles, Color } from "./styles"
import { useSelector, useDispatch } from "react-redux"
import { loginRequest, signupRequest } from "../auth"
import { unwrapResult } from "@reduxjs/toolkit"
import { validateEmail } from "../constants"

// Custom Text Input
export const TextInputField = props => (
  <View>
    <TextInput
      autoCapitalize="none"
      style={[textInputStyles.textInput, props.textInputStyle]}
      placeholderTextColor={Color.steel}
      underlineColorAndroid={"transparent"}
      {...props}
    />
    {!!props.error && <Text style={textInputStyles.error}>{props.error}</Text>}
  </View>
)

// Custom Button
export const Button = props => (
  <TouchableOpacity onPress={props.onPress} disabled={props.loading}>
    <View style={[buttonStyles.viewStyle, props.viewStyle]}>
      {props.loading ? (
        <ActivityIndicator
          color={props.loadingColor ? props.loadingColor : Color.white}
          style={props.loadingStyle}
        />
      ) : (
        <Text style={[buttonStyles.textStyle, props.textStyle]}>
          {props.title}
        </Text>
      )}
    </View>
  </TouchableOpacity>
)

// Signup Component Tab

export const SignupTab = navigation => {
  const options = useContext(OptionsContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [validationError, setValidationError] = useState({
    email: "",
    password: ""
  })
  const { api } = useSelector(state => state.Login)
  const dispatch = useDispatch()

  const onSignupPress = async () => {
    setValidationError({ email: "", password: "" })
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

    if (password !== confirmPassword)
      return setValidationError({
        email: "",
        password: "Confirm password and password do not match."
      })
    dispatch(signupRequest({ email, password }))
      .then(unwrapResult)
      .then(() => {
        Alert.alert(
          "Signup Success",
          "Registration Successful. A confirmation will be sent to your e-mail address."
        )
      })
      .catch(err => console.log(err.message))
  }

  return (
    <KeyboardAvoidingView>
      <View style={{ marginVertical: 10, marginHorizontal: 15 }}>
        <TextInputField
          keyboardType="email-address"
          label="Email address"
          placeholder="Email address"
          onChangeText={value => setEmail(value)}
          value={email}
          error={validationError.email}
        />
        <TextInputField
          label="Password"
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={value => setPassword(value)}
          value={password}
          error={validationError.password}
          textInputStyle={{ backgroundColor: "red" }}
        />
        <TextInputField
          label="Confirm Password"
          placeholder="Confirm Password"
          secureTextEntry={true}
          onChangeText={value => setConfirmPassword(value)}
          value={confirmPassword}
        />
      </View>
      <Button
        title={options.SignUpButtonText}
        loading={api.loading === "pending"}
        onPress={onSignupPress}
      />
      {!!api.error && (
        <Text style={textInputStyles.error}>{api.error.message}</Text>
      )}
    </KeyboardAvoidingView>
  )
}

export const SignInTab = ({ navigation }) => {
  const options = useContext(OptionsContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [validationError, setValidationError] = useState({
    email: "",
    password: ""
  })

  const { api } = useSelector(state => state.Login)
  const dispatch = useDispatch()

  const onSigninPress = async () => {
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

    dispatch(loginRequest({ username: email, password }))
      .then(unwrapResult)
      .then(res => {
        if (res.token) navigation.navigate(options.HOME_SCREEN_NAME)
      })
      .catch(err => console.log(err.message))
  }

  return (
    <KeyboardAvoidingView>
      <View style={{ marginVertical: 10, marginHorizontal: 15 }}>
        <TextInputField
          keyboardType="email-address"
          placeholder="Email address"
          onChangeText={value => setEmail(value)}
          value={email}
          error={validationError.email}
        />
        <TextInputField
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={value => setPassword(value)}
          value={password}
          error={validationError.password}
        />
        <View
          style={{
            justifyContent: "center",
            alignItems: "flex-end",
            marginBottom: 10
          }}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate("PasswordReset")
            }}
          >
            <Text style={{ color: "rgba(166, 166, 166, 1)" }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 24,
          marginBottom: 40
        }}
      >
        <View
          style={{
            height: 1,
            flex: 1,
            backgroundColor: "rgba(166, 166, 166, 1)"
          }}
        />
        <Text
          style={{ color: "rgba(103, 103, 103, 1)", paddingHorizontal: 12 }}
        >
          {"or"}
        </Text>
        <View
          style={{
            height: 1,
            flex: 1,
            backgroundColor: "rgba(166, 166, 166, 1)"
          }}
        />
      </View>

      <Button
        title={options.SignInButtonText}
        loading={api.loading === "pending"}
        onPress={onSigninPress}
        viewStyle={{ backgroundColor: "#FF0000" }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24,
          marginTop: 35
        }}
      >
        <Text style={{ color: "#FFFFFF", marginRight: 12 }}>
          {"Don’t you have an account?"}
        </Text>
        <Text style={{ color: "#F6D365" }}>{"Sign Up"}</Text>
      </View>
      {!!api.error && (
        <Text style={textInputStyles.error}>{api.error.message}</Text>
      )}
    </KeyboardAvoidingView>
  )
}
