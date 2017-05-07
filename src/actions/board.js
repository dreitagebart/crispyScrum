import axios from 'axios'
import * as constants from '../constants'
import { appLoading, appLoaded, notify } from './'
import { push } from 'react-router-redux'

export const boardFetch = () => {
  return dispatch => {
    dispatch(appLoading())
    axios
      .get('http://localhost:9004/api/boards')
      .then(res => {
        dispatch(boardReceived(res.data))
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

export const boardCreate = board => {
  return dispatch => {
    dispatch(appLoading())
    axios
      .post('http://localhost:9004/api/board', board)
      .then(res => {
        dispatch(boardCreated(res.data))
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

export const boardCreated = board => {
  return {
    type: constants.ACTIONS.boardCreated,
    payload: board
  }
}

export const boardReceived = sprints => {
  return {
    type: constants.ACTIONS.boardReceived,
    payload: sprints
  }
}

export const boardSelect = (user, board) => {
  // return {
  //   type: constants.ACTIONS.boardSelect,
  //   payload: { board, user }
  // }
  return dispatch => {
    const select = {
      user,
      board
    }
    axios.post('http://localhost:9004/api/select/board', select)
      .then(res => {
        dispatch({
          type: constants.ACTIONS.boardSelect,
          payload: { board, user }
        })
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
