import _ from 'lodash'
import React from 'react'
import { Row, Col, Button, Card } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

@connect((store, props) => {
  const { users } = store.root

  return {
    user: _.find(users, { _id: props.match.params.id })
  }
})

export class User extends React.Component {
  render () {
    const { user } = this.props
    debugger
    return (
      <div>
        <Row style={{ marginBottom: 20 }}>
          <Col span={20}>
            <h1>{user.first} {user.last}</h1>
            <h3>@{user.user}</h3>
          </Col>
        </Row>
        <Row>
          <Col><img src={user.avatar} /></Col>
        </Row>
        <Row>
          <Col>{user.mail}</Col>
        </Row>
      </div>
    )
  }
}
