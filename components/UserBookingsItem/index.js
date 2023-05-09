import React, { useState, useEffect, useCallback } from "react"
import {
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ImageBackground
} from "react-native"
import { Colors, Typography, Mixins } from "../../styles"
import LinearGradient from "react-native-linear-gradient"
import FastImage from "react-native-fast-image"

const { width, height } = Dimensions.get("window")

const UserBookingsItem = props => {
  const { event, onPress } = props

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        marginBottom: "4%",
        backgroundColor: Colors.NETURAL_3
      }}
    >
      <View
        style={{
          width: "100%",
          borderRadius: 10,
          backgroundColor: Colors.NETURAL_5,
          flexDirection: "row"
        }}
      >
        <View style={{}}>
          <FastImage
            style={{
              width: 90,
              height: Mixins.scaleHeight(150),
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10
            }}
            source={{
              uri: event?.event_images ? event?.event_images[0]?.image : ""
            }}
          />
        </View>
        <View style={{ marginHorizontal: "5%", flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              marginTop: "5%",
              alignItems: "center"
            }}
          >
            <Text
              style={{
                fontSize: Typography.FONT_SIZE_24,
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                fontWeight: Typography.FONT_WEIGHT_BOLD,
                color: Colors.WHITE,
                flex: 1
              }}
            >
              {event?.event_title?.length > 12
                ? event?.event_title.slice(0, 11) + "..."
                : event?.event_title}
            </Text>
            {/* {(event?.event_price || event?.price) && (
              <Text
                style={{
                  fontSize: Typography.FONT_SIZE_18,
                  fontFamily: Typography.FONT_FAMILY_POPPINS_MEDIUM,
                  fontWeight: Typography.FONT_WEIGHT_BOLD,
                  color: Colors.PRIMARY_1
                }}
              >{`$${event?.event_price || event?.price}`}</Text>
            )} */}
          </View>

          <View style={{ flexDirection: "row", marginTop: "2%" }}>
            <View
              style={{
                borderWidth: 1,
                borderColor: Colors.PRIMARY_1,
                borderRadius: 10,
                marginRight: "3%",
                height: 30
              }}
            >
              <Text style={{ color: Colors.PRIMARY_1, margin: 5 }}>
                {event?.event_categories[0]?.name}
              </Text>
            </View>

            <View
              style={{
                borderColor: Colors.WHITE,
                borderRadius: 10,
                backgroundColor: Colors.NETURAL_4,
                height: 30,
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {(event?.date || event?.start_date) && (
                <Text
                  style={{
                    fontSize: Typography.FONT_SIZE_10,
                    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                    fontWeight: Typography.FONT_WEIGHT_500,
                    color: Colors.WHITE,
                    margin: 5
                  }}
                >
                  {event.date || event?.start_date}
                </Text>
              )}
            </View>

            {event?.status && (
              <View
                style={{
                  borderColor: Colors.WHITE,
                  borderRadius: 10,
                  backgroundColor: Colors.NETURAL_4,
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "3%"
                }}
              >
                <Text
                  style={{
                    fontSize: Typography.FONT_SIZE_10,
                    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                    fontWeight: Typography.FONT_WEIGHT_500,
                    color: Colors.WHITE,
                    marginHorizontal: 5
                  }}
                >
                  {event?.status}
                </Text>
              </View>
            )}
          </View>

          {!global?.user?.event_planner && (
            <View style={{ flexDirection: "row", marginVertical: "5%" }}>
              {event?.going.map((goingPerson, index) => {
                return (
                  <View
                    style={{
                      borderRadius: 1000,
                      borderWidth: 1,
                      overflow: "hidden",
                      borderColor: Colors.WHITE,
                      left: index === 0 ? 0 : -10 * index,
                      zIndex: index === 0 ? 10000 : 1 * -index
                    }}
                  >
                    <FastImage
                      style={{ width: 32, height: 32 }}
                      source={{ uri: goingPerson?.profile_picture }}
                    />
                  </View>
                )
              })}
              {/* <Image style={{width : 20, height : 20}}source={require("../../assets/eventDetails/Group.png")} /> */}
              <Text
                style={{
                  marginLeft: "5%",
                  alignSelf: "center",
                  fontSize: Typography.FONT_SIZE_16,
                  fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                  fontWeight: Typography.FONT_WEIGHT_500,
                  color: Colors.PRIMARY_1
                }}
              >
                {`${event?.going_count} going`}
              </Text>
            </View>
          )}

          <View
            style={{
              alignSelf: "center",
              marginVertical: "5%",
              width: "100%",
              borderBottomColor: Colors.GREY,
              borderBottomWidth: 2,
              opacity: 0.2
            }}
          />
          <View
            style={{
              marginBottom: "5%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <Image
                style={{ width: 12, height: 12 }}
                source={require("../../assets/images/table_select/location.png")}
              />

              <Text
                style={{
                  fontSize: Typography.FONT_SIZE_12,
                  fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                  fontWeight: Typography.FONT_WEIGHT_400,
                  color: Colors.WHITE,
                  marginLeft: 5
                }}
              >
                {event.location}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default UserBookingsItem
