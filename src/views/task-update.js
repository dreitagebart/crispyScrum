import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { boardCreate, notify, taskUpdate } from '../actions'
import { Tag, Select, Button, Col, Row, Form, Input, Icon } from 'antd'
import * as constants from '../constants'

const FormItem = Form.Item
const Option = Select.Option

@connect((store, props) => {
  const { tasks, users, sprints } = store.root
  let rawTask = _.find(tasks, { _id: props.match.params.id })
  let task = {...rawTask, contact: []}
  _.map(rawTask.contact, contact => {
    const match = _.find(users, { _id: contact })
    task.contact.push({
      key: contact,
      text: `${match.user} (${match.first} ${match.last})`,
      value: contact
    })
  })

  return {
    sprints,
    task,
    users
  }
})

class WrappedTask extends React.Component {

  constructor (props) {
    super(props)

    this.state = {
      colSpan: 4,
      valSpan: 10,
      title: false,
      descr: false,
      contact: false,
      days: false,
      hours: false,
      minutes: false,
      sprint: false,
      assignee: false
    }
  }

  componentWillMount () {
    // this.props.form.setFields({
    //   title: {
    //     value: this.props.task.title
    //   },
    //   descr: {
    //     value: this.props.task.descr
    //   },
    //   contact: {
    //     value: this.props.task.contact
    //   },
    //   sprint: {
    //     value: this.props.task.sprint
    //   }
    // })
  }

  render () {
    const { task } = this.props
    const { getFieldDecorator } = this.props.form

    return (
      <div>
        <Row class='item'>
          <Col span={20}>
            <h1 class='header-line'><Icon type={constants.ICONS.task} /> TASK</h1>
          </Col>
        </Row>
        <Row class='item'>
          <Col>
            <Button type='primary' icon='left' onClick={() => this.props.history.goBack()}>go back</Button>
          </Col>
        </Row>
        <Form onSubmit={this._handleSubmit}>
          {this._renderTaskTitle(getFieldDecorator)}
          {this._renderTaskDescr(getFieldDecorator)}
          {this._renderTaskAssignee(getFieldDecorator)}
          {this._renderTaskContact(getFieldDecorator)}
          {this._renderTaskSprint(getFieldDecorator)}
        </Form>
      </div>
    )
  }

  _handleSubmit = e => {
    e.preventDefault()
    this._handleSaveField()
  }

  _handleSelectSprint = sprint => {
    this.props.form.setFieldsValue({
      sprint
    })

    return this._handleSaveField('sprint')
  }

  _handleSelectAssignee = assignee => {
    this.props.form.setFieldsValue({
      assignee
    })

    return this._handleSaveField('assignee')  
  }

  _handleSelectContact = contact => {
    this.props.form.setFieldsValue({
      contact
    })

    return this._handleSaveField('contact')
  }

