import React, { useState, useEffect } from "react"
import {
  Image,
  Alert,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  FlatList,
  ImageBackground,
  ScrollView,
  TextInput,
  Platform
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, Input, CustomModal, CustomImageModal } from "../../components"
import { Colors, Typography } from "../../styles"
import NavigationHeader from "../../components/NavigationHeader"
import { useNavigation } from "@react-navigation/native"
import {
  getDataStorage,
  setDataStorage,
  clearStorage
} from "../../utils/storage"
import ImagePicker from "react-native-image-crop-picker"
import BouncyCheckbox from "react-native-bouncy-checkbox"

import ImgCamera from "../../assets/images/profile/Camera.png"
import ImgPlus from "../../assets/images/plus.png"
import ImgBottle from "../../assets/images/bottle.png"
import ImgArrow from "../../assets/images/arrow.png"
import ImgLocation from "../../assets/images/location.png"
import DateTimePickerModal from "react-native-modal-datetime-picker"

const { width, height } = Dimensions.get("window")

const AddNewBottleScreen = () => {
  const navigation = useNavigation()

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [person, setPerson] = useState("")
  const [description, setDescription] = useState("")

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.NETURAL_3,
        alignItems: "center"
      }}
    >
      <NavigationHeader></NavigationHeader>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: Colors.WHITE }]}>
          Bottle Service
        </Text>
      </View>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutoAutomaticScroll={Platform.OS === "ios"}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: "90%" }}
        contentContainerStyle={[{ flexGrow: 1, alignItems: "center" }]}
      >
        <View style={styles.flex1}>
          <View style={styles.shortFieldContainer}>
            <TextInput
              style={[styles.FONT_16_2, { marginHorizontal: "4%" }]}
              placeholder={"Name"}
              placeholderTextColor={Colors.NETURAL_2}
              onChangeText={newText => setName(newText)}
              defaultValue={name}
            />
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={styles.shortDividedFieldContainer}>
              <TextInput
                style={[styles.FONT_16_2, { marginHorizontal: "8%" }]}
                placeholder={"Price"}
                placeholderTextColor={Colors.NETURAL_2}
                onChangeText={newText => setPrice(newText)}
                defaultValue={price}
              />
            </View>

            <View
              style={[
                styles.shortDividedFieldContainer,
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center"
                }
              ]}
            >
              <TextInput
                style={[styles.FONT_16_2, { marginHorizontal: "8%" }]}
                placeholder={"Person"}
                placeholderTextColor={Colors.NETURAL_2}
                onChangeText={newText => setPerson(newText)}
                defaultValue={person}
              />
              <Image
                resizeMode="contain"
                style={styles.dropdownImage}
                source={ImgArrow}
              ></Image>
            </View>
          </View>

          <View
            style={[
              styles.shortFieldContainer,
              { aspectRatio: 2.3, justifyContent: "flex-start" }
            ]}
          >
            <TextInput
              style={[
                styles.FONT_16_2,
                {
                  marginHorizontal: "4%",
                  marginVertical: "2%",
                  textAlignVertical: "top"
                }
              ]}
              multiline={true}
              placeholder={"Description"}
              placeholderTextColor={Colors.NETURAL_2}
              onChangeText={newText => setDescription(newText)}
              defaultValue={description}
            />
          </View>

          <View style={styles.nextBtnContainer}>
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
              onPress={() => {}}
            >
              Save
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default AddNewBottleScreen

let styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  flex1: {
    flex: 1
  },
  title: {
    fontSize: Typography.FONT_SIZE_24,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    lineHeight: Typography.LINE_HEIGHT_36,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    marginLeft: "5%",
    marginTop: "4%"
  },
  dropdownImage: {
    width: "10%",
    height: undefined,
    aspectRatio: 1,
    marginRight: "6%"
  },
  shortFieldContainer: {
    width: "100%",
    height: undefined,
    aspectRatio: 6.84,
    borderRadius: 12,
    backgroundColor: Colors.NETURAL_4,
    justifyContent: "center",
    marginBottom: "6%"
  },
  shortDividedFieldContainer: {
    width: "47%",
    height: undefined,
    aspectRatio: 3.26,
    borderRadius: 12,
    backgroundColor: Colors.NETURAL_4,
    justifyContent: "center",
    marginBottom: "6%"
  },
  nextBtnContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "10%"
  },
  titleContainer: {
    justifyContent: "center",
    alignContent: "center",
    height: undefined,
    width: "100%",
    aspectRatio: 4.64
  },
  FONT_16_2: {
    fontSize: Typography.FONT_SIZE_16,
    fontWeight: Typography.FONT_WEIGHT_500,
    lineHeight: Typography.LINE_HEIGHT_24,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    color: Colors.WHITE
  }
})
