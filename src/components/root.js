import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { App } from '../components'
import store from '../components/store'

class Root extends React.Component {
  render () {
    return <App />
  }
}

const mount = document.getElementById('app')

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>, mount)
