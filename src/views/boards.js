import _ from 'lodash'
import React from 'react'
import { Card, Button, Icon, Row, Col } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { notify } from '../actions'
import * as constants from '../constants'

@connect((store, props) => {
  const { boards } = store.root
  return {
    boards
  }
})

export class Boards extends React.Component {
  render () {
    const { boards } = this.props

    return (
      <div>
        <Row style={{ marginBottom: 20 }}>
          <Col span={20}><h1>Boards</h1></Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            <Button onClick={this._handleCreateBoard} type='primary'>create board</Button>
            <Button onClick={() => this.props.dispatch(notify({
              type: constants.MESSAGE.info,
              title: 'Test successful'
            }))}>Test</Button>
          </Col>
        </Row>
        <Row gutter={16}>
          {_.map(boards, board => {
            return (
              <Col class='gutter-row' span='8' key={board._id}>
                <Link to={'/board/' + board._id}><Card title={board.title} bordered={true}>{board.descr}</Card></Link>
              </Col>
            )
          })}
        </Row>
      </div>
    )
  }

  _handleCreateBoard = () => {
    this.props.history.push('/create/board')
  }
}
