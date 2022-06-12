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

const CustomModal = ({ isVisible, onClose, text }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View
        style={{
          //   flex: 1,
          justifyContent: "center",
          backgroundColor: Colors.NETURAL_4,
          alignItems: "center",
          height: "30%",
          width: "90%",
          alignSelf: "center",
          marginTop: "50%",
          borderRadius: 20
        }}
      >
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text
            style={{
              fontSize: Typography.FONT_SIZE_24,
              fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
              color: Colors.PRIMARY_1,
              textAlign: "center"
            }}
          >
            {text}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.NETURAL_5,
            width: "100%",
            height: "30%",
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

export default CustomModal
