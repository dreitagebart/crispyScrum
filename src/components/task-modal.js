import React from 'react'
import PropTypes from 'prop-types'
import { Checkbox, InputNumber, Icon, Form, Button, Input, Modal, Select } from 'antd'
import { connect } from 'react-redux'
import { taskCreate } from '../actions'
import * as constants from '../constants'

const Option = Select.Option
const FormItem = Form.Item

@connect((store, props) => {
  const { sprints, users, selectedBoard, currentUser } = store.root

  return {
    currentUser,
    selectedBoard,
    users,
    sprints
  }
})

class WrappedModal extends React.Component {
  // static propTypes = {
  //   type: PropTypes.string.required,
  //   onClose: PropTypes.func.required,
  //   onTypeSwitch: PropTypes.func.required,
  //   visible: PropTypes.bool.required,
  //   initialSprint: PropTypes.string
  // }

  constructor (props) {
    super(props)

    this.state = {
      createAnother: false,
      type: props.type || constants.TASK.types.incident
    }
  }

  _getTitle = () => {
    switch(this.props.type) {
      case constants.TASK.types.incident: {
        return <span><Icon type={constants.ICONS.incident} /> CREATE NEW INCIDENT</span>
      }
      case constants.TASK.types.meeting: {
        return <span><Icon type={constants.ICONS.meeting} /> CREATE NEW MEETING</span>
      }
      case constants.TASK.types.epic: {
        return <span><Icon type={constants.ICONS.epic} /> CREATE NEW EPIC</span>
      }
    }
    return ''
  }

  render () {
    const title = this._getTitle()

    if (!this.props.visible) return null

    return (
      <Modal
        title={title}
        style={{ top: 20 }}
        maskClosable={false}
        onClose={this.props.onClose}
        visible={this.props.visible}
        footer={[
          <Checkbox key='create' onChange={e => this.setState({ createAnother: e.target.checked })}>create another task</Checkbox>,
          <Button key='submit' type='primary' icon={constants.ICONS.task} size='large' onClick={() => this._handleTaskCreate()}>create task</Button>,
          <Button key='back' size='large' onClick={() => this._handleCancel()}>Cancel</Button>
        ]}
      >
        <Form>
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
        board: this.props.selectedBoard,
        contact: values.contact,
        type: this.props.type,
        title: values.title,
        assignee: values.assignee,
        sprint: values.sprint,
        descr: values.descr || '',
        days: values.days || 0,
        hours: values.hours || 0,
        minutes: values.minutes || 0,
        lane: constants.SWIMLANES.toDo
      }

      this.props.dispatch(taskCreate(taskPost, true))

      this.props.form.resetFields()

      if (!this.state.createAnother) {
        this.props.onClose()
      }
    })
  }

  _handleCancel = () => {
    this.props.form.resetFields()
    this.props.onClose()
  }

  _handleSelectType = (value, option) => {
    this.props.onTypeSwitch(value)
  }

  _renderTaskForm = () => {
    let fields = []
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

    fields.push(
      <FormItem {...formItemLayout} colon={false} key='type' label='Task type'>
        <Select onSelect={this._handleSelectType} value={this.props.type}>
          <Option value={constants.TASK.types.incident}><Icon type={constants.ICONS.incident} /> incident</Option>
          <Option value={constants.TASK.types.meeting}><Icon type={constants.ICONS.meeting} /> meeting</Option>
          <Option value={constants.TASK.types.epic}><Icon type={constants.ICONS.epic} /> epic</Option>
        </Select>
      </FormItem>
    )

    fields.push(
      <FormItem {...formItemLayout} colon={false} key='title' label='Title'>
        {getFieldDecorator('title', {
          rules: [{ min: 5, required: true, message: 'Please input at least 5 characters' }]
        })(
          <Input placeholder='Title' />
        )}
      </FormItem>
    )

    fields.push(
      <FormItem {...formItemLayout} colon={false} key='descr' label='Description'>
        {getFieldDecorator('descr')(
          <Input type='textarea' placeholder='Description' />
        )}
      </FormItem>
    )

    if (this.props.type !== constants.TASK.types.epic) {
      let sprintOptions = []
      let assigneeOptions = []

      _.map(this.props.sprints, sprint => {
        sprintOptions.push(<Option key={sprint._id} value={sprint._id}>{sprint.name}</Option>)
      })

      fields.push(
        <FormItem {...formItemLayout} colon={false} key='sprint' label='Sprint'>
          {getFieldDecorator('sprint', {
            initialValue: this.props.initialSprint
          })(
            <Select
              showSearch
              optionFilterProp='children'
              notFoundContent='nothing found...'
              style={{ width: '80%' }}
              placeholder='choose your sprint'
              filterOption={(input, option) => {
                const checkSprint = _.find(this.props.sprints, { _id: option.props.value })
                return checkSprint.name.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }}>
              {sprintOptions}
            </Select>  
          )}
        </FormItem>
      )

      _.map(this.props.users, user => {
        assigneeOptions.push(<Option key={user._id} value={user._id}>{user.user} ({user.first} {user.last})</Option>)
      })

      fields.push(
        <FormItem {...formItemLayout} colon={false} key='assignee' label='Assignee'>
          {getFieldDecorator('assignee', {
            rules: [{
              required: true,
              message: 'Please select an assignee'
            }],
            initialValue: this.props.currentUser
          })(
            <Select
              showSearch
              optionFilterProp='children'
              notFoundContent='nothing found...'
              style={{ width: '80%' }}
              placeholder='Assignee'
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
              {assigneeOptions}
            </Select>  
          )}
        </FormItem>
      )
    } 

    let contactOptions = []
     _.map(this.props.users, user => {
      contactOptions.push(<Option key={user._id} value={user._id}>{user.user} ({user.first} {user.last})</Option>)
    })

    fields.push(
      <FormItem {...formItemLayout} colon={false} key='contact' label='Contact'>
        {getFieldDecorator('contact')(
          <Select
            showSearch
            mode='multiple'
            optionFilterProp='children'
            notFoundContent='nothing found...'
            style={{ width: '80%' }}
            placeholder='Choose your contact'
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
            {contactOptions}
          </Select>  
        )}
      </FormItem>
    )
  
    fields.push(
      <FormItem {...formItemLayout} colon={false} key='duration' label='Estimated duration'>
        {getFieldDecorator('days')(
          <InputNumber min={0} max={100} />
        )}
        <span className='ant-form-text' style={{ marginRight: 20 }}> days</span>
        {getFieldDecorator('hours')(
          <InputNumber onChange={value => this.setState({ hours: value })} min={0} max={23} />
        )}
        <span className='ant-form-text' style={{ marginRight: 20 }}> hours   </span>
        {getFieldDecorator('minutes')(
          <InputNumber min={0} max={59} />
        )}
        <span className='ant-form-text'> minutes</span>
      </FormItem>
    )
  
    return fields
  }
}

export const TaskModal = Form.create()(WrappedModal)
