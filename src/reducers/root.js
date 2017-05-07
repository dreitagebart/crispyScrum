import _ from 'lodash'
import * as constants from '../constants'

export const root = (store = {
  currentUser: '59053cdaa842b05704033039',
  selectedBoard: null,
  sprintFilter: ['59053cdaa842b05704033039'],
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
      const result = _.find(action.payload, { _id: store.currentUser })
      return {...store, users: action.payload, selectedBoard: result.board}
    }
    case constants.ACTIONS.taskUpdated: {
      let oldTask = _.find(store.tasks, action.payload.query)
      const rejected = _.reject(store.tasks, action.payload.query)
      let newTask = {...oldTask}
      _.forOwn(action.payload.update, (values, key) => {
        newTask[key] = values
      })

      return {...store, tasks: [...rejected, newTask]}
    }
    case constants.ACTIONS.boardSelect: {
      let users = _.reject(store.users, { _id: action.payload.user })
      let user = _.find(store.users, { _id: action.payload.user })
      user.board = action.payload.board
      users = [...users, user]

      return {...store, selectedBoard: action.payload.board, users}
    }
    case constants.ACTIONS.sprintStarted: {
      return {...store, sprints: [store.sprints, action.payload]}
    }
    case constants.ACTIONS.sprintFilter: {
      if (!_.includes(store.sprintFilter, action.payload)) return {...store, sprintFilter: [...store.sprintFilter, action.payload]}
      return {...store, sprintFilter: _.pull(store.sprintFilter, action.payload)}
    }
    case constants.ACTIONS.sprintFilterShowAll: {
      return {...store, sprintFilter: []}
    }
  }
  return store
}
