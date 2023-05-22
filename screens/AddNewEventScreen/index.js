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
import { createEvent, updateEvent } from "../../services/events"
import Spinner from "react-native-loading-spinner-overlay"
import { useRoute } from "@react-navigation/native"
import FastImage from "react-native-fast-image"
import moment from "moment"

import { data } from "../../data"

const { width, height } = Dimensions.get("window")

const AddNewEventScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()

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
  const [categories, setCategories] = useState([])
  const [bottleServices, setBottleServices] = useState([])
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [refreshNow, setRefreshNow] = useState(Date.now())
  const [location, setLocation] = useState(null)
  const [primaryLocation, setPrimaryLocation] = useState(null)
  const [event, setEvent] = useState(null)
  const [venueName, setVenueName] = useState("")

  const [loading, setLoading] = useState(false)

  useEffect(async () => {
    if (route.params?.event && !event) {
      setEvent(route.params?.event)
      setEventPreviousValues(route.params?.event)
    }
  }, [])

  const setEventPreviousValues = async eventData => {
    setEventImage(eventData?.event_images[0].image)
    setEventTitle(eventData?.title)
    setEventDate(eventData?.start_date)
    setEventDescription(eventData?.desc)
    setVenueName(eventData?.venue_name)

    let cat = eventData?.event_categories.map(item => ({
      ...item,
      isEnabled: true
    }))
    setCategories(cat)
    setLocation(eventData?.location)
    setBottleServices(eventData?.event_bottle_services)
  }

  const onCreateEventPress = async () => {
    let originalDate = moment(eventDate, "MM-DD-YYYY")
    let newDate = originalDate.format("YYYY-MM-DD")

    setLoading(true)
    const fromData = new FormData()
    fromData.append("price", 0)
    fromData.append("start_date", newDate)
    fromData.append("end_date", newDate)
    fromData.append("venue_name", venueName)

    // fromData.append("categories", 4)
    fromData.append("title", eventTitle)
    fromData.append("desc", eventDescription)
    fromData.append("location", checkBox ? primaryLocation : location)
    fromData.append("images", {
      uri: eventImage,
      type: "image/jpeg",
      name: Date.now() + "photo.jpg"
    })

    bottleServices.forEach(element => {
      fromData.append("bottle_services", element.id)
    })

    categories.forEach(element => {
      fromData.append("categories", element.id)
    })

    try {
      const resp = await createEvent(fromData)
      setLoading(false)

      console.log("add event response ", resp)
      navigation.goBack()
    } catch (error) {
      setLoading(false)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data)

        let key = Object.keys(error.response?.data)
        if (key.length > 0)
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
        console.log("Error", error)
      }
    }
  }

  const onUpdateEventPressed = async () => {
    let originalDate = moment(eventDate, "MM-DD-YYYY")
    let newDate = originalDate.format("YYYY-MM-DD")

    setLoading(true)
    const fromData = new FormData()
    fromData.append("price", 0)
    fromData.append("start_date", newDate)
    fromData.append("end_date", newDate)
    fromData.append("venue_name", venueName)

    // fromData.append("categories", 4)
    fromData.append("title", eventTitle)
    fromData.append("desc", eventDescription)
    fromData.append("location", checkBox ? primaryLocation : location)

    if (!eventImage.includes("http")) {
      fromData.append("images", {
        uri: eventImage,
        type: "image/jpeg",
        name: Date.now() + "photo.jpg"
      })
    }

    bottleServices.forEach(element => {
      fromData.append("bottle_services", element.id)
    })

    categories.forEach(element => {
      debugger
      if (element.isEnabled === true) fromData.append("categories", element.id)
    })

    try {
      const resp = await updateEvent(fromData, event?.id)
      setLoading(false)

      console.log("update event response ", resp)
      navigation.goBack()
    } catch (error) {
      console.log(error)
      setLoading(false)
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data)

        let key = Object.keys(error.response?.data)
        if (key.length > 0)
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

  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }

  const hideDatePicker = () => {
    setDatePickerVisibility(false)
  }

  const handleConfirm = date => {
    const dateOnly =
      date.getMonth() + 1 + "-" + date.getDate() + "-" + date.getFullYear()
    setEventDate(dateOnly)
    hideDatePicker()
  }

  useEffect(() => {
    getSavedLocation()
  }, [])

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getSavedLocation()

      // The screen is focused
      // Call any action
    })

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe
  }, [navigation])

  const getSavedLocation = async () => {
    const savedLocation = await getDataStorage("@LOCATION")
    if (savedLocation) {
      setLocation(
        `${savedLocation.street} ${savedLocation.city}, ${savedLocation.country} ${savedLocation.zip}`
      )
    }

    const pLocation = await getDataStorage("@PRIMARY_LOCATION")
    if (pLocation) {
      setPrimaryLocation(
        `${pLocation.street} ${pLocation.city}, ${pLocation.country} ${pLocation.zip}`
      )
    }
  }

  const updateCategories = data => {
    console.log("submit data ", data)
    setCategories(data)
    setRefreshNow(Date.now())
  }

  const addNewBottleServices = data => {
    let allBottleServices = bottleServices
    allBottleServices.push(data)
    setRefreshNow(Date.now())

    setBottleServices(allBottleServices)
  }

  const updateBottleService = data => {
    let allBottleServices = bottleServices

    for (let i = 0; i < allBottleServices.length; i++) {
      if (allBottleServices[i].id === data.id) {
        allBottleServices[i] = data
      }
    }

    setRefreshNow(Date.now())

    setBottleServices(allBottleServices)
  }

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
            <FastImage
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

  const renderGenericItem = (title, img, bottleService, isLocation = false) => {
    return (
      <View style={[styles.shortFieldContainer, { aspectRatio: 5.02 }]}>
        {/* AddNewLocationScreen */}
        <TouchableOpacity
          onPress={() => {
            if (!isLocation) {
              navigation.navigate("AddNewBottleScreen", {
                onSubmit: addNewBottleServices,
                onUpdate: updateBottleService,
                bottleService: bottleService
              })
              return
            }
            navigation.navigate("AddNewLocationScreen")
          }}
        >
          <View style={styles.genericItemContainer}>
            <Image
              style={{ width: "8%", height: undefined, aspectRatio: 1 }}
              source={img}
            ></Image>
            <Text
              style={[
                styles.FONT_16,
                styles.flex1,
                { color: Colors.WHITE, marginHorizontal: "6%" }
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
        </TouchableOpacity>
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
        <Text style={[styles.title, { color: Colors.WHITE }]}>
          {event ? "Edit Event" : "Add Event"}
        </Text>
      </View>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        extraScrollHeight={100}
        enableAutoAutomaticScroll={Platform.OS === "ios"}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: "90%" }}
        contentContainerStyle={[{ flexGrow: 1, alignItems: "center" }]}
      >
        {loading && (
          <Spinner
            indicatorStyle={{ color: Colors.PRIMARY_1 }}
            overlayColor={Colors.BLACK_OPACITY_50}
            visible={true}
            textStyle={{ color: Colors.PRIMARY_1 }}
          />
        )}
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

          <View style={styles.shortFieldContainer}>
            <TextInput
              style={[styles.FONT_16_2, { marginHorizontal: "4%" }]}
              placeholder={"Event Venue"}
              placeholderTextColor={Colors.NETURAL_2}
              onChangeText={newText => setVenueName(newText)}
              defaultValue={venueName}
            />
          </View>

          {/* <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={styles.shortDividedFieldContainer}>
              <TextInput
                keyboardType="number-pad"
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
                keyboardType="number-pad"
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
          </View> */}

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
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("CategoriesSelectionScreen", {
                  onSubmit: updateCategories
                })
              }}
            >
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
            </TouchableOpacity>
            <View style={styles.catItemParent} key={refreshNow}>
              {categories?.map(
                (element, i) =>
                  element.isEnabled && (
                    <View style={styles.catItem} key={element.updatedAt}>
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
                  )
              )}
            </View>
          </View>

          <View style={{ marginVertical: "4%" }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AddNewBottleScreen", {
                  onSubmit: addNewBottleServices
                })
              }}
            >
              <View style={styles.goldenContainer}>
                <Text style={[styles.FONT_16, { color: Colors.PRIMARY_1 }]}>
                  Bottle Services
                </Text>
                <Image
                  style={{ width: "5%", height: undefined, aspectRatio: 1 }}
                  source={ImgPlus}
                ></Image>
              </View>
            </TouchableOpacity>

            {refreshNow &&
              bottleServices.map(bottleService => {
                return renderGenericItem(
                  bottleService.name,
                  ImgBottle,
                  bottleService
                )
              })}
            {/* {renderGenericItem("Empty Bottle Service", ImgBottle)} */}
            {/* {renderGenericItem("Garden Tables", ImgBottle)} */}
          </View>

          <View style={{ marginVertical: "4%" }}>
            <View style={styles.goldenContainer}>
              <Text style={[styles.FONT_16, { color: Colors.PRIMARY_1 }]}>
                Location
              </Text>
            </View>

            {primaryLocation && (
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
                    ({primaryLocation})
                  </Text>
                </View>
              </View>
            )}
            {!checkBox && (
              <Text style={[styles.FONT_16, { color: Colors.NETURAL_2 }]}>
                or select new location below
              </Text>
            )}
            {!checkBox &&
              renderGenericItem(
                location ? location : "Add Location",
                ImgLocation,
                null,
                true
              )}
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
              onPress={() =>
                event ? onUpdateEventPressed() : onCreateEventPress()
              }
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
