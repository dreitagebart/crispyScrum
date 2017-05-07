import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import update from 'react/lib/update'
import HTML5Backend from 'react-dnd-html5-backend'
import { connect } from 'react-redux'
import { Dropdown, Menu, Steps, Button, Icon, Card, Row, Col } from 'antd'
import { DragDropContext } from 'react-dnd'
import { Swimlane, TaskDrag } from '../components'
import { taskUpdate, sprintFilter, sprintFilterShowAll } from '../actions'
import * as constants from '../constants'

const Step = Steps.Step
const ButtonGroup = Button.Group

@connect((store, props) => {
  const { sprints, tasks, selectedBoard, users, sprintFilter, currentUser } = store.root

  let workload = _.filter(tasks, task => {
    const { board, sprint, lane } = task
    if (board !== selectedBoard) return false
    if (!sprint && !lane) return true
    return false
  })

  return {
    filter: sprintFilter,
    users,
    tasks,
    sprint: _.find(sprints, { board: selectedBoard, status: constants.SPRINT.status.active }),
    workload
  }
})

@DragDropContext(HTML5Backend)

export class Sprint extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      swimlanes: [
        { type: constants.SWIMLANES.inProgress, accepts: [constants.TASK.types.meeting, constants.TASK.types.incident], lastDroppedItem: null },
        { type: constants.SWIMLANES.onHold, accepts: [constants.TASK.types.meeting, constants.TASK.types.incident], lastDroppedItem: null },
        { type: constants.SWIMLANES.resolved, accepts: [constants.TASK.types.meeting, constants.TASK.types.incident], lastDroppedItem: null },
        { type: constants.SWIMLANES.done, accepts: [constants.TASK.types.meeting, constants.TASK.types.incident], lastDroppedItem: null }
      ],
      droppedTasks: []
    }
  }

  isDropped = id => {
    return this.state.droppedTasks.indexOf(id) > -1
  }

  render () {
    const { swimlanes } = this.state
    const { sprint, tasks, workload, users, filter } = this.props
    let filteredTasks = []

    if (filter.length) filteredTasks = _.filter(tasks, task => {
      return _.includes(filter, task.assignee)
    })
    else filteredTasks = tasks

    if (!sprint) return <div>There is no active Sprint running :-/</div>

    const parsedEnd = moment(sprint.end).fromNow()

    const menu = (
      <Menu onClick={this._handleMenuClick}>
        <Menu.Item key="1">1st menu item</Menu.Item>
        <Menu.Item key="2">2nd menu item</Menu.Item>
        <Menu.Item key="3">3d menu item</Menu.Item>
      </Menu>
    )

    return (
      <div>
        <Row class='item' align='middle'>
          <Col span={20}>
            <h1>Sprint {sprint.name}</h1>
            <span style={{ fontSize: 16 }}><Icon type='calendar' /> ends {parsedEnd}</span>
          </Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            <Dropdown overlay={menu}>
              <Button style={{ marginLeft: 8 }}>
                <Icon size='large' type='appstore' /> <Icon type='down' />
              </Button>
            </Dropdown>
          </Col>
        </Row>
        <Row class='item'>
          <Col>
            <ButtonGroup>
              <Button onClick={() => this.props.dispatch(sprintFilterShowAll())} size='large' icon='filter' style={{ marginRight: 10 }}>Show all</Button>
            </ButtonGroup>
            <ButtonGroup>
              {_.map(users, user => {
                return (
                  <Button type={_.includes(filter, user._id) ? 'primary' : 'default'} onClick={() => this.props.dispatch(sprintFilter(user._id))} key={user._id}>{user.first} {user.last}</Button>
                )
              })}
            </ButtonGroup>
          </Col>
        </Row>
        <Row class='item'>
          <Col>
            <Steps current={4}>
              <Step icon='right-square-o' title='in progress' description='you are currently working on' />
              <Step icon='down-square-o' title='on hold' description='this work is waiting for feedback' />
              <Step icon='minus-square-o' title='resolved' description='this work is finished, but could be reopened again' />
              <Step icon='check-square-o' title='done' description='this work is finished' />
            </Steps>
          </Col>
        </Row>
        <Row class='item' gutter={24}>
          <Col span={6}>
            <h2 class='swimlaneHeader'>in progress</h2>
          </Col>
          <Col span={6}>
            <h2 class='swimlaneHeader'>on hold</h2>
          </Col>
          <Col span={6}>
            <h2 class='swimlaneHeader'>resolved</h2>
          </Col>
          <Col span={6}>
            <h2 class='swimlaneHeader'>done</h2>
          </Col>
        </Row>
        <Row class='item' gutter={24}>
          {_.map(swimlanes, swimlane => {
            let relTasks = []
            const filtered = _.filter(filteredTasks, { lane: swimlane.type, sprint: sprint._id })
            _.map(filtered, task => {
              let result = _.find(users, { _id: task.assignee })
              let assignee = `${result.first} ${result.last}`
              relTasks.push(
                <TaskDrag
                  assignee={assignee}
                  onClick={() => this.props.history.push('/update/task/' + task._id)}
                  key={task._id}
                  descr={task.descr}
                  id={task._id}
                  title={task.title}
                  type={task.type}
                  isDropped={this.isDropped(task._id)}
                />
              )
            })

            return (
              <Col span={6} key={swimlane.type}>
                <div>
                  <Swimlane
                    type={swimlane.type}
                    tasks={relTasks}
                    accepts={swimlane.accepts}
                    lastDroppedItem={swimlane.lastDroppedItem}
                    onDrop={item => this.handleDrop(item, swimlane.type)}
                  />
                </div>
              </Col>
            )
          })}
        </Row>
        <Row class='item'>
          <Col><h1>Workload</h1></Col>
        </Row>
        <Row gutter={24}>
          {_.map(workload, task => {
            let result = _.find(users, { _id: task.assignee })
            let assignee = `${result.first} ${result.last}`
            return (
              <Col span={6} key={task._id}>
                <TaskDrag
                  assignee={assignee}
                  onClick={() => this.props.history.push('/update/task/' + task._id)}
                  key={task._id}
                  descr={task.descr}
                  id={task._id}
                  title={task.title}
                  type={task.type}
                  isDropped={this.isDropped(task._id)}
                />
              </Col>
            )
          })}
        </Row>
      </div>
    )
  }

  handleDrop = (item, lane) => {
    const { id } = item
    this.props.dispatch(taskUpdate({ _id: id }, { lane, sprint: this.props.sprint._id }))
  }


  _renderTasksInLane = lane => {
    let tasks = []
    const result = _.filter(this.props.tasks, { lane, sprint: this.props.sprint._id })
    if (result.length) {
      _.map(result, task => {
        tasks.push(
          <Card key={task._id} title={task.title}>{task.descr}</Card>
        )
      })

      return tasks
    } else return null
  }
}
