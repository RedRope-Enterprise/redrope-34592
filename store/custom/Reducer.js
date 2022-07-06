// import { combineReducers } from 'redux'

import { reducer as AuthReducer } from "./reducers/auth/auth.reducer"
import { loginReducer } from "../../modules/social-login/auth"
import homeReducer from "./Home/home.slice"

const reducers = {
  auth: AuthReducer,
  home: homeReducer
}

export default reducers
