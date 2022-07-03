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
import { BlurView } from "@react-native-community/blur"
import ImgDanger from "../../assets/images/danger.png"

const DeleteModal = ({ isVisible, onClose, onYes }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
      onYes={onClose}
    >
      <BlurView
        style={styles.absolute}
        blurType="light"
        blurAmount={10}
        reducedTransparencyFallbackColor={Colors.NETURAL_3}
      />
      <View style={styles.mainContainer}>
        <View style={styles.imgContainer}>
          <Image
            resizeMode="cover"
            style={{ width: "100%", height: "100%" }}
            source={ImgDanger}
          ></Image>
        </View>
        <View
          style={{
            marginTop: "5%",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Text style={[styles.FONT_24, { color: Colors.NETURAL_8 }]}>
            Are you sure?
          </Text>
          <Text
            style={[
              styles.FONT_16,
              { color: Colors.WHITE, marginVertical: "5%" }
            ]}
          >
            You are deleting your credit card
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            borderTopWidth: 1,
            borderTopColor: Colors.WHITE_OPACITY_50
          }}
        >
          <TouchableOpacity
            style={[
              styles.btnToucable,
              { borderRightWidth: 1, borderRightColor: Colors.WHITE_OPACITY_50 }
            ]}
            onPress={() => {
              if (onClose) onClose()
            }}
          >
            <Text style={styles.btnText}>NO</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btnToucable,
              {
                backgroundColor: Colors.PRIMARY_2_OPACITY_10
              }
            ]}
            onPress={() => {
              if (onYes) onYes()
            }}
          >
            <Text style={[styles.btnText, { color: Colors.BUTTON_RED }]}>
              YES - DELETE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

export default DeleteModal
const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  imgContainer: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: undefined,
    aspectRatio: 1.155,
    width: "40%",
    marginTop: "10%"
  },
  mainContainer: {
    width: "90%",
    justifyContent: "center",
    backgroundColor: Colors.NETURAL_5,
    alignItems: "center",
    alignSelf: "center",
    marginTop: "50%",
    borderRadius: 10,
    overflow: "hidden"
  },
  btnToucable: {
    flex: 1,
    height: undefined,
    aspectRatio: 2.07,
    alignItems: "center",
    justifyContent: "center",
    top: 0
  },
  btnText: {
    fontSize: Typography.FONT_SIZE_14,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    color: Colors.WHITE,
    textAlign: "center",
    fontWeight: Typography.FONT_WEIGHT_600
  },
  FONT_24: {
    fontSize: Typography.FONT_SIZE_24,
    fontWeight: Typography.FONT_WEIGHT_600,
    lineHeight: Typography.LINE_HEIGHT_32,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
  },
  FONT_16: {
    fontSize: Typography.FONT_SIZE_16,
    fontWeight: Typography.FONT_WEIGHT_400,
    lineHeight: Typography.LINE_HEIGHT_24,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR
  }
})
