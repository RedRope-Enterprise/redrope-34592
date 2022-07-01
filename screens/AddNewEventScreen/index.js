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

const AddNewEventScreen = () => {
  const navigation = useNavigation()

  //     const [isModalVisible, setIsModalVisible] = useState(false)
  //     const [name, setName] = useState("")
  //     const [about, setAbout] = useState("")
  const [eventImage, setEventImage] = useState("")
  const [eventTitle, setEventTitle] = useState("")
  const [price, setPrice] = useState("")
  const [person, setPerson] = useState("")
  const [eventDate, setEventDate] = useState("_ _/__/_ _")
  const [eventDescription, setEventDescription] = useState("")
  const [checkBox, setCheckBox] = useState(false)
  const [userInterests, setUserInterests] = useState([])
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }

  const hideDatePicker = () => {
    setDatePickerVisibility(false)
  }

  const handleConfirm = date => {
    const dateOnly =
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    setEventDate(dateOnly)
    hideDatePicker()
  }

  useEffect(() => {
    if (userInterests.length == 0)
      setUserInterests([
        { name: "Music", isEnabled: true, id: Date.now() },
        { name: "Entertainment", isEnabled: false, id: Date.now() },
        { name: "Secret Party", isEnabled: true, id: Date.now() },
        { name: "Art", isEnabled: false, id: Date.now() },
        { name: "Celebrities", isEnabled: false, id: Date.now() },
        { name: "Food", isEnabled: false, id: Date.now() },
        { name: "Cinema", isEnabled: true, id: Date.now() },
        { name: "Entertainment", isEnabled: false, id: Date.now() }
      ])
  }, [])

  const openImagePicker = async () => {
    await ImagePicker.openPicker({}).then(image => {
      setEventImage(image.path)
    })
  }

  const renderEventImageView = () => {
    return (
      <View style={[styles.center, styles.imageContainer]}>
        <TouchableOpacity
          style={[styles.full, styles.center]}
          onPress={() => openImagePicker()}
        >
          {eventImage.length > 0 ? (
            <Image
              resizeMode="cover"
              style={styles.full}
              source={{
                uri: eventImage
              }}
            />
          ) : (
            <>
              <Image
                style={{
                  resizeMode: "contain",
                  width: "20%",
                  height: undefined,
                  aspectRatio: 1
                }}
                source={ImgCamera}
              />
              <Text
                style={[
                  styles.FONT_14,
                  { color: Colors.WHITE, marginTop: "2%" }
                ]}
              >
                upload photo (max 20)
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    )
  }

  const renderGenericItem = (title, img) => {
    return (
      <View style={[styles.shortFieldContainer, { aspectRatio: 5.02 }]}>
        <View style={styles.genericItemContainer}>
          <Image
            style={{ width: "8%", height: undefined, aspectRatio: 1 }}
            source={img}
          ></Image>
          <Text
            style={[
              styles.FONT_16,
              styles.flex1,
              { color: Colors.NETURAL_2, marginHorizontal: "6%" }
            ]}
          >
            {title}
          </Text>
          <Image
            resizeMode="contain"
            style={styles.imgArrow}
            source={ImgArrow}
          ></Image>
        </View>
      </View>
    )
  }

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
        <Text style={[styles.title, { color: Colors.WHITE }]}>Add Event</Text>
      </View>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={100}
        enableAutoAutomaticScroll={Platform.OS === "ios"}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: "90%" }}
        contentContainerStyle={[{ flexGrow: 1, alignItems: "center" }]}
      >
        <View style={styles.flex1}>
          {renderEventImageView()}
          <View style={styles.shortFieldContainer}>
            <TextInput
              style={[styles.FONT_16_2, { marginHorizontal: "4%" }]}
              placeholder={"Event Title"}
              placeholderTextColor={Colors.NETURAL_2}
              onChangeText={newText => setEventTitle(newText)}
              defaultValue={eventTitle}
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

          <View style={styles.shortFieldContainer}>
            <TouchableOpacity
              style={styles.flex1}
              onPress={() => {
                showDatePicker()
              }}
            >
              <View
                pointerEvents="none"
                style={{ justifyContent: "center", flex: 1 }}
              >
                <TextInput
                  editable={false}
                  selectTextOnFocus={false}
                  style={[styles.FONT_16_2, { marginHorizontal: "4%" }]}
                  placeholderTextColor={Colors.NETURAL_2}
                  onChangeText={newText => setEventDate(newText)}
                  defaultValue={eventDate}
                />
              </View>
            </TouchableOpacity>
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
              placeholder={"Event Description"}
              placeholderTextColor={Colors.NETURAL_2}
              onChangeText={newText => setEventDescription(newText)}
              defaultValue={eventDescription}
            />
          </View>

          <View style={[styles.boxContainer, { marginTop: "6%" }]}>
            <View style={styles.catgContainer}>
              <Text
                style={[
                  styles.FONT_16,
                  {
                    color: Colors.NETURAL_2,
                    marginVertical: "4%"
                  }
                ]}
              >
                Select categories
              </Text>
              <Image
                resizeMode="contain"
                style={styles.imgArrow}
                source={ImgArrow}
              ></Image>
            </View>
            <View style={styles.catItemParent}>
              {userInterests?.map((element, i) => (
                <View style={styles.catItem}>
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

          <View style={{ marginVertical: "4%" }}>
            <View style={styles.goldenContainer}>
              <Text style={[styles.FONT_16, { color: Colors.PRIMARY_1 }]}>
                Bottle Services
              </Text>
              <Image
                style={{ width: "5%", height: undefined, aspectRatio: 1 }}
                source={ImgPlus}
              ></Image>
            </View>

            {renderGenericItem("Side Cabanas", ImgBottle)}
            {renderGenericItem("Garden Tables", ImgBottle)}
          </View>

          <View style={{ marginVertical: "4%" }}>
            <View style={styles.goldenContainer}>
              <Text style={[styles.FONT_16, { color: Colors.PRIMARY_1 }]}>
                Location
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                marginVertical: "4%",
                alignItems: "flex-start"
              }}
            >
              <BouncyCheckbox
                size={25}
                fillColor={Colors.PRIMARY_1}
                iconImageStyle={{ tintColor: Colors.NETURAL_5 }}
                iconStyle={{ borderColor: Colors.PRIMARY_1, borderRadius: 4 }}
                useNativeDriver={true}
                isChecked={checkBox}
                onPress={isChecked => {
                  setCheckBox(isChecked)
                }}
              />
              <View>
                <Text
                  style={[
                    styles.FONT_16,
                    { color: Colors.WHITE, marginBottom: "4%" }
                  ]}
                >
                  Use Primary Location
                </Text>
                <Text style={[styles.FONT_14_2, { color: Colors.WHITE }]}>
                  (LA Artstation - Park area 1523)
                </Text>
              </View>
            </View>
            <Text style={[styles.FONT_16, { color: Colors.NETURAL_2 }]}>
              or select new location below
            </Text>
            {renderGenericItem("New York, USA", ImgLocation)}
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
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </SafeAreaView>
  )
}

