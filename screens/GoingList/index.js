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
import { useNavigation, useRoute } from "@react-navigation/native"
import FastImage from "react-native-fast-image"

const { width, height } = Dimensions.get("window")

const GoingList = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const [going, setGoing] = useState(route.params.users)

  useEffect(() => {}, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      <NavigationHeader></NavigationHeader>
      <ScrollView style={{marginHorizontal: "5%", marginTop: "10%"}}>
        {going.map(item => (
          <View style={{ flexDirection: "row", alignItems: "center", marginVertical: "2%"}}>
            <View
              style={{
                borderRadius: 1000,
                borderWidth: 1,
                overflow: "hidden",
                borderColor: Colors.WHITE
              }}
            >
              <FastImage
                style={{ width: 50, height: 50 }}
                source={{ uri: item.profile_picture }}
              />
            </View>
            <Text
              style={{
                marginLeft: "5%",
                fontSize: Typography.FONT_SIZE_13,
                fontWeight: Typography.FONT_WEIGHT_BOLD,
                lineHeight: Typography.LINE_HEIGHT_20,
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                color: Colors.WHITE
              }}
            >
              {item.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default GoingList
