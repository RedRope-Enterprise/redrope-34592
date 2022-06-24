import React, { useState, useEffect, useRef } from "react"
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
  ScrollView,
  FlatList
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
import Carousel, { Pagination } from "react-native-snap-carousel"
import ImgSample from "../../assets/images/sampleBack.png"
import LocationImg from "../../assets/images/table_select/location.png"
import CalendarImg from "../../assets/images/table_select/calendar.png"
import ImgArrow from "../../assets/images/arrow.png"

const sliderWidth = Dimensions.get("window").width

const EventMenuScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const carouselRef = useRef()
  const {event} = route?.params

  const [datasource, setDatasource] = useState(event?.event_images)
  const [activeDatasourceIndex, setActiveDatasourceIndex] = useState(0)
  const [data, setData] = useState([])
  const [reloadList, setReloadList] = useState(Date.now())


  useEffect(() => {
    let arr = []

    arr.push({
      title: "Side Cabanas",
      desc: "Cabana located on sides of venue. Food and beverage minimum. Deposit required",
      isSoldOut: true
    })
    arr.push({
      title: "Garden Tables",
      desc: "Table in the garden area on sides of venue. Food and beverage minimum. Deposit required.",
      isSoldOut: true
    })
    arr.push({
      title: "Side Cabanas 907",
      desc: "Table in the garden area on sides of venue. Food and beverage minimum. Deposit required.",
      isSoldOut: false
    })

    setData(arr)
  }, [])

  const renderCarouselItem = ({ item, index }) => {
    return (
      <View style={{ width: "100%", height: undefined, aspectRatio: 1.56 }}>
        <Image
          resizeMode="cover"
          style={{ width: "100%", height: "100%" }}
          source={{uri : item.image}}
        ></Image>
      </View>
    )
  }

  const pagination = () => {
    return (
      <Pagination
        dotsLength={datasource.length}
        activeDotIndex={activeDatasourceIndex}
        containerStyle={{
          backgroundColor: "rgba(0, 0, 0, 0)",
          paddingVertical: 0,
          top: -20
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: "rgba(255, 255, 255, 0.92)"
        }}
        inactiveDotScale={1}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.6}
      />
    )
  }

  const renderDetailItem = item => {
    return (
      <View style={styles.center}>
        <View style={styles.itemContainer}>
          <View style={styles.itemImgContainer}>
            <Image style={styles.itemIcon} source={item.image}></Image>
          </View>
          <View
            style={{
              flex: 1
            }}
          >
            <Text style={[styles.desc, { color: Colors.WHITE }]}>
              {item.title}
            </Text>
            <Text style={[styles.desc2, { color: Colors.NETURAL_2 }]}>
              {item.desc}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  const changeExpansion = index => {
    let expandNew = true
    let oldExpanded = datasource.findIndex(element => {
      return element.isExpanded == true
    })
    if (oldExpanded == index) {
      expandNew = false
    }
    datasource.forEach(element => {
      element.isExpanded = false
    })
    if (expandNew) {
      datasource[index].isExpanded = true
    }

    setReloadList(Date.now())
  }

  const renderMainDetails = (str, color = Colors.WHITE, hidebar = false) => {
    return (
      <View style={{ flexDirection: "row" }}>
        <Text style={[styles.Font16, { color: color }]}>{str}</Text>
        {!hidebar && (
          <View
            style={{
              borderColor: Colors.WHITE,
              borderWidth: 1,
              marginHorizontal: 10
            }}
          ></View>
        )}
      </View>
    )
  }

  const renderDataItem = ({ index, item }) => {
    return (
      <View style={styles.center}>
        <View style={styles.dataItemContainer}>
          <View style={[styles.center, { width: "100%" }]}>
            <TouchableOpacity
              style={styles.dataHeaderContainer}
              onPress={() => 
                navigation.navigate("TableSelect", { event : route.params?.event})
                // changeExpansion(index)
              }
            >
              <Text style={[styles.dataTitle, { color: Colors.PRIMARY_1 }]}>
                {item.title}
              </Text>
              {!item.isSoldOut && (
                <View style={styles.arrowContainer}>
                  <Image
                    style={[
                      styles.arrowIcon,
                      {
                        tintColor: Colors.WHITE,
                        transform: [{ rotate: "270deg" }]
                      }
                    ]}
                    source={ImgArrow}
                  ></Image>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", marginBottom: '3%' }}>
            {renderMainDetails("10 Guest")}
            {renderMainDetails("$550.00 minimum")}
            {item.isSoldOut && renderMainDetails("SOLD OUT", Colors.PRIMARY_2, true)}
          </View>
          <View>
            <Text style={[styles.Font14, { color: Colors.NETURAL_2 }]}>
              {item.desc}
            </Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      <ScrollView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
        <View style={styles.center}>
          <Carousel
            ref={carouselRef}
            data={datasource}
            renderItem={renderCarouselItem}
            onSnapToItem={index => setActiveDatasourceIndex(index)}
            sliderWidth={sliderWidth}
            itemWidth={sliderWidth}
          />
          <NavigationHeader
            showLeftBtn1={true}
            showLeftBtn2={true}
          ></NavigationHeader>
          {pagination()}
        </View>
        <View style={styles.container}>
          <Text style={styles.title}>{event?.title}</Text>
        </View>
        <View>
          {renderDetailItem({
            image: CalendarImg,
            title: event?.start_date,
            desc: event?.start_date
          })}
          {renderDetailItem({
            image: LocationImg,
            title: event?.location,
            desc: event?.location
          })}
        </View>
        <View style={[styles.center, { flex: 1, marginTop: "6%" }]}>
          <FlatList
            style={{ width: "100%" }}
            data={data}
            renderItem={renderDataItem}
            extraData={reloadList}
            keyExtractor={(item, index) => index}
          />
        </View>
      </ScrollView>
    </View>
  )
}

export default EventMenuScreen

let styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    marginHorizontal: "6%"
  },
  title: {
    fontSize: Typography.FONT_SIZE_24,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    lineHeight: Typography.LINE_HEIGHT_36,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    color: Colors.WHITE,
    marginTop: "4%",
    marginBottom: "2%"
  },
  itemContainer: {
    flexDirection: "row",
    width: "90%",
    paddingTop: "6%",
    paddingBottom: "2%"
  },
  dataItemContainer: {
    width: "90%",
    paddingTop: "2%",
    paddingBottom: "6%",
    // paddingVertical: "2%",
    borderTopColor: Colors.NETURAL_4,
    borderTopWidth: 2
  },
  itemImgContainer: {
    width: "15%",
    height: undefined,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.PRIMARY_1_OPACITY_10,
    borderRadius: 12,
    marginRight: "6%"
  },
  itemIcon: {
    width: "60%",
    height: undefined,
    aspectRatio: 1
  },
  desc: {
    fontSize: Typography.FONT_SIZE_16,
    fontWeight: Typography.FONT_WEIGHT_500,
    lineHeight: Typography.LINE_HEIGHT_24,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
  },
  desc2: {
    fontSize: Typography.FONT_SIZE_13,
    fontWeight: Typography.FONT_WEIGHT_500,
    lineHeight: Typography.LINE_HEIGHT_20,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    marginTop: "1%"
  },
  dataHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: "5%"
  },
  dataTitle: {
    fontSize: Typography.FONT_SIZE_14,
    fontWeight: Typography.FONT_WEIGHT_600,
    lineHeight: Typography.LINE_HEIGHT_20,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
  },
  Font14: {
    fontSize: Typography.FONT_SIZE_13,
    fontWeight: Typography.FONT_WEIGHT_500,
    lineHeight: Typography.LINE_HEIGHT_20,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
  },
  Font16: {
    fontSize: Typography.FONT_SIZE_16,
    fontWeight: Typography.FONT_WEIGHT_400,
    lineHeight: Typography.LINE_HEIGHT_24,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
  },
  arrowIcon: {
    width: "100%",
    height: "100%"
  },
  arrowContainer: {
    width: "5%",
    height: undefined,
    aspectRatio: 1.68
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
