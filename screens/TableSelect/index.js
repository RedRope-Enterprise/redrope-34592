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
  StyleSheet
} from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { Button, Input, CustomModal } from "../../components"
import { Colors, Typography } from "../../styles"
import NavigationHeader from "../../components/NavigationHeader"
import { useNavigation } from "@react-navigation/native"
import {
  getDataStorage,
  setDataStorage,
  clearStorage
} from "../../utils/storage"

import { useSelector, useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
import CustomTable from "../../components/CustomTable"
const { width, height } = Dimensions.get("window")
import { useRoute } from "@react-navigation/native"

const TableSelectScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const [datasource, setDatasource] = useState([1])

  const { event } = route?.params

  const increaseCircleCount = () => {
    setDatasource([...datasource, 1])
  }

  const decreaseCircleCount = () => {
    let poped = datasource.pop()
    setDatasource([...datasource])
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      <NavigationHeader
        showLeftBtn1={true}
        showLeftBtn2={true}
      ></NavigationHeader>
      <View style={{ justifyContent: "center", alignContent: "center" }}>
        <Text style={[styles.title, { color: Colors.PRIMARY_2 }]}>
          PartySlate
        </Text>
        <Text style={[styles.title, { color: Colors.WHITE }]}>
          {event?.name}
        </Text>
        <Text style={[styles.desc, { color: Colors.WHITE }]}>
          {event?.location}
        </Text>
        <Text style={[styles.desc2, { color: Colors.NETURAL_2 }]}>
          {event?.location}
        </Text>
      </View>
      <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
        <CustomTable
          size={width * 0.45}
          symbolSize={width * 0.15}
          items={datasource}
        />
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "10%"
        }}
      >
        <View
          style={{
            width: "90%",
            backgroundColor: Colors.NETURAL_7,
            height: undefined,
            aspectRatio: 5.029,
            borderWidth: 0.5,
            borderColor: Colors.NETURAL_6,
            borderRadius: 6,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <View
            style={{
              width: "100%",
              // backgroundColor: "red",
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                decreaseCircleCount()
              }}
            >
              <View style={styles.center}>
                <Text style={styles.btnIcon}>-</Text>
              </View>
            </TouchableOpacity>

            <View>
              <Text style={[styles.pricenperson, { color: Colors.WHITE }]}>
                3 Person
              </Text>
              <Text style={[styles.pricenperson, { color: Colors.NETURAL_2 }]}>
                {`$${event?.price}`}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                increaseCircleCount()
              }}
            >
              <View style={styles.center}>
                <Text style={styles.btnIcon}>+</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "5%"
        }}
      >
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
          onPress={() => {
            navigation.navigate("TableConfrimScreen", { event })
          }}
        >
          NEXT
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default TableSelectScreen

let styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: Typography.FONT_SIZE_24,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    lineHeight: Typography.LINE_HEIGHT_36,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    textAlign: "center",
    marginBottom: "2%"
  },
  desc: {
    fontSize: Typography.FONT_SIZE_16,
    fontWeight: Typography.FONT_WEIGHT_500,
    lineHeight: Typography.LINE_HEIGHT_24,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    textAlign: "center",
    marginTop: "2%"
  },
  desc2: {
    fontSize: Typography.FONT_SIZE_13,
    fontWeight: Typography.FONT_WEIGHT_500,
    lineHeight: Typography.LINE_HEIGHT_20,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    textAlign: "center",
    marginTop: "1%"
  },
  btnIcon: {
    fontSize: Typography.FONT_SIZE_36,
    fontWeight: Typography.FONT_WEIGHT_500,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    textAlign: "center",
    aspectRatio: 1,
    color: Colors.NETURAL_2
  },
  pricenperson: {
    fontSize: Typography.FONT_SIZE_16,
    fontWeight: Typography.FONT_WEIGHT_500,
    lineHeight: Typography.LINE_HEIGHT_24,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    textAlign: "center"
  }
})
