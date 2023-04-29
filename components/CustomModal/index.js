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
  TouchableOpacity,
  Dimensions
} from "react-native"
import { Colors, Typography, Mixins } from "../../styles"

const height = Dimensions.get("window").height

const CustomModal = ({
  isVisible,
  onClose,
  text,
  description = null,
  showSuccessIcon = false
}) => {
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
          backgroundColor: Colors.BLACK_OPACITY_50,
          height: "100%",
          width: "100%",
          position: "absolute"
        }}
      />

      <View
        style={{
          // flex: 1,
          justifyContent: "center",
          backgroundColor: Colors.NETURAL_4,
          alignItems: "center",
          // height: description ? "30%" : "30%",
          width: description ? "80%" : "90%",
          alignSelf: "center",
          // marginTop: "50%",
          top: height * 0.3,
          borderRadius: 20
        }}
      >
        {showSuccessIcon && (
          <Image
            style={{ marginVertical: "5%" }}
            source={require("../../assets/images/fill-circle.png")}
          />
        )}
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text
            multiline={true}
            style={{
              fontSize: Typography.FONT_SIZE_30,
              fontFamily: Typography.FONT_FAMILY_POPPINS_BOLD,
              color: Colors.PRIMARY_1,
              textAlign: "center"
            }}
          >
            {text}
          </Text>
        </View>

        {description && (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginVertical: "5%"
            }}
          >
            <Text
              multiline={true}
              style={{
                fontSize: Typography.FONT_SIZE_13,
                fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
                color: Colors.WHITE,
                textAlign: "center",
                marginHorizontal: "5%"
              }}
            >
              {description}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={{
            backgroundColor: Colors.NETURAL_5,
            width: "100%",
            height: description || showSuccessIcon ? "20%" : "30%",
            alignItems: "center",
            justifyContent: "center",
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
