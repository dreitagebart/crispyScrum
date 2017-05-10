import _ from 'lodash'
import React from 'react'
import { Menu, Dropdown, Icon, Table, Row, Col, Button, Card } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as constants from '../constants'

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

    const menu = (
      <Menu onClick={this._handleMenuClick}>
        <Menu.Item key='1' class='menu-item'><Icon type={constants.ICONS.create} /> create new user</Menu.Item>
      </Menu>
    )

    return (
      <div>
        <Row class='item'>
          <Col span={20}>
            <h1 class='header-line'><Icon type={constants.ICONS.user} /> USERS</h1>
          </Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            <Dropdown overlay={menu}>
              <Button style={{ marginLeft: 8 }}>
                <Icon size='large' type={constants.ICONS.menu} /> <Icon type='down' />
              </Button>
            </Dropdown>
          </Col>
        </Row>
        <Row>
          <Table rowKey='_id' columns={columns} dataSource={users} />
        </Row>
      </div>
    )
  }

  _handleMenuClick = e => {
    if (e.key === '1') return this.props.history.push('/create/user')
  }
}
