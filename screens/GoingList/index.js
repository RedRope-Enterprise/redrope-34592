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
  ScrollView
} from "react-native"
import { Button, Input, CustomModal } from "../../components"
import { Colors, Typography, Mixins } from "../../styles"
import NavigationHeader from "../../components/NavigationHeader"
import { useNavigation } from "@react-navigation/native"
import FastImage from "react-native-fast-image"


const { width, height } = Dimensions.get("window")

const GoingList = () => {
  const navigation = useNavigation()

  const [going, setGoing] = useState([])

  useEffect(() => {}, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      <NavigationHeader></NavigationHeader>
      <ScrollView>
        {going.map(item => {
          <View style={{ flexDirection: "row" }}>
              <FastImage/>
            {/* <Image source={require("")} /> */}
            <Text
              style={{
                fontSize: Typography.FONT_SIZE_13,
                fontWeight: Typography.FONT_WEIGHT_500,
                lineHeight: Typography.LINE_HEIGHT_20,
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                color: Colors.WHITE
              }}
            >
              Name
            </Text>
          </View>
        })}
      </ScrollView>
    </SafeAreaView>
  )
}

export default GoingList
