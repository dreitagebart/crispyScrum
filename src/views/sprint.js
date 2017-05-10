import _ from 'lodash'
import moment from 'moment'
import React from 'react'
import update from 'react/lib/update'
import HTML5Backend from 'react-dnd-html5-backend'
import { connect } from 'react-redux'
import { Anchor, Collapse, Dropdown, Menu, Steps, Button, Icon, Card, Row, Col } from 'antd'
import { DragDropContext } from 'react-dnd'
import { TaskModal, SprintStart, Swimlane, TaskDrag } from '../components'
import { taskUpdate, sprintFilter, sprintFilterShowAll, sprintStart } from '../actions'
import * as constants from '../constants'

moment.locale('en')

const Link = Anchor.Link
const Panel = Collapse.Panel
const Step = Steps.Step
const ButtonGroup = Button.Group

@connect((store, props) => {
  const { sprints, tasks, selectedBoard, users, sprintFilter, currentUser } = store.root

  let backlog = _.filter(tasks, task => {
    const { board, sprint, lane } = task
    if (board !== selectedBoard) return false
    if (!sprint || !lane) return true
    return false
  })

  const withoutEpics = _.reject(tasks, { type: constants.TASK.types.epic })

  return {
    selectedBoard,
    filter: sprintFilter,
    users,
    tasks: withoutEpics,
    sprint: _.find(sprints, { board: selectedBoard, status: constants.SPRINT.status.active }),
    backlog
  }
})

@DragDropContext(HTML5Backend)

