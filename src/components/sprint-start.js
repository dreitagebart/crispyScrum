import React from 'react'
import moment from 'moment'
import { Modal, DatePicker, Button, Form, Input, Row, Col } from 'antd'

moment.locale('en')

const FormItem = Form.Item

class WrappedSprint extends React.Component {
  constructor (props) {
    super(props)

    const future = moment().add(7, 'days')

    this.state = {
      future,
      MED: moment()
    }
  }

  render () {
    const { visible } = this.props
    const { getFieldDecorator } = this.props.form

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 }
      }
    }

    return (
      <Modal
        maskClosable={false}
        visible={visible}
        title='Start sprint'
        onCancel={this._handleClose}
        footer={[
          <Button key='submit' type='primary' size='large' onClick={() => this._handleSprintStart()}>
            Start sprint now
          </Button>,
          <Button key='back' size='large' onClick={this._handleClose}>Cancel</Button>
        ]}
      >
        <Form hideRequiredMark>
          <FormItem {...formItemLayout} label="Name" hasFeedback colon={false}>
            <Row>
              <Col>
                {getFieldDecorator('name', {
                  rules: [{ min: 5, required: true, message: 'Please enter at least 5 characters for your sprint name' }]
                })(<Input placeholder='enter the name' />)}
              </Col>
            </Row>
          </FormItem>
          <FormItem {...formItemLayout} label="Begin date" colon={false}>
            <Row>
              <Col>
                <b>Today</b>
              </Col>
            </Row>
          </FormItem>
          <FormItem {...formItemLayout} label="End date" colon={false}>
            <Row>
              <Col>
                {getFieldDecorator('end', {
                  initialValue: this.state.future,
                  rules: [{ type: 'object', required: true, message: 'Please select your end date!' }],
                })(<DatePicker allowClear={false} disabledDate={this.disabledEndDate} placeholder='pick your end date' format="YYYY-MM-DD" />)}
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Modal>
    )
  }

  disabledEndDate = startValue => {
    return startValue.isSameOrBefore(this.state.MED)
  }

  _handleClose = () => {
    this.props.form.resetFields()
    this.props.onClose()
  }

  _handleSprintStart = () => {
    this.props.form.validateFields((error, values) => {
      if (error) return
      this.props.onConfirm(values)
    })
  }
}

export const SprintStart = Form.create()(WrappedSprint)
