import thunk from 'redux-thunk'
import reducers from '../reducers'
import { createStore, applyMiddleware } from 'redux'
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux'

const middleware = applyMiddleware(forwardToMain, thunk)
const initialState = getInitialStateRenderer()
const store = createStore(reducers, initialState, middleware)
replayActionRenderer(store)

export default store
