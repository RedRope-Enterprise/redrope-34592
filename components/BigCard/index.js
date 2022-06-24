import React from "react"
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground
} from "react-native"
import { Colors, Typography } from "../../styles"
import BigCardBackImg from "../../assets/images/card.png"

const BigCard = ({ cardNumber, icon }) => {
  const renderBigCardBottom = (label, value) => {
    return (
      <View style={{ marginTop: "5%", maxWidth: "50%", marginRight: "25%" }}>
        <Text style={[styles.FONT_12, { color: Colors.WHITE }]}>{label}</Text>
        <Text
          numberOfLines={2}
          style={[styles.FONT_16, { color: Colors.WHITE }]}
        >
          {value}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.center}>
      <TouchableOpacity onPress={() => {}}>
        <View style={[styles.bigItemContainer]}>
          <ImageBackground
            style={[styles.full, styles.bigCardBackground]}
            source={BigCardBackImg}
          >
            <View style={styles.bigCardImage}>
              <Image
                resizeMode="center"
                style={styles.itemIcon}
                source={icon}
              ></Image>
            </View>
            <View style={{ marginLeft: "8%" }}>
              <Text style={[styles.FONT_24, { color: Colors.WHITE }]}>
                {cardNumber}
              </Text>
            </View>
            <View
              style={{
                marginHorizontal: "8%",
                marginTop: "4%",
                flexDirection: "row"
              }}
            >
              {renderBigCardBottom("Card Holder name", "Daniel Austin")}
              {renderBigCardBottom("Expiry date", "02/30")}
            </View>
          </ImageBackground>
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default BigCard

let styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  full: {
    width: "100%",
    height: "100%"
  },
  itemIcon: {
    width: "60%",
    height: undefined,
    aspectRatio: 1
  },
  bigItemContainer: {
    flexDirection: "row",
    width: "90%",
    alignItems: "center",
    backgroundColor: Colors.NETURAL_5,
    aspectRatio: 1.598,
    borderRadius: 20,
    marginBottom: "5%",
    overflow: "hidden"
  },
  bigCardBackground: {
    // alignItems: "center",
    // justifyContent: "center"
  },
  bigCardImage: {
    width: "30%",
    // justifyContent: "center",
    marginRight: "5%",
    alignItems: "center",
    alignSelf: "flex-end"
  },
  FONT_24: {
    fontSize: Typography.FONT_SIZE_24,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    lineHeight: Typography.LINE_HEIGHT_32,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    marginTop: "4%"
  },
  FONT_16: {
    fontSize: Typography.FONT_SIZE_16,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    lineHeight: Typography.LINE_HEIGHT_22,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    marginTop: "4%"
  },
  FONT_12: {
    fontSize: Typography.FONT_SIZE_12,
    fontWeight: Typography.FONT_WEIGHT_400,
    lineHeight: Typography.LINE_HEIGHT_16,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    marginTop: "4%"
  }
})
