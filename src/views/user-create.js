import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { userCreate, notify } from '../actions'
import { Icon, Upload, Modal, InputNumber, Form, Input, Button, Row, Col, Switch } from 'antd'
import * as constants from '../constants'

const FormItem = Form.Item

@connect((store, props) => {
  return store
})

class WrappedUser extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      previewVisible: false,
      previewImage: '',
      avatar: []
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    }

    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0
        },
        sm: {
          span: 20,
          offset: 12
        }
      }
    }

    const { previewVisible, previewImage, avatar } = this.state
    const uploadButton = (
      <div>
        <Icon type='plus' />
        <div className='ant-upload-text'>Upload</div>
      </div>
    )

    return (
      <div>
        <Row class='item'>
          <Col span={20}>
            <h1 class='header-line'><Icon type={constants.ICONS.user} /> CREATE NEW USER</h1>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
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
              <FormItem colon={false} label='Date of birth' labelCol={{ xs: { span: 24 }, sm: { span: 6 } }} wrapperCol={{ xs: { span: 24 }, sm: { span: 14 } }}>
                <Row>
                  <Col span={24}>
                    {getFieldDecorator('bornDay')(<InputNumber placeholder='dd' min={1} max={31} />)}
                    {getFieldDecorator('bornMonth')(<InputNumber placeholder='mm' min={1} max={12} />)}
                    {getFieldDecorator('bornYear')(<InputNumber placeholder='yyyy' min={1950} max={2015} />)}
                  </Col>
                </Row>
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type='primary' htmlType='submit' size='large'>create</Button>
              </FormItem>
            </Form>          
          </Col>
          <Col span={12}>
            <Upload
              action='//jsonplaceholder.typicode.com/posts/'
              listType='picture-card'
              fileList={avatar}
              onPreview={this._handlePreview}
              onChange={this._handleUpload}
            >
              {avatar.length >= 3 ? null : uploadButton}
            </Upload>
            <Modal visible={previewVisible} footer={null} onCancel={this._handlePreviewCancel}>
              <img alt='example' style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </Col>
        </Row>
      </div>
    )
  }

  _handleUpload = ({ fileList }) => {
    debugger
    this.setState({ avatar: fileList })
  }

  _handlePreviewCancel = () => this.setState({ previewVisible: false })

  _handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    })
  }

  _handleSubmit = e => {
    let born
    let avatar

    e.preventDefault()
    this.props.form.validateFields((error, values) => {
      if (error) return
      const { mail, user, first, last, descr, interests, isAdmin, bornDay, bornMonth, bornYear } = values
      debugger
      if (bornDay && bornMonth && bornYear) born = new Date(bornYear, bornMonth, bornDay)

      if (this.state.avatar.length) {
        avatar = this.state.avatar[0].thumbUrl
      }

      const userPost = {
        mail,
        user,
        first,
        last,
        descr,
        interests,
        isAdmin,
        born,
        avatar
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
