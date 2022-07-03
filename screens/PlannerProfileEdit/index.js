import React, { useState, useEffect } from "react"
import {
  Image,
  Alert,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  SafeAreaView,
  StatusBar
} from "react-native"
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

const PlannerProfileEditScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [name, setName] = useState("")
  const [userImage, setUserImage] = useState("")

  const [existingUser, setExistingUser] = useState()

  const [bName, setBName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [website, setWebsite] = useState("")
  const [about, setAbout] = useState("")
  const [location, setLocation] = useState("New York, USA")
  const [bAccount, setBAccount] = useState("")

  const [profileView, setProfileView] = useState(false)

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [navigation])

  useEffect(() => {
    setInitialValues()
  }, [])

  setInitialValues = async () => {
    let eUser = await global.user
    setExistingUser(eUser)

    setEmail(eUser.email)
    setName(eUser.name)
    setAbout(eUser.bio)
    setBName(eUser.business_name)
    setUserImage(eUser.profile_picture)
  }

  onPickImagePress = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      console.log(image)
      setUserImage(image.path)
    })
  }

  setupUserProfile = async () => {
    const data = new FormData()
    data.append("name", name)
    data.append("bio", about)
    data.append("profile_picture", {
      uri: userImage,
      type: "image/jpeg",
      name: Date.now() + "photo.jpg"
    })
    data.append("website", website)
    data.append("business_name", bName)
    data.append("phone", phone)
    data.append("address_longitude", "-73.935242"),
    data.append("address_latitude", "40.730610")

    try {
      const resp = await updateUser(data)
      if (resp) {
        console.log("user update resposne ", resp)
        global.user = resp
        
        navigation.navigate("EventPlannerDashboard")
      }
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data)

        let key = Object.keys(error.response?.data)
        if(key.length > 0)
          Alert.alert(key[0], error.response?.data[key[0]]?.[0])

        console.log(error.response.status)
        console.log(error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message)
      }
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      <StatusBar
        animated={true}
        backgroundColor={Colors.NETURAL_3}
        barStyle={"light-content"}
        hidden={false}
      />
      <KeyboardAwareScrollView
        style={{
          marginBottom: "10%"
        }}
        contentContainerStyle={{
          // flex: 1,
          alignItems: "center"
        }}
      >
        <CustomModal
          isVisible={isModalVisible}
          text={`Welcome
Please setup your profile`}
          onClose={() => setIsModalVisible(false)}
        ></CustomModal>

        {!profileView && <NavigationHeader />}

        <View
          style={{
            borderRadius: 1000,
            boderWidth: 1,
            borderColor: Colors.WHITE,
            width: 150,
            height: 150,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: Colors.NETURAL_4,
            marginVertical: "10%"
            // overflow: "hidden",
          }}
        >
          <Image
            style={{
              resizeMode: "cover",
              width: "100%",
              height: "100%",
              borderRadius: 1000
            }}
            source={{ uri: userImage }}
          />
          {!profileView && (
            <TouchableOpacity
              style={{ position: "absolute" }}
              onPress={() => onPickImagePress()}
            >
              <Image
                style={{ resizeMode: "contain", width: 70, height: 70 }}
                source={require("../../assets/images/profile/Camera.png")}
              />
            </TouchableOpacity>
          )}
        </View>

        <Input
          editable={!profileView}
          width={"90%"}
          onChangeText={value => setBName(value)}
          value={bName}
          placeholder={profileView ? "..." : "Enter business name"}
          selectedBorderColor={Colors.PRIMARY_1}
          height={Mixins.scaleHeight(40)}
          iconLeft={
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../../assets/images/login_signup/suit.png")}
            />
          }
          iconHighlighted={
            <Image
              style={{ width: 24, height: 24 }}
              source={require("../../assets/images/login_signup/suit_active.png")}
            />
          }
        />

        <Input
          editable={!profileView}
          width={"90%"}
          onChangeText={value => setEmail(value)}
          value={email}
          placeholder={profileView ? "..." : "Enter contact mail"}
          selectedBorderColor={Colors.PRIMARY_1}
          height={Mixins.scaleHeight(40)}
          iconLeft={
            <Image
              style={{ width: 24, height: 24, margin: 10 }}
              source={require("../../assets/images/login_signup/email.png")}
            />
          }
          iconHighlighted={
            <Image
              style={{ width: 24, height: 24, margin: 10 }}
              source={require("../../assets/images/login_signup/email_active.png")}
            />
          }
        />

        <Input
          editable={!profileView}
          width={"90%"}
          onChangeText={value => setPhone(value)}
          value={phone}
          placeholder={profileView ? "..." : "Enter contact phone"}
          selectedBorderColor={Colors.PRIMARY_1}
          height={Mixins.scaleHeight(40)}
          iconLeft={
            <Image
              style={{ width: 24, height: 24, margin: 10 }}
              source={require("../../assets/images/login_signup/phone.png")}
            />
          }
          iconHighlighted={
            <Image
              style={{ width: 24, height: 24, margin: 10 }}
              source={require("../../assets/images/login_signup/phone_active.png")}
            />
          }
        />

        <Input
          editable={!profileView}
          width={"90%"}
          onChangeText={value => setWebsite(value)}
          value={website}
          placeholder={profileView ? "..." : "Enter website"}
          selectedBorderColor={Colors.PRIMARY_1}
          height={Mixins.scaleHeight(40)}
          iconLeft={
            <Image
              style={{ width: 24, height: 24, margin: 10 }}
              source={require("../../assets/images/login_signup/web.png")}
            />
          }
          iconHighlighted={
            <Image
              style={{ width: 24, height: 24, margin: 10 }}
              source={require("../../assets/images/login_signup/web_active.png")}
            />
          }
        />

        <Input
          editable={!profileView}
          width={"90%"}
          onChangeText={value => setAbout(value)}
          value={about}
          placeholder={profileView ? "..." : "Bio"}
          height={Mixins.scaleHeight(120)}
          selectedBorderColor={Colors.PRIMARY_1}
          isMultiLine={true}
        />

        <View>
          <Text
            style={{
              color: Colors.PRIMARY_1,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontSize: Typography.FONT_SIZE_14,
              fontWeight: Typography.FONT_WEIGHT_600
            }}
          >
            Location
          </Text>
          <TouchableOpacity
            style={{ width: "90%" }}
            disabled={profileView}
            onPress={() => {}}
          >
            <Input
              editable={false}
              onChangeText={value => setLocation(value)}
              value={location}
              placeholder={profileView ? "..." : "Add location"}
              selectedBorderColor={Colors.PRIMARY_1}
              height={Mixins.scaleHeight(50)}
              iconLeft={
                <Image
                  style={{ width: 24, height: 24, margin: 10 }}
                  source={require("../../assets/images/login_signup/web.png")}
                />
              }
              iconRight={
                !profileView && (
                  <Image
                    style={{ width: 24, height: 24, margin: 10 }}
                    source={require("../../assets/images/RightArrow.png")}
                  />
                )
              }
              iconHighlighted={
                <Image
                  style={{ width: 24, height: 24, margin: 10 }}
                  source={require("../../assets/images/login_signup/web_active.png")}
                />
              }
            />
          </TouchableOpacity>
        </View>

        {/* <View>
          <Text
            style={{
              color: Colors.PRIMARY_1,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              fontSize: Typography.FONT_SIZE_14,
              fontWeight: Typography.FONT_WEIGHT_600
            }}
          >
            Connect Bank Account
          </Text>
          <TouchableOpacity
            style={{ width: "90%" }}
            disabled={profileView}
            onPress={() => {}}
          >
            <Input
              editable={false}
              onChangeText={value => setBAccount(value)}
              value={bAccount}
              placeholder={profileView ? "..." : "Connect your bank account"}
              selectedBorderColor={Colors.PRIMARY_1}
              height={Mixins.scaleHeight(50)}
              iconLeft={
                <Image
                  style={{ width: 24, height: 24, margin: 10 }}
                  source={require("../../assets/images/login_signup/web.png")}
                />
              }
              iconRight={
                !profileView && (
                  <Image
                    style={{ width: 24, height: 24, margin: 10 }}
                    source={require("../../assets/images/RightArrow.png")}
                  />
                )
              }
              iconHighlighted={
                <Image
                  style={{ width: 24, height: 24, margin: 10 }}
                  source={require("../../assets/images/login_signup/web_active.png")}
                />
              }
            />
          </TouchableOpacity>
        </View> */}
      </KeyboardAwareScrollView>
      <View style={{ alignItems: "center", marginBottom: "5%" }}>
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
            setupUserProfile()
          }}
        >
          SAVE
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default PlannerProfileEditScreen
