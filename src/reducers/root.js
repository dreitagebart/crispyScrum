import * as constants from '../constants'

export const root = (store = {
  message: null,
  log: [],
  appLoading: true,
  boards: [],
  users: [],
  tasks: [],
  sprints: [],
  value: false
}, action) => {
  switch (action.type) {
    case constants.ACTIONS.dismiss: {
      const log = {...store.message, date: new Date()}
      return {...store, message: null, log: [...store.log, log]}
    }
    case constants.ACTIONS.notify: {
      return {...store, message: action.payload}
    }
    case constants.ACTIONS.appLoaded: {
      return {...store, appLoading: false}
    }
    case constants.ACTIONS.appLoading: {
      return {...store, appLoading: true}
    }
    case constants.ACTIONS.sprintReceived: {
      return {...store, sprints: action.payload}
    }
    case constants.ACTIONS.taskReceived: {
      return {...store, tasks: action.payload}
    }
    case constants.ACTIONS.taskCreated: {
      return {...store, tasks: [...store.tasks, action.payload]}
    }
    case constants.ACTIONS.boardCreated: {
      return {...store, boards: [...store.boards, action.payload]}
    }
    case constants.ACTIONS.boardReceived: {
      return {...store, boards: action.payload}
    }
    case constants.ACTIONS.userCreated: {
      return {...store, users: [...store.users, action.payload]}
    }
    case constants.ACTIONS.userReceived: {
      return {...store, users: action.payload}
    }
  }
  return store
}
