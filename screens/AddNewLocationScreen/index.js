import React, { useState, useEffect } from "react"
import {
  Image,
  Alert,
  View,
  Text,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Platform
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button } from "../../components"
import { useRoute } from "@react-navigation/native"
import { Colors, Typography } from "../../styles"
import NavigationHeader from "../../components/NavigationHeader"
import { useNavigation } from "@react-navigation/native"
import {
  getDataStorage,
  setDataStorage,
  clearStorage
} from "../../utils/storage"
import ImgArrow from "../../assets/images/arrow.png"

const { width, height } = Dimensions.get("window")

const AddNewLocationScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const [country, setCountry] = useState("USA")
  const [street, setStreet] = useState("")
  const [city, setCity] = useState("")
  const [zip, setZip] = useState("")
  const [state, setState] = useState("")

  useEffect(() => {
    setInitialValues()
  }, [])

  const setInitialValues = async() => {
    debugger
    if (route?.params?.isPrimaryLocation) {
      const primaryLocation  = await getDataStorage("@PRIMARY_LOCATION")
      if(primaryLocation){
        setCountry(primaryLocation?.country)
        setStreet(primaryLocation?.street)
        setCity(primaryLocation?.city)
        setZip(primaryLocation?.zip)
        setState(primaryLocation?.state)
      }
    }
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
        <Text style={[styles.title, { color: Colors.WHITE }]}>Location</Text>
      </View>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutoAutomaticScroll={Platform.OS === "ios"}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: "90%" }}
        contentContainerStyle={[{ flexGrow: 1, alignItems: "center" }]}
      >
        <View style={styles.flex1}>
          <View style={styles.flex1}>
            <View
              style={[
                styles.shortFieldContainer,
                {
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center"
                }
              ]}
            >
              <TextInput
                style={[styles.FONT_16_2, { marginHorizontal: "4%" }]}
                placeholder={"Country"}
                placeholderTextColor={Colors.NETURAL_2}
                onChangeText={newText => setCountry(newText)}
                defaultValue={country}
              />
              <Image
                resizeMode="contain"
                style={styles.dropdownImage}
                source={ImgArrow}
              ></Image>
            </View>

            <View style={styles.shortFieldContainer}>
              <TextInput
                style={[styles.FONT_16_2, { marginHorizontal: "4%" }]}
                placeholder={"Enter Street"}
                placeholderTextColor={Colors.NETURAL_2}
                onChangeText={newText => setStreet(newText)}
                defaultValue={street}
              />
            </View>

            <View style={styles.shortFieldContainer}>
              <TextInput
                style={[styles.FONT_16_2, { marginHorizontal: "4%" }]}
                placeholder={"City"}
                placeholderTextColor={Colors.NETURAL_2}
                onChangeText={newText => setCity(newText)}
                defaultValue={city}
              />
            </View>

            <View style={styles.shortFieldContainer}>
              <TextInput
                style={[styles.FONT_16_2, { marginHorizontal: "4%" }]}
                placeholder={"Zip"}
                placeholderTextColor={Colors.NETURAL_2}
                onChangeText={newText => setZip(newText)}
                defaultValue={zip}
              />
            </View>

            <View style={styles.shortFieldContainer}>
              <TextInput
                style={[styles.FONT_16_2, { marginHorizontal: "4%" }]}
                placeholder={"State ( If applies ) "}
                placeholderTextColor={Colors.NETURAL_2}
                onChangeText={newText => setState(newText)}
                defaultValue={state}
              />
            </View>
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
              onPress={async () => {
                if (route?.params?.isPrimaryLocation) {
                  await setDataStorage("@PRIMARY_LOCATION", {
                    country,
                    street,
                    city,
                    zip,
                    state
                  })
                } else {
                  await setDataStorage("@LOCATION", {
                    country,
                    street,
                    city,
                    zip,
                    state
                  })
                }

                navigation.goBack()
              }}
            >
              Save
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  )
}

export default AddNewLocationScreen

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
    width: "5%",
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
