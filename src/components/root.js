import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store, App } from '../components'

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
