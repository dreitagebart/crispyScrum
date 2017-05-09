import _ from 'lodash'
import React from 'react'
import faker from 'faker'
import { userCreate, taskCreate } from '../actions'
import { Button, Row, Col } from 'antd'
import { connect } from 'react-redux'
import * as constants from '../constants'

@connect((store, props) => {
  const { users, boards, sprints } = store.root
  let userKeys = []
  let boardKeys = []
  let sprintKeys = []
  _.map(users, user => {
    userKeys.push(user._id)
  })
  _.map(boards, user => {
    boardKeys.push(user._id)
  })
  _.map(sprints, user => {
    sprintKeys.push(user._id)
  })

  return {
    userKeys,
    boardKeys,
    sprintKeys
  }
})

export class Admin extends React.Component {

  createUser = () => {
    _.times(10, () => {
      const random = faker.random.number({ min: 15, max: 40})
      let userPost = {
        first: faker.name.firstName(),
        last: faker.name.lastName(),
        mail: faker.internet.email(),
        user: faker.internet.userName(),
        born: faker.date.past(random),
        avatar: faker.image.avatar()
      }

      this.props.dispatch(userCreate(userPost))
    })
  }

  createTask = type => {
    _.times(1, () => {
      const board = faker.random.arrayElement(this.props.boardKeys)
      const assignee = faker.random.arrayElement(this.props.userKeys)
      let taskPost = {
        title: faker.lorem.words(),
        descr: faker.lorem.sentences(),
        type: type,
        board,
        assignee
      }
      
      this.props.dispatch(taskCreate(taskPost))
    })
  }

  render () {
    return (
      <div>
        <Row class='item'>
          <Col><Button type='primary' onClick={() => this.createUser()}>create user</Button></Col>
        </Row>
        <Row class='item'>
          <Col><Button type='primary' onClick={() => this.createTask(constants.TASK.types.incident)}>create incident</Button></Col>
        </Row>
        <Row class='item'>
          <Col><Button type='primary' onClick={() => this.createTask(constants.TASK.types.meeting)}>create meeting</Button></Col>
        </Row>
        <Row class='item'>
          <Col><Button type='primary' onClick={() => this.createTask(constants.TASK.types.epic)}>create epic</Button></Col>
        </Row>
      </div>
    )
  }
}
