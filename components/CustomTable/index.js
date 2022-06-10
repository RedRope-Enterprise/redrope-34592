import React, { useMemo } from "react"
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image
} from "react-native"
import { Typography, Colors, Mixins } from "../../styles"
import logo from "../../assets/images/redropelogo.png"

export default function CustomTable(props) {
  const { size, symbolSize, items } = props

  const radius = useMemo(() => size / 2, [size])
  const iconPosition = useMemo(
    () => radius + symbolSize / 1.5,
    [radius, symbolSize]
  )
  const iconOffset = useMemo(
    () => radius - symbolSize / 2,
    [radius, symbolSize]
  )

  const iconsDegree = 45 //useMemo(() => 360 / items.length, [items])

  const iconsList = useMemo(
    () =>
      items.map((item, idx) => {
        const angle = idx * iconsDegree + (90 - items.length * 45 + 45)
        let x =
          iconPosition * Math.cos((Math.PI * 2 * angle) / 360) + iconOffset - 5
        let y =
          iconPosition * Math.sin((Math.PI * 2 * angle) / 360) + iconOffset - 5

        return (
          <View
            key={`icon_${idx}`}
            style={[
              { left: x, top: y, width: symbolSize, height: symbolSize },
              s.symbol
            ]}
          >
            {/* <Text>{`${idx}`}</Text> */}
          </View>
        )
      }),
    [items, iconPosition]
  )

  return (
    <View
      style={[
        s.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2
        }
      ]}
    >
      <Image
        resizeMode="contain"
        style={{ width: "80%", height: "80%", position: "absolute" }}
        source={logo}
      />
      {iconsList}
    </View>
  )
}

const s = StyleSheet.create({
  circle: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    borderColor: Colors.NETURAL_6
  },
  symbol: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 1000,
    backgroundColor: Colors.PRIMARY_1_OPACITY_20,
    borderWidth: 1,
    borderColor: Colors.PRIMARY_1
  }
})
