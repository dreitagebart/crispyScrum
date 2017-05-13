import _ from 'lodash'
import thunk from 'redux-thunk'
import reducers from '../reducers'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Row, Col, Card, Icon, Button } from 'antd'
import { connect } from 'react-redux'
import { taskUpdate, taskAttach } from '../actions'
import { createStore, applyMiddleware } from 'redux'
import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux'
import * as constants from '../constants'
import '../styles/app.css'

const middleware = applyMiddleware(forwardToMain, thunk)
const initialState = getInitialStateRenderer()
const store = createStore(reducers, initialState, middleware)
replayActionRenderer(store)

class Root extends React.Component {
  render () {
    return <Task />
  }
}

@connect((store, props) => {
  const { tasks } = store.root
  const split = _.split(window.location.pathname, '/')

  return {
    task: _.find(tasks, { _id: split[2] })
  }
})

class Task extends React.Component {
  componentWillUnMount () {
    debugger
    this.props.taskAttach(this.props.task._id)
  }

  render () {
    const { task } = this.props
    document.title = 'TASK / ' + task.title

    return (
      <Row style={{ marginTop: 40, marginBottom: 40, height: '100%' }} type='flex' align='middle' justify='center'>
        <Col style={{ width: '80%' }}>
          <Card>
            <h1 class='header-line'><Icon type={constants.ICONS.task} /> {task.title}</h1>
            <p>{task.descr}</p>
            <p>
              <Button type='primary' onClick={() => { this.props.dispatch(taskUpdate({ _id: task._id }, { title: 'Frisches warmes Sperma' }))}}>test</Button>
            </p>
          </Card>
        </Col>
      </Row>
    )
  }
}

const mount = document.getElementById('task')

ReactDOM.render(
  <Provider store={store}>
    <Root />
  </Provider>, mount)
