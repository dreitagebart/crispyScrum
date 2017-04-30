import React from 'react'
import { connect } from 'react-redux'
import { boardCreate } from '../actions'
import { Button, Col, Row, Form, Input } from 'antd'

const FormItem = Form.Item

@connect((store, props) => {
  return store
})

class WrappedBoard extends React.Component {
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
        <FormItem colon={false} label='Title' hasFeedback {...formItemLayout}>
          <Row>
            <Col>
              {getFieldDecorator('title', {
                rules: [{
                  required: true, 
                  message: 'Please input your title'
                }]
              })(<Input />)}
            </Col>
          </Row>
        </FormItem>
        <FormItem colon={false} label='Description' hasFeedback {...formItemLayout}>
          <Row>
            <Col>
              {getFieldDecorator('descr', {
                rules: [{
                  required: true, 
                  message: 'Please input your description'
                }]
              })(<Input type='textarea' />)}
            </Col>
          </Row>
        </FormItem>
        <FormItem colon={false} {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" size="large">create</Button>
        </FormItem>
      </Form>
    )
  }

  _handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((error, values) => {
      if (error) return
      const boardPost = {
        title: values.title,
        descr: values.descr
      }
      this.props.dispatch(boardCreate(boardPost))
    })
  }
}

export const BoardCreate = Form.create()(WrappedBoard)