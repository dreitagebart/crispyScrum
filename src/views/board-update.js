import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { boardCreate, notify, boardUpdate } from '../actions'
import { Tag, Select, Button, Col, Row, Form, Input, Icon } from 'antd'
import * as constants from '../constants'

const FormItem = Form.Item
const Option = Select.Option

@connect((store, props) => {
  const { boards, users, selectedBoard } = store.root

  return {
    board: _.find(boards, { _id: selectedBoard }),
    users
  }
})

class WrappedBoard extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      colSpan: 4,
      valSpan: 10,
      title: false,
      descr: false,
      attendees: false
    }
  }

  render () {
    const { users, board } = this.props
    const { getFieldDecorator } = this.props.form

    return (
      <div>
        <Row class='item'>
          <Col span={20}>
            <h1 class='header-line'><Icon type={constants.ICONS.board} /> BOARD</h1>
          </Col>
        </Row>
        <Row class='item'>
          <Col>
            <Button type='primary' icon='left' onClick={() => this.props.history.goBack()}>go back</Button>
          </Col>
        </Row>
        <Form onSubmit={this._handleSubmit}>
          {this._renderBoardTitle(getFieldDecorator)}
          {this._renderBoardDescr(getFieldDecorator)}
          {this._renderBoardAttendees(getFieldDecorator)}
        </Form>
      </div>
    )
  }

  _handleSubmit = e => {
    e.preventDefault()
    this._handleSaveField()
  }

  _handleSelectAttendee = attendees => {
    this.props.form.setFieldsValue({
      attendees
    })

    return this._handleSaveField('attendees')
  }

  _handleSaveField = fieldName => {
    this.props.form.validateFields((error, values) => {
      debugger
      if (error) return
      let board = {}
      let updateBoard = {}
      if (!fieldName) {
        board = values
      } else {
        board[fieldName] = values[fieldName]
      }

      _.forOwn(board, (value, key) => {
        updateBoard[key] = value
      })

      this.props.dispatch(boardUpdate({ _id: this.props.board._id }, updateBoard, () => {
        let result = {}
        if (!fieldName) {
          _.forOwn(values, (value, key) => {
            result[key] = false
          })
        } else {
          result[fieldName] = false  
        }
        this.setState(result)
      }))
    })
  }

  _renderBoardTitle = fieldDecorator => {
    if (this.state.title) return (
      <FormItem>
        <Row class='item'>
          <Col span={this.state.colSpan}>
            <h3>Title</h3>
          </Col>
          <Col span={1}>
            <Icon onClick={() => this._handleSaveField('title')} style={{ fontSize: 16, cursor: 'pointer', marginRight: 10 }} type={constants.ICONS.save} />
          </Col>
          <Col span={this.state.valSpan}>
            {fieldDecorator('title', {
              rules: [{
                min: 5,
                required: true, 
                message: 'Please input at least 5 characters'
              }],
              initialValue: this.props.board.title
            })(<Input size='large' />)}
          </Col>
        </Row>
      </FormItem>
    )

    return (
      <Row class='item' type='flex' align='middle'>
        <Col span={this.state.colSpan}>
          <h3>Title</h3>
        </Col>
        <Col span={this.state.valSpan}>
          <h1 style={{ cursor: 'pointer' }} onClick={() => this.setState({ title: true })}>{this.props.board.title}</h1>
        </Col>
      </Row>
    )
  }

  _renderBoardDescr = fieldDecorator => {  
    if (this.state.descr) return (
      <FormItem>
        <Row class='item'>
          <Col span={this.state.colSpan}>
            <h3>Description</h3>
          </Col>
          <Col span={1}>
            <Icon onClick={() => this._handleSaveField('descr')} style={{ fontSize: 16, cursor: 'pointer', marginRight: 10 }} type={constants.ICONS.save} />
          </Col>
          <Col span={this.state.valSpan}>
            {fieldDecorator('descr', {
              rules: [{
                min: 10,
                required: true, 
                message: 'Please input at least 10 characters'
              }],
              initialValue: this.props.board.descr
            })(<Input type='textarea' />)}
          </Col>
        </Row>
      </FormItem>
    )
    
    return (
      <Row class='item'>
        <Col span={this.state.colSpan}>
          <h3>Description</h3>
        </Col>
        <Col span={this.state.valSpan}>
          <p style={{ cursor: 'pointer' }} onClick={() => this.setState({ descr: true })}>{this.props.board.descr ? this.props.board.descr : 'no description defined'}</p>
        </Col>
      </Row>
    )
  }

  _renderBoardAttendees = fieldDecorator => {
    let children = []
    _.map(this.props.users, user => {
      children.push(<Option key={user._id} value={user._id}>{user.user} ({user.first} {user.last})</Option>)
    })

    const _renderAttendees = () => {
      let attendees = []
      debugger
      if (this.props.board.attendees.length === 0) return <Tag color='#108ee9' onClick={() => this.setState({ attendees: true })}>no attendees defined</Tag>
      _.map(this.props.board.attendees, attendee => {
        debugger
        const result = _.find(this.props.users, { _id: attendee })
        attendees.push(<Tag color='#108ee9' onClick={() => this.setState({ attendees: true })} key={attendee}>@{result.user} ({result.first} {result.last})</Tag>)
      })

      return attendees
    }

    if (this.state.attendees) return (
      <FormItem>
        <Row class='item'>
          <Col span={this.state.colSpan}>
            <h3>Attendees</h3>
          </Col>
          <Col span={this.state.valSpan}>
            {fieldDecorator('attendees', {
              rules: [{
                required: true,
                message: 'Please enter some attendees'
              }],
              onChange: this._handleSelectAttendee,
              initialValue: this.props.board.attendees
            })(
              <Select
                showSearch
                optionFilterProp='children'
                notFoundContent='nothing found...'
                mode='multiple'
                style={{ width: '80%' }}
                placeholder='choose attendees'
                filterOption={(input, option) => {
                  const checkUser = _.find(this.props.users, { _id: option.props.value })
                  let first = checkUser.first.toLowerCase().indexOf(input.toLowerCase())
                  if (first >= 0) return true
                  let last = checkUser.last.toLowerCase().indexOf(input.toLowerCase())
                  if (last >= 0) return true
                  let username = checkUser.user.toLowerCase().indexOf(input.toLowerCase())
                  if (username >= 0) return true
                  return false
                }}>
                {children}
              </Select>
            )}
          </Col>
        </Row>
      </FormItem>
    )

    return (
      <Row class='item'>
        <Col span={this.state.colSpan}>
          <h3>Attendees</h3>
        </Col>
        <Col span={this.state.valSpan}>
          {_renderAttendees()}
        </Col>
      </Row>
    )
  }
}

export const BoardUpdate = Form.create()(WrappedBoard)