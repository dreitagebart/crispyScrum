import _ from 'lodash'
import React from 'react'
import { Row, Col, Button, Card } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

@connect((store, props) => {
  const { users } = store

  return {
    users
  }
})

export class Users extends React.Component {
  render () {
    const { users } = this.props
    return (
      <div>
        <Row style={{ marginBottom: 20 }}>
          <Col span={20}><h1>Users</h1></Col>
          <Col span={4} style={{ textAlign: 'right' }}><Button onClick={() => this.props.history.push('/create/user')} type='primary'>create user</Button></Col>
        </Row>
        <Row gutter={16}>
          {_.map(users, user => {
            return (
              <Col class='gutter-row' span='8' key={user._id}>
                <Link to={'/user/' + user._id}><Card title={user.first + user.last} bordered={true}>{user.descr}</Card></Link>
              </Col>
            )
          })}
        </Row>
      </div>
    )
  }
}
