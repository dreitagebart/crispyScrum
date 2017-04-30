import axios from 'axios'
import * as constants from '../constants'
import { appLoading, appLoaded, notify } from './'

export const userFetch = () => {
  return dispatch => {
    dispatch(appLoading())
    axios
      .get('http://localhost:9004/api/users')
      .then(res => {
        dispatch(userReceived(res.data))
        dispatch(appLoaded())
      })
      .catch(error => {
        dispatch(notify({
          type: constants.MESSAGE.error,
          title: error.message
        }))
        dispatch(appLoaded())
      })
  }
}

export const userReceived = users => {
  return {
    type: constants.ACTIONS.userReceived,
    payload: users
  }
}

export const userCreate = user => {
  return dispatch => {
    dispatch(appLoading())
    axios
      .post('http://localhost:9004/api/user', user)
      .then(res => {
        dispatch(userCreated(res.data))
        dispatch(appLoaded())
      })
      .catch(error => {
        dispatch(notify({
          type: constants.MESSAGE.error,
          title: error.message
        }))
        dispatch(appLoaded())
      })
  }
}

export const userCreated = user => {
  return {
    type: constants.ACTIONS.userCreated,
    payload: user
  }
}
