import _ from 'lodash'
import React from 'react'
import { Layout, Menu, Icon } from 'antd'
import { connect } from 'react-redux'
import { TaskModal } from './'
import { boardSelect } from '../actions'
import * as constants from '../constants'

const { Header } = Layout
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

@connect((store, props) => {
  const { boards, currentUser, users } = store.root

  return { 
    user: _.find(users, { _id: currentUser }),
    boards
  }
})

export class HeaderMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      taskType: constants.TASK.types.incident,
      taskModal: false,
      collapsed: false,
      mode: 'inline'
    }
  }

  _handleTaskClick = type => {
    let taskType
  
    switch (type) {
      case constants.TASK.types.epic: {
        taskType = type
        break
      }
      case constants.TASK.types.incident: {
        taskType = type
        break
      }
      case constants.TASK.types.meeting: {
        taskType = type
        break
      }
    }

    this.setState({
      taskType,
      taskModal: true
    })
  }

  render () {
    const { boards, user } = this.props

    return (
      <div>
        <TaskModal onClose={() => this.setState({ taskModal: false })} title={this.state.taskTitle} type={this.state.taskType} onTypeSwitch={type => this.setState({ taskType: type })} visible={this.state.taskModal} />
        <Header style={{ backgroundColor: '#efefef', padding: 0 }}>
          <Menu mode='horizontal' style={{ fontSize: 16 }}>
            <SubMenu title={<span><Icon type={constants.ICONS.board} /> BOARDS </span>}>
              <MenuItemGroup title='choose your board'>
                {_.map(boards, board => {
                  return (
                    <Menu.Item key={board._id}>
                      <a onClick={() => {
                        this.props.history.push('/board/' + board._id)
                        this.props.dispatch(boardSelect(user._id, board._id))
                      }}>{board.title}</a>
                    </Menu.Item>
                  )
                })}
                <Menu.Item>
                  <a onClick={() => this.props.history.push('/boards')}><span style={{ fontWeight: 'bold' }}><Icon type={constants.ICONS.boardIndex} />BOARD INDEX</span></a>
                </Menu.Item>
              </MenuItemGroup>
            </SubMenu>
            <Menu.Item key='backlog'>
              <a onClick={() => this.props.history.push('/backlog')}>
                <Icon type={constants.ICONS.backlog} /> BACKLOG
              </a>
            </Menu.Item>
            <SubMenu title={<span><Icon type={constants.ICONS.task} />TASK</span>}>
              <MenuItemGroup title='create task'>
                <Menu.Item>
                  <a onClick={() => this._handleTaskClick(constants.TASK.types.incident)}>
                    <Icon type={constants.ICONS.incident} />
                    <span class='nav-text'>Incident</span>
                  </a>
                </Menu.Item>
                <Menu.Item>
                  <a onClick={() => this._handleTaskClick(constants.TASK.types.meeting)}>
                    <Icon type={constants.ICONS.meeting} />
                    <span class='nav-text'>Meeting</span>
                  </a>
                </Menu.Item>
                <Menu.Item>
                  <a onClick={() => this._handleTaskClick(constants.TASK.types.epic)}>
                    <Icon type={constants.ICONS.epic} />
                    <span class='nav-text'>Epic</span>
                  </a>
                </Menu.Item>
              </MenuItemGroup>
            </SubMenu>
          </Menu>
        </Header>
      </div>
    )
  }
}
