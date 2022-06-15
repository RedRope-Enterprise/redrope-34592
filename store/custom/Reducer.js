// import { combineReducers } from 'redux'

import { reducer as AuthReducer } from './reducers/auth/auth.reducer'
import {loginReducer} from "../../modules/social-login/auth"

const reducers = {
  auth: AuthReducer,
}

export default reducers
