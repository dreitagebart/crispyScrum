import axios from 'axios'
import * as constants from '../constants'
import { appLoading, appLoaded, notify } from './'

export const taskFetch = () => {
  return dispatch => {
    dispatch(appLoading())
    axios
      .get('http://localhost:9004/api/tasks')
      .then(res => {
        dispatch(taskReceived(res.data))
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

export const taskReceived = tasks => {
  return {
    type: constants.ACTIONS.taskReceived,
    payload: tasks
  }
}

export const taskCreate = task => {
  return dispatch => {
    dispatch(appLoading())
    axios
      .post('http://localhost:9004/api/task', task)
      .then(res => {
        dispatch(taskCreated(res.data))
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

export const taskCreated = task => {
  return {
    type: constants.ACTIONS.taskCreated,
    payload: task
  }
}
