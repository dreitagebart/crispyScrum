import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { userCreate, notify } from '../actions'
import { Form, DatePicker, Input, Button, Row, Col, Switch } from 'antd'
import * as constants from '../constants'

const FormItem = Form.Item

@connect((store, props) => {
  return store
})

class WrappedUser extends React.Component {
  render () {
    const { getFieldDecorator } = this.props.form
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

    return (
      <Form onSubmit={this._handleSubmit}>
        <FormItem colon={false} label='Username' hasFeedback {...formItemLayout}>
          <Row>
            <Col>
              {getFieldDecorator('user', {
                rules: [{
                  required: true,
                  message: 'Please input your username'
                }]
              })(<Input />)}
            </Col>
          </Row>
        </FormItem>
        <FormItem colon={false} label='First name' hasFeedback {...formItemLayout}>
          <Row>
            <Col>
              {getFieldDecorator('first', {
                rules: [{
                  required: true,
                  message: 'Please input your first name'
                }]
              })(<Input />)}
            </Col>
          </Row>
        </FormItem>
        <FormItem colon={false} label='Last name' hasFeedback {...formItemLayout}>
          <Row>
            <Col>
              {getFieldDecorator('last', {
                rules: [{
                  required: true,
                  message: 'Please input your last name'
                }]
              })(<Input />)}
            </Col>
          </Row>
        </FormItem>
        <FormItem colon={false} label='eMail' hasFeedback {...formItemLayout}>
          <Row>
            <Col>
              {getFieldDecorator('mail', {
                rules: [{
                  type: 'email',
                  required: true,
                  message: 'Please input your eMail'
                }]
              })(<Input />)}
            </Col>
          </Row>
        </FormItem>
        <FormItem colon={false} label='Administrator' {...formItemLayout}>
          <Row>
            <Col>
              {getFieldDecorator('isAdmin')(<Switch />)}
            </Col>
          </Row>
        </FormItem>
        <FormItem colon={false} label='Interests' {...formItemLayout}>
          <Row>
            <Col>
              {getFieldDecorator('interests', {
                rules: [{
                  required: false,
                  message: 'Please input your first name'
                }]
              })(<Input />)}
            </Col>
          </Row>
        </FormItem>
        <FormItem colon={false} label='Description' {...formItemLayout}>
          <Row>
            <Col>
              {getFieldDecorator('descr', {
                rules: [{
                  required: false, 
                  message: 'Please input your description'
                }]
              })(<Input placeholder='Tell me something about the user...' type='textarea' />)}
            </Col>
          </Row>
        </FormItem>
        <FormItem colon={false} label='Date of birth' {...formItemLayout}>
          <Row>
            <Col>
              {getFieldDecorator('born', {
                rules: [{
                  type: 'object',
                  required: false, 
                  message: 'Please input your description'
                }]
              })(<DatePicker />)}
            </Col>
          </Row>
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">create</Button>
        </FormItem>
      </Form>
    )
  }

  _handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((error, values) => {
      if (error) return
      const { mail, user, first, last, descr, interests, isAdmin, born } = values

      const userPost = {
        mail,
        user,
        first,
        last,
        descr,
        interests,
        isAdmin,
        born
      }
      this.props.dispatch(userCreate(userPost))
      this.props.dispatch(notify({
        type: constants.MESSAGE.success,
        title: 'User successfully created'
      }))
    })
  }
}

export const UserCreate = Form.create()(WrappedUser)
