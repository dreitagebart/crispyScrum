import * as constants from '../constants'
import { notification } from 'antd'

notification.config({
  placement: 'bottomLeft',
  duration: 6
})

export const appLoading = () => {
  return {
    type: constants.ACTIONS.appLoading
  }
}

export const appLoaded = () => {
  return {
    type: constants.ACTIONS.appLoaded
  }
}

export const notify = message => {
  return dispatch => {
    dispatch({
      type: constants.ACTIONS.notify,
      payload: message
    })
    notification[message.type]({
      message: message.title,
      description: message.descr
    })
    dispatch(dismiss())
  }
}

export const dismiss = () => {
  return {
    type: constants.ACTIONS.dismiss
  }
}
