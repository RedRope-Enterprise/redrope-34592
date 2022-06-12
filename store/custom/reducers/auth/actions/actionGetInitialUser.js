import {
  CHANGE_ATTRIBUTE as CHANGE_ATTRIBUTE_AUTH
} from '@store/custom/reducers/auth/auth.constant'
// import { retrieveToken } from "../../../../../utils/TokenManager"
import { apiGetUserProfile } from '../../../../../apis/auth.api'
import { errorValidationHandler } from '../../../../../utils/error'

export const actionToProps = {
  actionGetInitialUser: () => async (dispatch, getState) => {
    // const token = await retrieveToken()
    let initialNextScreen = 'Onboarding'
    const {
      auth: {
        hasOnboardingVisited,
        authenticatedUser
      }
    } = getState()

    dispatch({
      type: CHANGE_ATTRIBUTE_AUTH,
      payload: {
        key: 'isPageLoading',
        value: false
      }
    })

    // dispatch({
    //   type: CHANGE_ATTRIBUTE_AUTH,
    //   payload: {
    //     key: 'authenticatedUser',
    //     value: false
    //   }
    // })
    //
    // return initialNextScreen

    console.log({
      userRedux: JSON.stringify(authenticatedUser)
    });


    try {
      if (authenticatedUser){
        const user = await apiGetUserProfile({
          user_id: authenticatedUser.user.id
        })
        console.log({
          userTesting: JSON.stringify(user)
        });
        dispatch({
          type: CHANGE_ATTRIBUTE_AUTH,
          payload: {
            key: 'authenticatedUser',
            value: {
              ...authenticatedUser,
              user: {
                ...authenticatedUser.user,
                ...user.data,
              }
            }
          }
        })

        initialNextScreen = 'Dashboard'
      }

      return initialNextScreen
    } catch (e) {
      const { response, message } = e
      console.log({
        responseDataNotFound: JSON.stringify(response)
      });
      const errorMessage = response.data ? errorValidationHandler(response.data) : {
        alert: "something went wrong!."
      }
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
