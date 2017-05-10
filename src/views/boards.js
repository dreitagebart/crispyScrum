import _ from 'lodash'
import React from 'react'
import { Card, Dropdown, Menu, Button, Icon, Row, Col } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { boardSelect } from '../actions'
import * as constants from '../constants'

@connect((store, props) => {
  const { boards, currentUser } = store.root
  return {
    currentUser,
    boards
  }
})

export class Boards extends React.Component {
  render () {
    const { boards, currentUser } = this.props
    
    const menu = (
      <Menu onClick={this._handleMenuClick}>
        <Menu.Item key='1' class='menu-item'><Icon type={constants.ICONS.create} /> create new board</Menu.Item>
      </Menu>
    )

    return (
      <div>
        <Row class='item'>
          <Col span={20}>
            <h1 class='header-line'><Icon type={constants.ICONS.boardIndex} /> BOARD INDEX</h1>
          </Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            <Dropdown overlay={menu}>
              <Button style={{ marginLeft: 8 }}>
                <Icon size='large' type={constants.ICONS.menu} /> <Icon type='down' />
              </Button>
            </Dropdown>
          </Col>
        </Row>
        <Row gutter={16}>
          {_.map(boards, board => {
            return (
              <Col class='gutter-row' span='8' key={board._id}>
                <Card style={{ cursor: 'pointer' }} title={board.title} onClick={() => {
                  this.props.dispatch(boardSelect(currentUser, board._id))
                  this.props.history.push('/board')
                }}>{board.descr}</Card>
              </Col>
            )
          })}
        </Row>
      </div>
    )
  }

  _handleMenuClick = e => {
    if (e.key === '1') return this.props.history.push('/create/board')
  }
}
