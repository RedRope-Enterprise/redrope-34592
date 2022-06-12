import { Dimensions, PixelRatio } from "react-native"
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';


const WINDOW_WIDTH = Dimensions.get("window").width
const guidelineBaseWidth = 375

export const scaleSize = size => (WINDOW_WIDTH / guidelineBaseWidth) * size

export const scaleHeight = size => verticalScale(size)

export const scaleWidth = size => scale(size)

export const scaleFont = size => size * PixelRatio.getFontScale()

export function boxShadow(
    color,
    elevation = 0,
    offset = { height: 2, width: 2 },
    radius = 8,
    opacity = 0.2,
  ) {
    return {
      shadowColor: color,
      shadowOffset: offset,
      shadowOpacity: opacity,
      shadowRadius: radius,
      elevation: elevation
    }
  }