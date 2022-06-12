import {
  CHANGE_ATTRIBUTE as CHANGE_ATTRIBUTE_AUTH
} from '@store/custom/reducers/auth/auth.constant'
// import { retrieveToken } from "../../../../../utils/TokenManager"
import { apiLoginRequest } from '../../../../../apis/auth.api'
import { errorValidationHandler } from '../../../../../utils/error'

export const actionToProps = {
  actionPostSignin: (payload) => async (dispatch, getState) => {
    dispatch({
      type: CHANGE_ATTRIBUTE_AUTH,
      payload: {
        key: 'isPageLoading',
        value: true
      }
    })
    try {
      const { data } = await apiLoginRequest(payload)

      const {
        token, ...clearedData
      } = data
      dispatch({
        type: CHANGE_ATTRIBUTE_AUTH,
        payload: {
          key: 'authenticatedUser',
          value: {
            ...clearedData,
            user: {
              ...data.user,
              id: data.user.pk
            }
          }
        }
      })
      dispatch({
        type: CHANGE_ATTRIBUTE_AUTH,
        payload: {
          key: 'isPageLoading',
          value: false
        }
      })
      return data
    } catch (e) {
      console.log({
        testing: e
      });
      const { response, message } = e
      const errorMessage = errorValidationHandler(response.data)
      console.log({
        errorMessage: errorMessage.alert,
        validation: errorMessage.validation,
        message
      });
      dispatch({
        type: CHANGE_ATTRIBUTE_AUTH,
        payload: {
          key: 'isPageLoading',
          value: false
        }
      })
      dispatch({
        type: CHANGE_ATTRIBUTE_AUTH,
        payload: {
          key: 'errors',
          value: errorMessage.alert
        }
      })

      return false
    }

  }
}
