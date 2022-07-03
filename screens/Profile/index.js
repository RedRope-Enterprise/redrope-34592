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

const ProfileScreen = () => {
  const navigation = useNavigation()

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [name, setName] = useState("")
  const [about, setAbout] = useState("")
  const [userImage, setUserImage] = useState("")

  const [existingUser, setExistingUser] = useState()

  const [userInterests, setUserInterests] = useState()
  const [updateInterests, setUpdateInterests] = useState(Date.now())

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getAllInterests()
      // The screen is focused
      // Call any action
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [navigation])

  useEffect(() => {
    getAllInterests()
    setInitialValues()
  }, [])

  setInitialValues = async () => {
    let eUser = await global.user
    setExistingUser(eUser)
    if(!eUser?.likes){
      setIsModalVisible(true)
    }

    console.log(" eUser.name ", eUser.name)
    setName(eUser.name)
    setAbout(eUser.bio)
    setUserInterests(eUser.likes)
    setUserImage(eUser.profile_picture)
  }

  const getUserName = async () => {
    let name = await getDataStorage("userName")
    setName(name)
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

  const getInterestsIds = async () => {
    let result = []
    userInterests?.forEach(element => {
      element = JSON.parse(JSON.stringify(element))
      result.push(element.id)
    })

    return result
  }

  setupUserProfile = async () => {
    let likes = await getInterestsIds()
    const data = new FormData()
    data.append("name", name)
    data.append("bio", about)
    data.append("profile_picture", {
      uri: userImage,
      type: "image/jpeg",
      name: Date.now() + "photo.jpg"
    })

    const resp = await updateUser(data)
    if (resp) {
      let param = {
        interests: likes
      }
      let finalResp = await updateUser(param)

      await setDataStorage("@user", finalResp)
      global.user = finalResp
      navigation.navigate("Dashboard")
    }
  }

  const getAllInterests = async () => {
    // await clearStorage()
    let data = await getDataStorage("@user")
    data = JSON.parse(data)
    if (data) {
      setUserInterests(data.likes)
      setUpdateInterests(Date.now())
    }

    // if (!data) {
    //   await setDataStorage("@user_interests", [
    //     { title: "Music", isEnabled: true, updatedAt: Date.now() },
    //     { title: "Entertainment", isEnabled: false, updatedAt: Date.now() },
    //     { title: "Secret Party", isEnabled: true, updatedAt: Date.now() },
    //     { title: "Art", isEnabled: false, updatedAt: Date.now() },
    //     { title: "Celebrities", isEnabled: false, updatedAt: Date.now() },
    //     { title: "Food", isEnabled: false, updatedAt: Date.now() },
    //     { title: "Cinema", isEnabled: true, updatedAt: Date.now() },
    //     { title: "Entertainment", isEnabled: false, updatedAt: Date.now() }
    //   ])
    // } else {
    // }
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
        contentContainerStyle={{
          flex: 1,
          alignItems: "center"
        }}
      >
        <CustomModal
          isVisible={isModalVisible}
          text={`Welcome
Please setup your profile`}
          onClose={() => setIsModalVisible(false)}
        ></CustomModal>

        <NavigationHeader />

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
          <TouchableOpacity
            style={{ position: "absolute" }}
            onPress={() => onPickImagePress()}
          >
            <Image
              style={{ resizeMode: "contain", width: 70, height: 70 }}
              source={require("../../assets/images/profile/Camera.png")}
            />
          </TouchableOpacity>
        </View>

        <Input
          width={"90%"}
          onChangeText={value => setName(value)}
          value={name}
          placeholder="Enter your name"
          selectedBorderColor={Colors.PRIMARY_1}
          iconLeft={
            <Image
              style={{ width: 24, height: 24, margin: 10 }}
              source={require("../../assets/images/login_signup/person.png")}
            />
          }
          iconHighlighted={
            <Image
              style={{ width: 24, height: 24, margin: 10 }}
              source={require("../../assets/images/login_signup/person_active.png")}
            />
          }
        />

        <Input
          width={"90%"}
          onChangeText={value => setAbout(value)}
          value={about}
          placeholder="About"
          height={Mixins.scaleHeight(140)}
          selectedBorderColor={Colors.PRIMARY_1}
          isMultiLine={true}
        />

        <View
          style={{
            backgroundColor: Colors.NETURAL_4,
            width: "90%",
            borderRadius: 10,
            borderColor: Colors.BORDER,
            borderWidth: 1
          }}
        >
          <View
            style={{
              marginHorizontal: "5%",
              marginVertical: "5%",
              flexDirection: "row"
            }}
          >
            <Text
              style={{
                fontSize: Typography.FONT_SIZE_16,
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                color: Colors.NETURAL_2,
                flex: 1
              }}
            >
              Select Interest
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate("Interests")}>
              <Text
                style={{
                  fontSize: Typography.FONT_SIZE_24,
                  fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                  color: Colors.NETURAL_2
                }}
              >
                {">"}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{ flexDirection: "row", flexWrap: "wrap" }}
            key={updateInterests}
          >
            {userInterests?.map((element, i) => (
              <View
                style={{
                  alignItems: "center",
                  marginHorizontal: 10,
                  backgroundColor: "#423a28",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: Colors.PRIMARY_1,
                  marginBottom: 10
                }}
                key={element.id}
              >
                <Text
                  style={{
                    margin: 10,
                    fontSize: Typography.FONT_SIZE_14,
                    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                    color: Colors.PRIMARY_1
                  }}
                >
                  {element.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </KeyboardAwareScrollView>
      <View style={{ alignItems: "center" }}>
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

export default ProfileScreen
