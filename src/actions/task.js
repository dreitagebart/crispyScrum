import axios from 'axios'
import * as constants from '../constants'
import { appLoading, appLoaded, notify } from './'

const ipc = window.require('electron').ipcRenderer

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

export const taskCreate = (task, shouldNotify) => {
  return dispatch => {
    dispatch(appLoading())
    axios
      .post('http://localhost:9004/api/task', task)
      .then(res => {
        dispatch(taskCreated(res.data))
        dispatch(appLoaded())
        if (shouldNotify) {
          dispatch(notify({
            type: constants.MESSAGE.success,
            title: 'Task successfully created'
          }))
        }
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

export const taskUpdate = (query, update, callback) => {
  const data = {
    query,
    update
  }
  return dispatch => {
    axios.put('http://localhost:9004/api/task/', data)
      .then(res => {
        dispatch({
          type: constants.ACTIONS.taskUpdated,
          payload: data
        })
        dispatch(notify({
          type: constants.MESSAGE.success,
          title: 'Task updated'
        }))

        if (callback) callback()
      })
      .catch(error => {
        dispatch(notify({
          type: constants.MESSAGE.error,
          title: error.message
        }))
      })
  }
}

export const taskDetach = id => {
  return dispatch => {
    ipc.send('task-detach', id)
    dispatch({
      type: constants.ACTIONS.taskDetach,
      payload: id
    })
  }
}

export const taskAttach = id => {
  return {
    type: constants.ACTIONS.taskAttach,
    payload: id
  }
}
