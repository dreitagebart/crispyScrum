import axios from 'axios'
import * as constants from '../constants'
import { appLoading, appLoaded, notify } from './'

export const sprintFetch = () => {
  return dispatch => {
    dispatch(appLoading())
    axios
      .get('http://localhost:9004/api/sprints')
      .then(res => {
        dispatch(sprintReceived(res.data))
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

export const sprintReceived = sprints => {
  return {
    type: constants.ACTIONS.sprintReceived,
    payload: sprints
  }
}

export const sprintFilter = filter => {
  return {
    type: constants.ACTIONS.sprintFilter,
    payload: filter
  }
}

export const sprintFilterShowAll = () => {
  return {
    type: constants.ACTIONS.sprintFilterShowAll
  }
}

export const sprintStart = sprint => {
  return dispatch => {
    const createSprint = {
      name: sprint.name,
      end: sprint.end,
      board: sprint.board,
      status: constants.SPRINT.status.active
    }
    dispatch(appLoading())
    axios
      .post('http://localhost:9004/api/sprint', createSprint)
      .then(res => {
        dispatch({
          type: constants.ACTIONS.sprintStarted,
          payload: res.data
        })
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


