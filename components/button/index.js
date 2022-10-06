import React from "react"
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from "react-native"
import { Typography, Colors, Mixins } from "../../styles"

const width = Dimensions.get("window").width

const Button = ({
  disabled = false,
  btnWidth = width / 1.1,
  loading = false,
  shadow = false,
  loadingColor = false,
  children,
  onPress,
  type = "filled",
  borderType = null,
  bordered = false,
  backgroundColor = Colors.APP_MAIN_2,
  textColor = Colors.WHITE,
  textFontSize = Typography.FONT_SIZE_16,
  textFontWeight = Typography.FONT_WEIGHT_REGULAR,
  textStyle = null,
  size = "large",
  height = 45,
  borderColor = Colors.BLACK,
  borderedRadius = 10
}) => {
  const large = btnWidth
  const small = width / 2
  const btnSize = size === "large" ? large : small
  const btnBgColor = type === "filled" ? backgroundColor : "transparent"
  const btnTextColor = type === "filled" ? textColor : Colors.BLACK
  const btnBorderRadius = bordered ? borderedRadius : 5

  const containerCommonStyle = {
    justifyContent: "center",
    alignItems: "center",
    height: Mixins.scaleHeight(height),
    backgroundColor: disabled ? "#989898" : btnBgColor,
    width: btnSize,
    borderRadius: btnBorderRadius,
    ...(shadow ? Mixins.boxShadow(Colors.BLACK) : [])
  }

  const textCommonStyle = {
    ...textStyle,
    color: disabled ? Colors.WHITE : btnTextColor,
    fontSize: textFontSize,
    textAlign: "center",
    fontWeight: textFontWeight
  }

  const border = borderType === "outlined" && {
    borderColor: borderColor,
    borderWidth: disabled ? 1 : 1
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} disabled={disabled}>
      <View style={[containerCommonStyle, border]}>
        {loading ? (
          <ActivityIndicator
            color={loadingColor ? loadingColor : Colors.WHITE}
          />
        ) : (
          <Text style={[textCommonStyle]}> {children} </Text>
        )}
      </View>
    </TouchableOpacity>
  )
}

export default Button
