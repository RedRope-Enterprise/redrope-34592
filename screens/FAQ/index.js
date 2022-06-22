import React, { useState, useEffect } from "react"
import {
  Image,
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  ActivityIndicator
} from "react-native"
import { Colors, Typography } from "../../styles"
import NavigationHeader from "../../components/NavigationHeader"
import ImgArrow from "../../assets/images/arrow.png"
import { getFaqs } from "../../services/faq"

const FaqScreen = () => {
  const [datasource, setDatasource] = useState([])
  const [nextPage, setNextPage] = useState(null)
  const [reloadList, setReloadList] = useState(Date.now())
  const [loading, setLoading] = useState(false)

  async function getFaqData(params = "") {
    setLoading(true)
    let response = await getFaqs(params)
    setLoading(false)
    response.results.forEach(element => {
      element.isExpanded = false
    })
    setDatasource([...datasource, ...response.results])
    setNextPage(response.next)
    setReloadList(Date.now())
  }

  useEffect(() => {
    getFaqData()
  }, [])

  const changeExpansion = index => {
    let expandNew = true
    let oldExpanded = datasource.findIndex(element => {
      return element.isExpanded == true
    })
    if (oldExpanded == index) {
      expandNew = false
    }
    datasource.forEach(element => {
      element.isExpanded = false
    })
    if (expandNew) {
      datasource[index].isExpanded = true
    }

    setReloadList(Date.now())
  }

  const renderFaqItem = ({ index, item }) => {
    return (
      <View style={styles.center}>
        <View style={styles.itemContainer}>
          <View style={styles.center}>
            <TouchableOpacity
              style={styles.faqHeaderContainer}
              onPress={() => {
                changeExpansion(index)
              }}
            >
              <Text
                style={[
                  styles.faqText,
                  { color: item.isExpanded ? Colors.PRIMARY_1 : Colors.WHITE }
                ]}
              >
                {item.question}
              </Text>
              <View style={styles.arrowContainer}>
                <Image
                  style={[
                    styles.arrowIcon,
                    {
                      tintColor: item.isExpanded
                        ? Colors.PRIMARY_1
                        : Colors.NETURAL_2,
                      transform: [
                        { rotate: item.isExpanded ? "180deg" : "0deg" }
                      ]
                    }
                  ]}
                  source={ImgArrow}
                ></Image>
              </View>
            </TouchableOpacity>
          </View>
          {item.isExpanded && (
            <View style={{ paddingBottom: "5%" }}>
              <Text style={[styles.faqText, { color: Colors.WHITE }]}>
                {item.response}
              </Text>
            </View>
          )}
        </View>
      </View>
    )
  }

  const renderFooter = () => {
    if (!loading) {
      return null
    } else {
      return (
        <View style={styles.footer}>
          <ActivityIndicator color="white" />
        </View>
      )
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.NETURAL_3 }}>
      <NavigationHeader
        showLeftBtn1={false}
        showLeftBtn2={false}
      ></NavigationHeader>
      <View style={styles.center}>
        <Text style={[styles.title, { color: Colors.WHITE }]}>FAQ</Text>
      </View>
      <View style={[styles.center, { flex: 1 }]}>
        <FlatList
          style={{ width: "100%" }}
          data={datasource}
          extraData={reloadList}
          renderItem={renderFaqItem}
          keyExtractor={(item, index) => index}
          onEndReachedThreshold={1}
          onEndReached={() => {
            if (nextPage) {
              getFaqData(nextPage.substring(nextPage.indexOf("?")))
            }
          }}
          ListFooterComponent={renderFooter}
        />
      </View>

      <View style={styles.bottomContainer}>
        <Text style={[styles.Font16, { color: Colors.WHITE }]}>Contact:</Text>
        <Text style={[styles.Font16, { color: Colors.PRIMARY_1 }]}>
          support@redrope.com
        </Text>
      </View>
    </SafeAreaView>
  )
}

export default FaqScreen

let styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center"
  },
  title: {
    fontSize: Typography.FONT_SIZE_24,
    fontWeight: Typography.FONT_WEIGHT_BOLD,
    lineHeight: Typography.LINE_HEIGHT_36,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    textAlign: "center",
    marginVertical: "5%"
  },
  itemContainer: {
    backgroundColor: Colors.BORDER,
    width: "90%",
    paddingHorizontal: "5%",
    borderRadius: 12,
    marginVertical: "2%"
  },
  arrowIcon: {
    width: "100%",
    height: "100%"
  },
  arrowContainer: {
    width: "6%",
    height: undefined,
    aspectRatio: 1.68
  },
  faqHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: "5%"
  },
  faqText: {
    fontSize: Typography.FONT_SIZE_14,
    fontWeight: Typography.FONT_WEIGHT_400,
    lineHeight: Typography.LINE_HEIGHT_20,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    flex:1
  },
  Font16: {
    fontSize: Typography.FONT_SIZE_16,
    fontWeight: Typography.FONT_WEIGHT_600,
    lineHeight: Typography.LINE_HEIGHT_20,
    fontFamily: Typography.FONT_FAMILY_POPPINS_REGULAR,
    textAlign: "center",
    marginBottom: "2%"
  },
  bottomContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "5%"
  },
  footer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  }
})
