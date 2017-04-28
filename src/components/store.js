import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { root } from '../reducers/root'

const middleware = applyMiddleware(thunk)

export const store = createStore(root, middleware)
