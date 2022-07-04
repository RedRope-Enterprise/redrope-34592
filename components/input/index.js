import React, { useState } from "react"
import { Dimensions, TextInput, View, Text } from "react-native"
import { Colors, Typography, Mixins } from "../../styles"

const width = Dimensions.get("window").width

const Input = props => {
  const {
    iconLeft = null,
    iconRight = null,
    error = "",
    iconHighlighted = null,
    height = null,
    selectedBorderColor = Colors.WHITE,
    isMultiLine = false
  } = props
  const large = !props.width ? width / 1.1 : props.width
  const [isFocused, setIsFocused] = useState(false)

  return (
    <>
      <View
        style={{
          marginTop: Mixins.scaleSize(5),
          marginBottom: Mixins.scaleSize(10),

          flexDirection: "row",
          alignItems: "center",
          height: height,
          width: large,
          backgroundColor: Colors.NETURAL_4,
          borderRadius: 5,
          borderTopWidth: isFocused ? 1 : 1,
          borderRightWidth: isFocused ? 1 : 1,
          borderLeftWidth: isFocused ? 1 : 1,
          borderBottomWidth: 1,
          borderColor: isFocused ? selectedBorderColor : Colors.BORDER,

          // ...Mixins.boxShadow(Colors.GRAY_MEDIUM)
        }}
      >
        {!isFocused && iconLeft && (
          <View
            style={{
              flex: 0.15,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {iconLeft}
          </View>
        )}

        {isFocused && iconHighlighted && (
          <View
            style={{
              flex: 0.15,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {iconHighlighted}
          </View>
        )}

        <TextInput
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          underlineColorAndroid="transparent"
          style={{
            color: Colors.WHITE,
            paddingLeft: iconLeft ? 0 : 6,
            flex: iconLeft ? (iconRight ? 0.8 : 0.8) : 1,
            fontSize: Typography.FONT_SIZE_16,
            fontWeight: Typography.FONT_WEIGHT_REGULAR,
            fontFamily: Typography.FONT_FAMILY_POPPINS_LIGHT,
            marginVertical: "3%",
            alignSelf: "center"
          }}
          multiline={isMultiLine}
          placeholderTextColor={Colors.NETURAL_2}
        />
        {iconRight && (
          <View
            style={{
              flex: 0.2,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {iconRight}
          </View>
        )}
      </View>
      {!!error && (
        <Text
          style={{
            textAlign: "center",
            fontSize: Typography.FONT_SIZE_11,
            color: Colors.RED,
            fontFamily: Typography.FONT_FAMILY_POPPINS_LIGHT
          }}
        >
          {error}
        </Text>
      )}
    </>
  )
}

export default Input
