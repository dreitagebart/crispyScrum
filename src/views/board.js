import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { boardSelect, sprintStart } from '../actions'
import { Menu, Dropdown, Icon, Button, Col, Row, Form, Input } from 'antd'
import * as constants from '../constants'
import { SprintStart } from '../components'

@connect((store, props) => {
  const { boards, currentUser, selectedBoard, sprints } = store.root
  const board = _.find(boards, { _id: props.match.params.id })

  return {
    sprint: _.find(sprints, { board: selectedBoard, status: constants.SPRINT.status.active }),
    board
  }
})

export class Board extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      visible: false
    }
  }

  render () {
    const { board, sprint } = this.props

    const menu = (
      <Menu onClick={this._handleMenuClick}>
        <Menu.Item key="1">1st menu item</Menu.Item>
        <Menu.Item key="2">2nd menu item</Menu.Item>
        <Menu.Item key="3">3d menu item</Menu.Item>
      </Menu>
    )

    return (
      <div>
        <SprintStart visible={this.state.visible} onClose={() => this.setState({ visible: false })} onConfirm={data => {
          let sprint = {...data, board: board._id, end: data.end.format()}
          this.props.dispatch(sprintStart(sprint))
        }} />
        <Row class='item'>
          <Col span={20}>
            <h1>Board {board.title}</h1>
          </Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            <Dropdown overlay={menu}>
              <Button style={{ marginLeft: 8 }}>
                <Icon size='large' type='appstore' /> <Icon type='down' />
              </Button>
            </Dropdown>
          </Col>
        </Row>
        <Row class='item'>
          <Col><h4>There is currently {sprint ? 'sprint ' + sprint.name : 'no sprint'} running</h4></Col>
        </Row>
        <Row>
          <Col>{sprint ? <Button type='primary' onClick={() => this.props.history.push('/sprint')}>Show sprint</Button> : <Button type='primary' onClick={() => this.setState({ visible: true })}>Start sprint</Button> }</Col>
        </Row>
      </div>
    )
  }

  _handleMenuClick = e => {
    debugger
  }
}

