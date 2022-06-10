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
import {
  getDataStorage,
  setDataStorage,
  clearStorage
} from "../../utils/storage"

import { useSelector, useDispatch } from "react-redux"
import { unwrapResult } from "@reduxjs/toolkit"
const { width, height } = Dimensions.get("window")
import { SwipeListView } from "react-native-swipe-list-view"

const NotificationScreen = () => {
  const navigation = useNavigation()
  const [notifications, setNotifications] = useState([{ key: 20, tex: "2222" }])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      {notifications.length === 0 && (
        <View
          style={{ alignItems: "center", justifyContent: "center", flex: 1 }}
        >
          <Image
            style={{
              width: Mixins.scaleWidth(156),
              height: Mixins.scaleHeight(170)
            }}
            resizeMode="contain"
            source={require("../../assets/images/NoNotification.png")}
          />

          <Text
            style={{
              fontSize: Typography.FONT_SIZE_16,
              fontWeight: Typography.FONT_WEIGHT_600,
              fontFamily: Typography.FONT_FAMILY_POPPINS_LIGHT,
              color: Colors.WHITE
            }}
          >
            No Notifications
          </Text>
          <Text
            style={{
              fontSize: Typography.FONT_SIZE_14,
              fontWeight: Typography.FONT_WEIGHT_400,
              fontFamily: Typography.FONT_FAMILY_POPPINS_LIGHT,
              color: Colors.WHITE,
              marginVertical: "5%",
              marginHorizontal: "7.5%",
              opacity: 0.6
            }}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do
            eiusmod tempor
          </Text>
        </View>
      )}

      {notifications.length > 0 && (
        <SwipeListView
        style={{marginTop: 20}}
          data={notifications}
          renderItem={(data, rowMap) => (
            <TouchableOpacity>
              <View style={{}}>
                <Text style={{ color: Colors.WHITE }}>
                  I am {data.item.text} in a SwipeListView
                </Text>
              </View>
            </TouchableOpacity>
          )}
          renderHiddenItem={(data, rowMap) => (
            <View style={{}}>
              <Text style={{color: Colors.WHITE}}>Left</Text>
              <Text style={{color: Colors.WHITE}}>Right</Text>
            </View>
          )}
          leftOpenValue={0}
          initialRightActionState={true}
          rightOpenValue={-100}
          stopLeftSwipe={10}
          // disableLeftSwipe={true}
          disableRightSwipe={false}
          previewFirstRow={true}
          onRightAction={value => console.log(value)}
        />
      )}
    </SafeAreaView>
  )
}

export default NotificationScreen
