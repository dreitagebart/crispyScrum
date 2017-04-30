import React from 'react'
import { connect } from 'react-redux'
import { boardCreate } from '../actions'
import { Button, Col, Row, Form, Input } from 'antd'

@connect((store, props) => {
  return store
})

export class Board extends React.Component {
  render () {
    return (
      <div>
        <Row>
          <Col span={24}><h1>I am Board</h1></Col>
        </Row>
      </div>
    )
  }
}

