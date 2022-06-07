import React, { useState } from "react"
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

import { useSelector, useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"

const { width, height } = Dimensions.get("window")

const ProfileScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(true)
  const [name, setName] = useState("true")
  const [about, setAbout] = useState("")

  const intrests = ["Music", "Food", "Cinema", "Music"]
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
          }}
        >
          <Image
            style={{ resizeMode: "contain", width: "100%", height: "100%" }}
            source={require("../../assets/images/splash.png")}
          />
          <TouchableOpacity style={{ position: "absolute" }}>
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

            <TouchableOpacity>
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

          <View style={{ flexDirection: "row" }}>
            {intrests.map((element, i) => (
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
              >
                <Text
                  style={{
                    margin: 10,
                    fontSize: Typography.FONT_SIZE_14,
                    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                    color: Colors.PRIMARY_1
                  }}
                >
                  {element}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </KeyboardAwareScrollView>
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
        SAVE
      </Button>
    </SafeAreaView>
  )
}

export default ProfileScreen
