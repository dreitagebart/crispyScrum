import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { boardCreate } from '../actions'
import { Button, Col, Row, Form, Input } from 'antd'

@connect((store, props) => {
  const { tasks } = store
  return {
    tasks
  }
})

export class Task extends React.Component {
  constructor (props) {
    super(props)
    const task = _.find(props.tasks, { _id: props.match.params.id })

    this.state = {
      task
    }
  }

  render () {
    const { task } = this.state
    return (
      <div>
        <Row>
          <Col span={24}><h1>{task.title}</h1></Col>
        </Row>
        <Row>
          <Col span={18}>{task.descr}</Col>
        </Row>
      </div>
    )
  }
}

