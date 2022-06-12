import { useNavigation } from "@react-navigation/native"
import React, { useEffect } from "react"
import {
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  Modal,
  Text,
  TouchableOpacity
} from "react-native"
import { Colors, Typography, Mixins } from "../../styles"

const CustomImageModal = ({ isVisible, onClose, text, image }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View
        style={{
          width: "90%",
          justifyContent: "center",
          backgroundColor: Colors.NETURAL_4,
          alignItems: "center",
          alignSelf: "center",
          marginTop: "50%",
          borderRadius: 20
        }}
      >
        <View
          style={{
            // flex: 1,
            alignItems: "center",
            justifyContent: "center",
            height: undefined,
            aspectRatio: 1.391,
            width: "100%"
          }}
        >
          <Image
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
            source={image}
          ></Image>
        </View>
        <View style={{ width: "80%" }}>
          <Text
            style={{
              fontSize: Typography.FONT_SIZE_13,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              color: Colors.PRIMARY_1,
              textAlign: "center",
              marginBottom: "8%"
            }}
          >
            {text}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.PRIMARY_1_OPACITY_20,
            width: "100%",
            height: undefined,
            aspectRatio: 4.08,
            alignItems: "center",
            justifyContent: "center",
            top: 0,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20
          }}
          onPress={onClose}
        >
          <Text
            style={{
              fontSize: Typography.FONT_SIZE_14,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              color: Colors.WHITE,
              textAlign: "center",
              fontWeight: Typography.FONT_WEIGHT_600
            }}
          >
            OK
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export default CustomImageModal
