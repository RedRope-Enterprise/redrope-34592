import {
  CHANGE_ATTRIBUTE as CHANGE_ATTRIBUTE_AUTH
} from '@store/custom/reducers/auth/auth.constant'
// import { retrieveToken } from "../../../../../utils/TokenManager"
import { apiResetPasswordRequest } from '../../../../../apis/auth.api'
import { errorValidationHandler } from '../../../../../utils/error'

export const actionToProps = {
  actionPostSendForgotPassword: (payload) => async (dispatch, getState) => {
    dispatch({
      type: CHANGE_ATTRIBUTE_AUTH,
      payload: {
        key: 'isPageLoading',
        value: true
      }
    })
    try {
      const { data } = await apiResetPasswordRequest(payload)
      // dispatch({
      //   type: CHANGE_ATTRIBUTE_AUTH,
      //   payload: {
      //     key: 'authenticatedUser',
      //     value: data
      //   }
      // })
      console.log({
        data
      });
      dispatch({
        type: CHANGE_ATTRIBUTE_AUTH,
        payload: {
          key: 'isPageLoading',
          value: false
        }
      })
      return data
    } catch (e) {
      const { response, message } = e
      const errorMessage = errorValidationHandler(response.data)
      console.log({
        response: JSON.stringify(response),
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
