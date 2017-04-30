import React from 'react'
import { InputNumber, Icon, Form, Button, Input, Modal, Select } from 'antd'
import { connect } from 'react-redux'
import { taskCreate } from '../actions'

const Option = Select.Option
const FormItem = Form.Item

@connect((store, props) => {
  return store
})

class WrappedModal extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      title: '',
      days: '',
      hours: '',
      descr: '',
      loading: false
    }

    this.initialState = {...this.state}
  }

  componentDidMount () {
    this._handleReset()
  }

  render () {
    return (
      <Modal
        title={this.props.title}
        style={{ top: 20 }}
        maskClosable={false}
        onClose={this.props.closeFn}
        visible={this.props.visible}
        footer={[
          <Button key='submit' type='primary' size='large' loading={this.state.loading} onClick={() => this._handleTaskCreate()}>Create</Button>,
          <Button key='back' size='large' onClick={() => this._handleCancel()}>Cancel</Button>
        ]}
      > 
        <Form layout='vertical'>
          {this._renderTaskForm()}
        </Form>
      </Modal>
    )  
  }

  _handleReset = () => {
    this.setState(this.initialState)
  }

  _handleTaskCreate = () => {
    this.props.form.validateFields((error, values) => {
      
      if (error) return

      console.log('Received values of form: ', values)

      const taskPost = {
        type: this.props.type,
        title: values.title,
        descr: values.descr || '',
        days: values.days || 0,
        hours: values.hours || 0,
        minutes: values.minutes || 0
      }

      this.props.dispatch(taskCreate(taskPost))

      this.props.form.resetFields()
      this.props.closeFn()
    })
  }

  _handleCancel = () => {
    this.props.form.resetFields()
    this.props.closeFn()
  }

  _renderTaskForm = () => {
    let fields = []
    const { getFieldDecorator } = this.props.form

    fields.push(
      <FormItem colon={false} key='title' label='Title'>
        {getFieldDecorator('title', {
          rules: [{ required: true, message: 'Please input a title' }],
          setFieldsValue: { title: this.state.title }
        })(
          <Input prefix={<Icon type='tag' style={{ fontSize: 14 }} />} placeholder='title' />
        )}
      </FormItem>
    )

    fields.push(
      <FormItem colon={false} key='descr' label='Description'>
        {getFieldDecorator('descr', {
          rules: [{ required: false }],
          setFieldsValue: this.state.descr
        })(
          <Input type='textarea' placeholder='description' />
        )}
      </FormItem>
    )

    fields.push(
      <FormItem colon={false} key='duration' label='Estimated duration'>
        {getFieldDecorator('days')(
          <InputNumber min={0} max={100} />
        )}
        <span className="ant-form-text" style={{ marginRight: 20 }}> days</span>
        {getFieldDecorator('hours')(
          <InputNumber onChange={value => this.setState({ hours: value })} min={0} max={23} />
        )}
        <span className="ant-form-text" style={{ marginRight: 20 }}> hours   </span>
        {getFieldDecorator('minutes')(
          <InputNumber min={0} max={59} />
        )}
        <span className="ant-form-text"> minutes</span>
      </FormItem>
    )
  
    return fields
  }
}

export const TaskModal = Form.create()(WrappedModal)
