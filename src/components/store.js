import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import reducers from '../reducers'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'

const history = createHistory()

const middleware = applyMiddleware(thunk, routerMiddleware(history))

export const store = createStore(reducers, middleware)
