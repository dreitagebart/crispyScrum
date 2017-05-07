import _ from 'lodash'
import React from 'react'
import { Table, Row, Col, Button, Card } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const getAge = born => {
  debugger
  let ageDifMs = Date.now() - born.getTime()
  let ageDate = new Date(ageDifMs)
  return ageDate.getFullYear()
}

const columns = [{
  dataIndex: 'avatar',
  key: 'avatar',
  width: 100,
  render: avatar => (
    <img style={{ borderColor: '#ffffff', borderWidth: 4, borderStyle: 'solid', width: 64, height: 64, boxShadow: '0 4px 8px 1px #CCCCCC', borderRadius: '50%' }} src={avatar} />
  )
}, {
  title: 'Username',
  dataIndex: 'user',
  key: 'user',
  width: 200,
  sorter: true
}, {
  title: 'first-',
  dataIndex: 'first',
  key: 'first',
  sorter: (a, b) => a.first.length - b.first.length
}, {
  title: 'lastname',
  dataIndex: 'last',
  key: 'last',
  sorter: true
}, {
  title: 'born',
  key: 'born',
  render: record => {
    const { born } = record
    if (!born) return null

    const date = new Date(born)
    return <span>{_.padStart(date.getDate(), 2, '0')}.{_.padStart(date.getMonth()+1, 2, '0')}.{date.getFullYear()}</span>
  }
}]

@connect((store, props) => {
  const { users } = store.root

  return {
    users
  }
})

export class Users extends React.Component {
  render () {
    const { users } = this.props
    return (
      <div>
        <Row class='item'>
          <Col span={20}><h1>Users</h1></Col>
          <Col span={4} style={{ textAlign: 'right' }}><Button onClick={() => this.props.history.push('/create/user')} type='primary'>create user</Button></Col>
        </Row>
        <Row>
          <Table rowKey='_id' columns={columns} dataSource={users} />
        </Row>
      </div>
    )
  }
}
