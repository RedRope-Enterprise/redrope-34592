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
import { Button, Input, CustomModal } from "../../components"
import { Colors, Typography, Mixins } from "../../styles"
import NavigationHeader from "../../components/NavigationHeader"
import { useNavigation } from "@react-navigation/native"
import { useRoute } from "@react-navigation/native"

import {
  getDataStorage,
  setDataStorage,
  clearStorage
} from "../../utils/storage"

const { width, height } = Dimensions.get("window")

const CategoriesSelectionScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()

  const { onSubmit } = route?.params


  const [categories, setCategories] = useState([])
  const [reRender, setRender] = useState(Date.now())
  const [lastElement, setLastElement] = useState(null)

  useEffect(() => {
    if (categories.length > 0) {
      const total = categories.length
      if (total % 2 != 0) {
        setLastElement(categories[categories.length - 1])
        setRender(Date.now())
      }
    }
  }, [categories])

  useEffect(() => {
    if (categories.length == 0)
      setCategories([
        { name: "Yatch Parties", isEnabled: true, id: 1},
        { name: "Bottle Services", isEnabled: true, id: 2 },
        { name: "Pool Parties", isEnabled: true, id: 3 },
      ])
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      <NavigationHeader></NavigationHeader>
      <Text
        style={{
          marginVertical: "10%",
          marginHorizontal: "5%",
          color: Colors.WHITE,
          fontSize: Typography.FONT_SIZE_24,
          fontWeight: Typography.FONT_WEIGHT_BOLD,
          fontFamily: Typography.FONT_FAMILY_POPPINS_MEDIUM
        }}
      >
        Categories
      </Text>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          flex: 1,
          justifyContent: "center"
        }}
        key={reRender}
      >
        {categories?.map((element, i) => (
          <TouchableOpacity
            onPress={() => {
              let temp = categories
              temp[i].isEnabled = !temp[i].isEnabled
              temp[i].updatedAt = Date.now()

              setCategories(temp)
              setRender(Date.now())
            }}
            key={element.updatedAt}
            style={{
              width: categories[i].id == lastElement?.id ? "94%" : "44%",
              alignItems: "center",
              marginHorizontal: 10,
              backgroundColor: element.isEnabled
                ? "#3f3720"
                : Colors.NETURAL_4,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: element.isEnabled ? Colors.PRIMARY_1 : "#535252",
              marginBottom: 10
            }}
          >
            <Text
              style={{
                margin: 10,
                fontSize: Typography.FONT_SIZE_14,
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                color: element.isEnabled ? Colors.PRIMARY_1 : Colors.WHITE
              }}
            >
              {element.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ flexDirection: "row", marginBottom: "5%" }}>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: Colors.BUTTON_RED,
            borderRadius: 10,
            flex: 1,
            marginHorizontal: 15
          }}
          onPress={() => {
            categories.forEach(catg => {
              catg.isEnabled = false
            })
            setRender(Date.now())
          }}
        >
          <Text
            style={{
              color: Colors.WHITE,
              fontSize: Typography.FONT_SIZE_14,
              fontFamily: Typography.FONT_FAMILY_POPPINS_MEDIUM,
              margin: 15,
              textAlign: "center",
              fontWeight: Typography.FONT_WEIGHT_BOLD
            }}
          >
            RESET
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: Colors.BUTTON_RED,
            backgroundColor: Colors.PRIMARY_2,
            borderRadius: 10,
            flex: 1,
            marginHorizontal: 15
          }}
          onPress={async () => {
            onSubmit(categories)
            navigation.goBack()
          }}
        >
          <Text
            style={{
              color: Colors.WHITE,
              fontSize: Typography.FONT_SIZE_14,
              fontFamily: Typography.FONT_FAMILY_POPPINS_MEDIUM,
              margin: 15,
              textAlign: "center",
              fontWeight: Typography.FONT_WEIGHT_BOLD
            }}
          >
            APPLY
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default CategoriesSelectionScreen