export default AddNewEventScreen

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
  catItemParent: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: "2%",
    marginTop: "1%",
    marginBottom: "4%"
  },
  catItem: {
    alignItems: "center",
    marginHorizontal: 10,
    backgroundColor: "#423a28",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.PRIMARY_1,
    marginBottom: 10
  },
  goldenContainer: {
    alignItems: "center",
    width: "100%",
    height: undefined,
    aspectRatio: 10,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  dropdownImage: {
    width: "10%",
    height: undefined,
    aspectRatio: 1,
    marginRight: "6%"
  },
  genericItemContainer: {
    marginHorizontal: "6%",
    flexDirection: "row",
    alignItems: "center"
  },
  imageContainer: {
    width: "100%",
    height: undefined,
    aspectRatio: 1.4,
    borderRadius: 12,
    backgroundColor: Colors.NETURAL_4
  },
  shortFieldContainer: {
    width: "100%",
    height: undefined,
    aspectRatio: 6.84,
    borderRadius: 12,
    backgroundColor: Colors.NETURAL_4,
    marginTop: "6%",
    justifyContent: "center"
  },
  shortDividedFieldContainer: {
    width: "47%",
    height: undefined,
    aspectRatio: 3.26,
    borderRadius: 12,
    backgroundColor: Colors.NETURAL_4,
    marginTop: "6%",
    justifyContent: "center"
  },
  imgArrow: {
    width: "6%",
    height: undefined,
    aspectRatio: 1,
    transform: [{ rotate: "270deg" }]
  },
  boxContainer: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: Colors.NETURAL_4,
    justifyContent: "center"
  },
  catgContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: "4%"
  },
  nextBtnContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "10%"
  },
  Font_13: {
    fontSize: Typography.FONT_SIZE_13,
    fontWeight: Typography.FONT_WEIGHT_500,
    lineHeight: Typography.LINE_HEIGHT_20,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    marginTop: "1%"
  },
  full: {
    width: "100%",
    height: "100%"
  },
  titleContainer: {
    justifyContent: "center",
    alignContent: "center",
    height: undefined,
    width: "100%",
    aspectRatio: 4.64
  },
  FONT_24: {
    fontSize: Typography.FONT_SIZE_24,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    lineHeight: Typography.LINE_HEIGHT_32,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
  },
  FONT_16: {
    fontSize: Typography.FONT_SIZE_16,
    fontWeight: Typography.FONT_WEIGHT_400,
    lineHeight: Typography.LINE_HEIGHT_20,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
  },
  FONT_16_2: {
    fontSize: Typography.FONT_SIZE_16,
    fontWeight: Typography.FONT_WEIGHT_500,
    lineHeight: Typography.LINE_HEIGHT_24,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    color: Colors.WHITE
  },
  FONT_12: {
    fontSize: Typography.FONT_SIZE_12,
    fontWeight: Typography.FONT_WEIGHT_400,
    lineHeight: Typography.LINE_HEIGHT_16,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    marginTop: "4%"
  },
  FONT_14: {
    fontSize: Typography.FONT_SIZE_14,
    fontWeight: Typography.FONT_WEIGHT_600,
    lineHeight: Typography.LINE_HEIGHT_20,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
  },
  FONT_14_2: {
    fontSize: Typography.FONT_SIZE_14,
    fontWeight: Typography.FONT_WEIGHT_400,
    lineHeight: Typography.LINE_HEIGHT_18,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
  }
})
