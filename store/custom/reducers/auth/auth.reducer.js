import * as constants from './auth.constant'

export const defaultState = {
  errors: [],
  hasOnboardingVisited: false,
  authenticatedUser: false,
  isPageLoading: false
}
const ACTION_HANDLERS = {
  [constants.LOGOUT]: (state, action) => {
    return { ...state, ...defaultState }
  },
  [constants.CHANGE_ATTRIBUTE]: (state, action) => {
    const { value, key } = action.payload;

    const updateState = {
      ...state,
      [key]: value
    }

    console.log("target 8978")
    return Object.assign({}, state, updateState)
  },
  [constants.INIT]: (state, action) => {
    return { ...state, ...action.payload }
  }
}


export const reducer =
  (state = defaultState, action) => {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
