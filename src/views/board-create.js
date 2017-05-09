import React from 'react'
import { connect } from 'react-redux'
import { boardCreate } from '../actions'
import { Select, Icon, Button, Col, Row, Form, Input } from 'antd'
import * as constants from '../constants'

const Option = Select.Option
const FormItem = Form.Item

@connect((store, props) => {
  const { users } = store.root

  return {
    users
  }
})

class WrappedBoard extends React.Component {
  render () {
    const { getFieldDecorator } = this.props.form
    const { users } = this.props

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      }
    }

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 14,
          offset: 3
        }
      }
    }

    let children = []
    _.map(users, user => {
      children.push(<Option key={user._id} value={user._id}>{user.user} ({user.first} {user.last})</Option>)
    })

    return (
      <Form onSubmit={this._handleSubmit}>
        <Row class='item'>
          <Col span={20}>
            <h1 class='header-line'><Icon type={constants.ICONS.board} /> CREATE NEW BOARD</h1>
          </Col>
        </Row>
        <FormItem colon={false} label='Title' hasFeedback {...formItemLayout}>
          <Row>
            <Col>
              {getFieldDecorator('title', {
                rules: [{
                  min: 5,
                  required: true, 
                  message: 'Please input at least 5 characters'
                }]
              })(<Input placeholder='Title' />)}
            </Col>
          </Row>
        </FormItem>
        <FormItem colon={false} label='Description' hasFeedback {...formItemLayout}>
          <Row>
            <Col>
              {getFieldDecorator('descr', {
                rules: [{
                  min: 10,
                  required: true, 
                  message: 'Please input at least 10 characters'
                }]
              })(<Input placeholder='Description' type='textarea' />)}
            </Col>
          </Row>
        </FormItem>
        <FormItem colon={false} label='Attendees' hasFeedback {...formItemLayout}>
          <Row>
            <Col>
              {getFieldDecorator('attendees', {
                rules: [{
                  required: true,
                  message: 'Please enter some attendees'
                }]
              })(
                <Select 
                  notFoundContent='nothing found...'
                  optionFilterProp='children'
                  showSearch 
                  mode='multiple' 
                  style={{ width: '80%' }} 
                  placeholder='choose attendees'
                  filterOption={(input, option) => {
                    const checkUser = _.find(users, { _id: option.props.value })
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
        <FormItem colon={false} {...tailFormItemLayout}>
          <Button type='primary' htmlType='submit' size='large'>create</Button>
        </FormItem>
      </Form>
    )
  }

  _handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((error, values) => {
      if (error) return
      const { title, descr, attendees } = values
      const boardPost = {
        title,
        descr,
        attendees
      }
      this.props.dispatch(boardCreate(boardPost))
    })
  }
}

export const BoardCreate = Form.create()(WrappedBoard)