export class Sprint extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      toDoPanel: '1',
      inProgressPanel: '1',
      taskType: constants.TASK.types.incident,
      sprintStart: false,
      taskModal: false,
      swimlanes: [
        { type: constants.SWIMLANES.toDo, accepts: [constants.TASK.types.meeting, constants.TASK.types.incident], lastDroppedItem: null },
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
    const { sprint, tasks, backlog, users, filter, selectedBoard } = this.props
    let filteredTasks = []

    if (filter.length) filteredTasks = _.filter(tasks, task => {
      return _.includes(filter, task.assignee)
    })
    else filteredTasks = tasks

    if (!sprint) return (
      <div>
        <SprintStart visible={this.state.sprintStart} onClose={() => this.setState({ sprintStart: false })} onConfirm={data => {
          let sprint = {...data, board: selectedBoard, end: data.end.format()}
          this.props.dispatch(sprintStart(sprint))
        }} />
        <Row class='item'>
          <Col span={20}>
            <h1 class='header-line'><Icon type={constants.ICONS.sprint} /> SPRINT - no active sprint</h1>
          </Col>
        </Row>
        <Row class='item' type='flex' align='center'>
          <Col>
            <div style={{ textAlign: 'center', borderRadius: 6, border: '1px solid #cfcfcf', backgroundColor: '#efefef', padding: 20 }}>
              <div class='item'>
                <h2>There is currently no active sprint running.</h2>
                <h2>Do you want to start a sprint now?</h2>
              </div>
              <Button size='large' style={{ marginRight: 20 }} icon={constants.ICONS.sprint} type='primary' onClick={() => this.setState({ sprintStart: true })}>Yes</Button>
              <Button size='large' icon={constants.ICONS.board}>Bring me back to the board overview</Button>
            </div>
          </Col>
        </Row>
      </div>
    )

    const toDos = _.filter(filteredTasks, { lane: constants.SWIMLANES.toDo })
    const toDoComponents = []

    _.map(toDos, toDo => {
      let result = _.find(users, { _id: toDo.assignee })
      let assignee = `${result.first} ${result.last}`
      toDoComponents.push(
        <TaskDrag
          assignee={assignee}
          onClick={() => this.props.history.push('/update/task/' + toDo._id)}
          lane={toDo.lane}
          key={toDo._id}
          descr={toDo.descr}
          id={toDo._id}
          title={toDo.title}
          type={toDo.type}
          isDropped={this.isDropped(toDo._id)}
        />
      )
    })

    const toDoLane = _.find(swimlanes, { type: constants.SWIMLANES.toDo })

    const currentDay = moment()
    const onDayLeft = moment(sprint.end).diff(currentDay, 'days') === 1
    const parsedEnd = moment(sprint.end).fromNow()

    const menu = (
      <Menu onClick={this._handleMenuClick}>
        <Menu.Item key='1' class='menu-item'><Icon type={constants.ICONS.closeSprint} /> close sprint</Menu.Item>
        <Menu.Item key='2' class='menu-item'><Icon type={constants.ICONS.edit} /> edit sprint</Menu.Item>
      </Menu>
    )

    const customPanelStyle = {
      marginBottom: 10,
      // border: 0
    }

    return (
      <div>
        <TaskModal initialSprint={sprint._id} onClose={() => this.setState({ taskModal: false })} type={this.state.taskType} onTypeSwitch={type => this.setState({ taskType: type })} visible={this.state.taskModal} />
        <Row class='item'>
          <Col span={20}>
            <h1 class='header-line'><Icon type={constants.ICONS.sprint} /> ACTIVE SPRINT - {sprint.name}</h1>
            <div style={{ fontSize: 18, fontWeight: 'bold', color: onDayLeft ? '#108ee9' : '' }}><Icon type={constants.ICONS.calendar} /> ends {parsedEnd}</div>
          </Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            <Dropdown overlay={menu}>
              <Button style={{ marginLeft: 8 }}>
                <Icon size='large' type={constants.ICONS.menu} /> <Icon type='down' />
              </Button>
            </Dropdown>
          </Col>
        </Row>
        <Row class='item'>
          <Col span={20}>
            <div style={{ padding: 14, borderColor: '#efefef', borderWidth: 2, borderStyle: 'solid', borderRadius: 8 }}>
              <Steps current={5}>
                <Step icon={constants.ICONS.toDo} title='to do' description='task is not processed yet' />
                <Step icon={constants.ICONS.inProgress} title='in progress' description='you are currently working on' />
                <Step icon={constants.ICONS.onHold} title='on hold' description='this work is waiting for feedback' />
                <Step icon={constants.ICONS.resolved} title='resolved' description='this work is finished, but could be reopened again' />
                <Step icon={constants.ICONS.done} title='done' description='this work is finished' />
              </Steps>
            </div>
          </Col>
          <Col span={2} offset={2}>
            <Anchor style={{ background: 'none' }} showInkInFixed>
              <Link href='#top' title={<Button size='large' type='ghost' icon={constants.ICONS.top} />} />
              <Link href='#toDo' title={<Button shape='circle' size='large' type='primary' icon={constants.ICONS.toDo} />} />
              <Link href='#inProgress' title={<Button shape='circle' size='large' type='primary' icon={constants.ICONS.inProgress} />} />
              <Link href='#backlog' title={<Button shape='circle' size='large' type='primary' icon={constants.ICONS.backlog} />} />
            </Anchor>
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
        <Row class='item' id='toDo'>
          <Col span={18}>
            <Collapse bordered={false} defaultActiveKey={[this.state.toDoPanel]}>
              <Panel style={customPanelStyle} header={
                <Row>
                  <Col>
                    <h2 style={{ marginLeft: 14 }}><Icon type={constants.ICONS.toDo} /> to do</h2>
                  </Col>
                </Row>
              } key='1'>
                <Row class='item'>
                  <Col>
                    <Swimlane
                      type={toDoLane.type}
                      tasks={toDoComponents}
                      accepts={toDoLane.accepts}
                      lastDroppedItem={toDoLane.lastDroppedItem}
                      onDrop={item => this._handleDrop(item, toDoLane.type)}
                    />
                  </Col>
                </Row>
              </Panel>
            </Collapse>
          </Col>
        </Row>
        <Row class='item' id='inProgress'>
          <Col span={24}>
            <Collapse bordered={false} defaultActiveKey={[this.state.inProgressPanel]}>
              <Panel style={customPanelStyle} header={
                <Row class='item' gutter={24}>
                  <Col span={6}>
                    <h2 style={{ marginLeft: 14 }}><Icon type={constants.ICONS.inProgress} /> in progress</h2>
                  </Col>
                  <Col span={6}>
                    <h2 style={{ marginLeft: 14 }}><Icon type={constants.ICONS.onHold} /> on hold</h2>
                  </Col>
                  <Col span={6}>
                    <h2 style={{ marginLeft: 14 }}><Icon type={constants.ICONS.resolved} /> resolved</h2>
                  </Col>
                  <Col span={6}>
                    <h2 style={{ marginLeft: 14 }}><Icon type={constants.ICONS.done} /> done</h2>
                  </Col>
                </Row>
              } key='1'>
                <Row class='item' gutter={24}>
                  {_.map(swimlanes, swimlane => {
                    if (swimlane.type === constants.SWIMLANES.toDo) return
                    let relTasks = []
                    const filtered = _.filter(filteredTasks, { lane: swimlane.type, sprint: sprint._id })
                    _.map(filtered, task => {
                      let result = _.find(users, { _id: task.assignee })
                      let assignee = `${result.first} ${result.last}`
                      relTasks.push(
                        <TaskDrag
                          lane={task.lane}
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
                            onDrop={item => this._handleDrop(item, swimlane.type)}
                          />
                        </div>
                      </Col>
                    )
                  })}
                </Row>
              </Panel>
            </Collapse>
          </Col>
        </Row>
        <Row class='item'>
          <Col span={20}>
            <h1 id='backlog' class='header-line'><Icon type={constants.ICONS.backlog} /> BACKLOG</h1>
          </Col>
        </Row>
        {!backlog.length ? (
          <Row class='item' type='flex' align='center'>
            <Col>
              <div style={{ textAlign: 'center', borderRadius: 6, border: '1px solid #cfcfcf', backgroundColor: '#efefef', padding: 20 }}>
                <div class='item'>
                  <h2>There are currently no tasks in your backlog.</h2>
                  <h2>Do you want to create a task now?</h2>
                </div>
                <Button size='large' style={{ marginRight: 20 }} icon={constants.ICONS.task} type='primary' onClick={() => this.setState({ taskModal: true })}>Yes</Button>
              </div>
            </Col>
          </Row>
        ) : (
          <Row gutter={24}>
            {_.map(backlog, task => {
              let result = _.find(users, { _id: task.assignee })
              let assignee = `${result.first} ${result.last}`
              return (
                <Col span={6} key={task._id}>
                  <TaskDrag
                    assignee={assignee}
                    onClick={() => this.props.history.push('/update/task/' + task._id)}
                    key={task._id}
                    descr={task.descr}
                    lane={task.lane}
                    id={task._id}
                    title={task.title}
                    type={task.type}
                    isDropped={this.isDropped(task._id)}
                  />
                </Col>
              )
            })}
          </Row>
        )}
      </div>
    )
  }

  _handleMenuClick = e => {
    if (e.key === '1') return true //close sprint
    if (e.key === '2') return true //edit sprint
  }

  _handleDrop = (item, isInLane) => {
    const { id, lane } = item
    if (lane === isInLane) return
    this.props.dispatch(taskUpdate({ _id: id }, { lane: isInLane, sprint: this.props.sprint._id }))
  }
}
