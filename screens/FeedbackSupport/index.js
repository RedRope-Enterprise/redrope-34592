import React, { useState, useEffect } from "react"
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator
} from "react-native"
import { Colors, Typography, Mixins } from "../../styles"
import NavigationHeader from "../../components/NavigationHeader"
import { Button, Input, CustomModal } from "../../components"
import { submitFeedback } from "../../services/feedbackSupport"

const FeedbackSupportScreen = () => {
  const [feedback, setFeedback] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {}, [])

  const submitPressed = async () => {
    const resp = await submitFeedback({ subject: feedback, body: message })
    if(resp){
      setFeedback("")
      setMessage("")
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
      <Text style={styles.header}>Feedback & Support</Text>

      <Input
        width={"90%"}
        onChangeText={value => setFeedback(value)}
        value={feedback}
        placeholder="Subject"
        height={Mixins.scaleHeight(40)}
        selectedBorderColor={Colors.PRIMARY_1}
      />

      <Input
        width={"90%"}
        onChangeText={value => setMessage(value)}
        value={message}
        placeholder="Message"
        height={Mixins.scaleHeight(200)}
        selectedBorderColor={Colors.PRIMARY_1}
      />
      <View style={{ flex: 1 }}></View>

      <View
        style={{
          flexDirection: "row",
          marginVertical: "5%",
          alignSelf: "flex-end"
        }}
      >
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: Colors.BUTTON_RED,
            backgroundColor: Colors.BUTTON_RED,
            borderRadius: 10,
            flex: 1,
            marginHorizontal: 15
          }}
          onPress={async () => submitPressed()}
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
            SUBMIT
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default FeedbackSupportScreen

let styles = StyleSheet.create({
  header: {
    marginHorizontal: "5%",
    fontSize: Typography.FONT_SIZE_24,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    color: Colors.WHITE,
    marginVertical: "10%"
  }
})
