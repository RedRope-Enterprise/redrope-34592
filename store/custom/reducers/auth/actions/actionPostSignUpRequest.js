import {
  CHANGE_ATTRIBUTE as CHANGE_ATTRIBUTE_AUTH
} from '@store/custom/reducers/auth/auth.constant'
// import { retrieveToken } from "../../../../../utils/TokenManager"
import { apiSignupRequest } from '../../../../../apis/auth.api'
import { errorValidationHandler } from '../../../../../utils/error'

export const actionToProps = {
  actionPostSignUpRequest: (payload) => async (dispatch, getState) => {
    dispatch({
      type: CHANGE_ATTRIBUTE_AUTH,
      payload: {
        key: 'isPageLoading',
        value: true
      }
    })
    try {
      const data = await apiSignupRequest(payload)
      // dispatch({
      //   type: CHANGE_ATTRIBUTE_AUTH,
      //   payload: {
      //     key: 'authenticatedUser',
      //     value: data
      //   }
      // })
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
          value: ['User successfully registered!.']
        }
      })
      return data
    } catch (e) {
      console.log({
        e
      });
      const { response, message } = e
      const errorMessage = errorValidationHandler(response.data)
      console.log({
        errorMessage: errorMessage.alert,
        validation: errorMessage.validation,
        message,
        response
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
          value: typeof errorMessage.alert === "string" ? [errorMessage.alert] : errorMessage.alert
        }
      })

      return false
    }

  }
}
