import _ from 'lodash'
import * as constants from '../constants'

export const controller = (store = {
  detachedTasks: []
}, action) => {
  switch (action.type) {
    case constants.ACTIONS.taskDetach: {
      debugger
      return {...store, detachedTasks: [...store.detachedTasks, action.payload]}
    }
    case constants.ACTIONS.taskAttach: {
      debugger
      const result = _.reject(store.detachedTasks, action.payload)
      return {...store, detachedTasks: result}
    }
  }
  return store
}
