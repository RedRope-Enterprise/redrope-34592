import AsyncStorage from "@react-native-async-storage/async-storage"

export const setDataStorage = async (key, value) => {
  try {
    let store = isJsonStringfy(value) ? JSON.stringify(value) : value
    await AsyncStorage.setItem(key, store)
  } catch (e) {
    console.log(e)
  }
}

export const getDataStorage = async key => {
  try {
    let value = await AsyncStorage.getItem(key)
    if (value !== null) {
      if (isJsonParse(value)) {
        value = JSON.parse(value)
       
        return value
      }
    } else {
      return null
    }
  } catch (e) {
    console.log(e)
  }
}

async function isJsonParse(value) {
  try {
    await JSON.parse(value)
  } catch (error) {
    return false
  }
  return true
}

function isJsonStringfy(value) {
  try {
    JSON.stringify(value)
  } catch (error) {
    return false
  }
  return true
}

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear()
  } catch (e) {
    console.log(e)
  }
}
