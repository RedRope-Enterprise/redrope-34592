import {
  CHANGE_ATTRIBUTE as CHANGE_ATTRIBUTE_AUTH
} from '@store/custom/reducers/auth/auth.constant'

export const actionToProps = {
  changeAuthAttribute: ({key, value, type=CHANGE_ATTRIBUTE_AUTH}) => dispatch => {
    return new Promise((resolve, reject)=>{
      dispatch({
        type: type,
        payload: {key: key, value: value}
      })
      resolve(value)
    })
  },
}
