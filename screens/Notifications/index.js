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
  FlatList
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
  const [notifications, setNotifications] = useState([])

  const NotificationItem = ({ notification }) => {
    return (
      <TouchableOpacity style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            marginHorizontal: "5%",
            marginVertical: "3%"
          }}
        >
          <Image style={{}} source={notification.userImage} />

          <View
            style={{
              marginLeft: "5%",
              flex: 1,
              justifyContent: "center"
              // alignItems: "center"
            }}
          >
            <Text
              style={{
                color: Colors.WHITE,
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                fontSize: Typography.FONT_SIZE_13,
                fontWeight: Typography.FONT_WEIGHT_500,
                textAlign: "left",
                lineHeight: 25
              }}
              multiline={true}
            >
              {notification.text1}
              <Text style={{ color: Colors.PRIMARY_1 }}>
                {notification.text2}
              </Text>
              <Text>{notification.text3}</Text>
            </Text>
          </View>
        </View>

        <View
          style={{
            alignSelf: "center",
            flex: 1,
            marginVertical: "3%",
            width: "90%",
            borderBottomColor: Colors.GREY,
            borderBottomWidth: 2,
            opacity: 0.2
          }}
        />
      </TouchableOpacity>
    )
  }

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

          <TouchableOpacity
            onPress={() =>
              setNotifications([
                {
                  key: 1,
                  text1: "Janet Jones  is interested to go to",
                  text2: " venue.event",
                  text3: " with you",
                  userImage: require("../../assets/notifications/user1.png")
                },
                {
                  key: 2,
                  text1: "Mark Kubic is interested to go to",
                  text2: " Boat tour",
                  text3: " with you",
                  userImage: require("../../assets/notifications/user2.png")
                },
                {
                  key: 3,
                  text1: "Jacob Jones  is interested to go to",
                  text2: " Beach party",
                  text3: " with you",
                  userImage: require("../../assets/notifications/user3.png")
                },
                {
                  key: 4,
                  text1: "Group of people for",
                  text2: "  Justin Timberlake concert",
                  text3: " is gathered click here to book",
                  userImage: require("../../assets/notifications/group_user.png")
                }
              ])
            }
          >
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
          </TouchableOpacity>
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
        // <SwipeListView
        //   style={{ marginTop: 20 }}
        //   data={notifications}
        //   renderItem={(data, rowMap) => (
        //     <TouchableOpacity>
        //       <View style={{}}>
        //         <Text style={{ color: Colors.WHITE }}>
        //           I am {data.item.text} in a SwipeListView
        //         </Text>
        //       </View>
        //     </TouchableOpacity>
        //   )}
        //   renderHiddenItem={(data, rowMap) => (
        //     <View style={{}}>
        //       <Text style={{ color: Colors.WHITE }}>Left</Text>
        //       <Text style={{ color: Colors.WHITE }}>Right</Text>
        //     </View>
        //   )}
        //   leftOpenValue={0}
        //   initialRightActionState={true}
        //   rightOpenValue={-100}
        //   stopLeftSwipe={10}
        //   // disableLeftSwipe={true}
        //   disableRightSwipe={false}
        //   previewFirstRow={true}
        //   onRightAction={value => console.log(value)}
        // />
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => {
              if (notifications.length === 0) {
                setNotifications([
                  {
                    key: 1,
                    text1: "Janet Jones  is interested to go to",
                    text2: " venue.event",
                    text3: " with you",
                    userImage: require("../../assets/notifications/user1.png")
                  },
                  {
                    key: 2,
                    text1: "Mark Kubic is interested to go to",
                    text2: " Boat tour",
                    text3: " with you",
                    userImage: require("../../assets/notifications/user2.png")
                  },
                  {
                    key: 3,
                    text1: "Jacob Jones  is interested to go to",
                    text2: " Beach party",
                    text3: " with you",
                    userImage: require("../../assets/notifications/user3.png")
                  },
                  {
                    key: 4,
                    text1: "Group of people for",
                    text2: "  Justin Timberlake concert",
                    text3: " is gathered click here to book",
                    userImage: require("../../assets/notifications/group_user.png")
                  }
                ])
              } else {
                setNotifications([])
              }
            }}
          >
            <Text
              style={{
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                fontSize: Typography.FONT_SIZE_24,
                fontWeight: Typography.FONT_WEIGHT_BOLD,
                color: Colors.WHITE,
                margin: "5%"
              }}
            >
              Notifications
            </Text>
          </TouchableOpacity>
          <FlatList
            style={{ flex: 1 }}
            // contentContainerStyle={{marginHorizontal: "10%", flex:1  }}
            numColumns={1}
            data={notifications}
            extraData={notifications}
            renderItem={({ item }) => <NotificationItem notification={item} />}
            keyExtractor={(item, index) => index}
          />
        </View>
      )}
    </SafeAreaView>
  )
}

export default NotificationScreen