  _handleSaveField = fieldName => {
    this.props.form.validateFields((error, values) => {
      if (error) return
      let task = {}
      let updateTask = {}
      if (!fieldName) {
        task = values
      } else {
        task[fieldName] = values[fieldName]
      }

      _.forOwn(task, (value, key) => {
        if (_.isArray(value)) {
          let values = []
          _.map(value, data => {
            values.push(data.key)
          })

          updateTask[key] = values
        } else {
          updateTask[key] = value
        }
      })

      this.props.dispatch(taskUpdate({ _id: this.props.task._id }, updateTask, () => {
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

  _renderTaskTitle = fieldDecorator => {
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
              initialValue: this.props.task.title
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
          <h1 style={{ cursor: 'pointer' }} onClick={() => this.setState({ title: true })}>{this.props.task.title}</h1>
        </Col>
      </Row>
    )
  }

  _renderTaskDescr = fieldDecorator => {  
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
              initialValue: this.props.task.descr
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
          <p style={{ cursor: 'pointer' }} onClick={() => this.setState({ descr: true })}>{this.props.task.descr ? this.props.task.descr : 'no description defined'}</p>
        </Col>
      </Row>
    )
  }

  _renderTaskAssignee = fieldDecorator => {
    let assignee
    let displayName = ''
    if (this.props.task.assignee) assignee = _.find(this.props.users, { _id: this.props.task.assignee })
    if (assignee) displayName = `@${assignee.user} (${assignee.first} ${assignee.last})`

    let children = []
    _.map(this.props.users, user => {
      children.push(<Option key={user._id} value={user._id}>@{user.user} ({user.first} {user.last})</Option>)
    })

    if (this.state.assignee) return (
      <FormItem>
        <Row class='item'>
          <Col span={this.state.colSpan}>
            <h3>Sprint</h3>
          </Col>
          <Col span={this.state.valSpan}>
            {fieldDecorator('assignee', {
              onChange: this._handleSelectAssignee,
              initialValue: displayName
            })(
              <Select
                style={{ width: '80%' }}
                placeholder='choose your assignee...'
              >
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
          <h3>Assignee</h3>
        </Col>
        <Col span={this.state.valSpan}>
          {assignee ? <Tag onClick={() => this.setState({ assignee: true })} color='#108ee9'>{displayName}</Tag> : <Tag onClick={() => this.setState({ assignee: true })} color='#108ee9'>No assignee...</Tag>}
        </Col>
      </Row>
    )
  }

  _renderTaskContact = fieldDecorator => {
    let children = []
    _.map(this.props.users, user => {
      children.push(<Option key={user._id} value={user._id}>{user.user} ({user.first} {user.last})</Option>)
    })

    const _renderContacts = () => {
      let contacts = []
      if (this.props.task.contact.length === 0) return <Tag color='#108ee9' onClick={() => this.setState({ contact: true })}>no contact persons defined</Tag>
      _.map(this.props.task.contact, contact => {
        contacts.push(<Tag color='#108ee9' onClick={() => this.setState({ contact: true })} key={contact.key}>{contact.text}</Tag>)
      })

      return contacts
    }

    if (this.state.contact) return (
      <FormItem>
        <Row class='item'>
          <Col span={this.state.colSpan}>
            <h3>Contact</h3>
          </Col>
          <Col span={this.state.valSpan}>
            {fieldDecorator('contact', {
              onChange: this._handleSelectContact,
              initialValue: this.props.task.contact
            })(
              <Select
                labelInValue
                mode='multiple'
                style={{ width: '80%' }}
                placeholder='choose contact person'
              >
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
          <h3>Contact</h3>
        </Col>
        <Col span={this.state.valSpan}>
          {_renderContacts()}
        </Col>
      </Row>
    )
  }

  _renderTaskSprint = fieldDecorator => {
    let sprint = {
      name: ''
    }
    if (this.props.task.sprint) sprint = _.find(this.props.sprints, { _id: this.props.task.sprint })

    let children = []
    _.map(this.props.sprints, sprint => {
      children.push(<Option key={sprint._id} value={sprint._id}>{sprint.name}</Option>)
    })

    if (this.state.sprint) return (
      <FormItem>
        <Row class='item'>
          <Col span={this.state.colSpan}>
            <h3>Sprint</h3>
          </Col>
          <Col span={this.state.valSpan}>
            {fieldDecorator('sprint', {
              onChange: this._handleSelectSprint,
              initialValue: sprint.name
            })(
              <Select
                style={{ width: '80%' }}
                placeholder='choose your sprint'
              >
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
          <h3>Sprint</h3>
        </Col>
        <Col span={this.state.valSpan}>
          {sprint.name ? <Tag color='#108ee9' onClick={() => this.setState({ sprint: true })}>{sprint.name}</Tag> : <Tag color='#108ee9' onClick={() => this.setState({ sprint: true })}>No sprint assigned...</Tag>}
        </Col>
      </Row>
    )
  }
}

export const TaskUpdate = Form.create()(WrappedTask)