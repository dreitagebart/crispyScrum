import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { boardCreate } from '../actions'
import { Button, Col, Row, Form, Input } from 'antd'

@connect((store, props) => {
  const { tasks } = store.root
  return {
    task: _.find(props.tasks, { _id: props.match.params.id })
  }
})

export class Task extends React.Component {
  render () {
    const { task } = this.props
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

