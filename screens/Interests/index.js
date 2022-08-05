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
import {
  getDataStorage,
  setDataStorage,
  clearStorage
} from "../../utils/storage"

import {getCategories, getIntrests} from "../../services/events"
import {updateUser} from "../../services/user"


const { width, height } = Dimensions.get("window")

const InterestScreen = () => {
  const navigation = useNavigation()

  const [about, setAbout] = useState("")
  const [userInterests, setUserInterests] = useState([])
  const [reRender, setRender] = useState(Date.now())

  useEffect(() => {
    getUserInterests()
  }, [])

  const getUserInterests = async () => {
    // const data = await getDataStorage("@user_interests")
    const data = await getIntrests()
    if (data) {
      setUserInterests(data.results)
    }
  }

  const getInterestsIds = async () => {
    let result = []
    userInterests?.forEach(element => {
      if(element.isEnabled)
        result.push(element.id)
    });

    return result
  }

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
        Interests
      </Text>

      <View
        style={{ flexDirection: "row", flexWrap: "wrap", flex: 1 }}
        key={reRender}
      >
        {userInterests?.map((element, i) => (
          <TouchableOpacity
            onPress={() => {
              let temp = userInterests
              temp[i].isEnabled = !temp[i].isEnabled
              temp[i].updatedAt = Date.now()

              setUserInterests(temp)
              setRender(Date.now())
            }}
            key={element.updatedAt}
            style={{
              alignItems: "center",
              marginHorizontal: 10,
              backgroundColor: element.isEnabled ? "#3f3720" : Colors.NETURAL_4,
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
          onPress={async() =>{  
            const likes =  await getInterestsIds()
            let resp = await updateUser({interests:likes})
            console.log("resp in ", resp)
            await setDataStorage("@user", JSON.stringify(resp))
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

export default InterestScreen
