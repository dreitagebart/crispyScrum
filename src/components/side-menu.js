import _ from 'lodash'
import React from 'react'
import { Menu, Icon, Layout } from 'antd'
import { connect } from 'react-redux'
import { boardSelect } from '../actions'
import * as constants from '../constants'

const { Sider } = Layout
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

@connect((store, props) => {
  const { boards, currentUser, users, selectedBoard } = store.root

  return {
    selectedBoard,
    user: _.find(users, { _id: currentUser }),
    boards
  }
})

export class SideMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      taskTitle: 'create new task',
      taskType: constants.TASK.types.incident,
      taskModal: false,
      topMenu: 'boards',
      collapsed: false,
      mode: 'inline'
    }
  }

  _onCollapse = collapsed => {
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline'
    })
  }

  render () {
    const { boards, user, selectedBoard } = this.props
    let menu = []

    if (!selectedBoard) {
      menu.push(
        <Menu.Item key='noboard'>
          <Icon type='bars' />
          <span class='nav-text'>no board selected...</span>
        </Menu.Item>
      )
    } else {
      const result = _.find(boards, { _id: selectedBoard })

      menu.push(<Menu.Item key='boardOverview'><a onClick={() => this.props.history.push('/board/' + result._id)}><span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>{result.title}</span></a></Menu.Item>)

      menu.push(<Menu.Item key='activeSprint'><a onClick={() => this.props.history.push('/sprint')}><Icon type='rocket' /> Active sprint</a></Menu.Item>)

      menu.push(<Menu.Item key='backlog'><a onClick={() => this.props.history.push('/backlog')}><Icon type='inbox' /> Backlog</a></Menu.Item>)
    }

    return (
      <div>
        <div class='logo'><Icon type='swap' /></div>
        <Menu style={{ fontSize: '1.1em' }} theme='dark' mode={this.state.mode} defaultOpenKeys={['sub1']}>
          <SubMenu
            key='sub1'
            title={<span><Icon type='bars' /><span className='nav-text'>BOARD</span></span>}
          >
            {menu}
          </SubMenu>
          <Menu.Item>
            <a onClick={() => this.props.history.push('/users')}>
              <Icon type='user' />
              <span class='nav-text'>USERS</span>
            </a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={() => this.props.history.push('/teams')}>
              <Icon size='large' type='customer-service' />
              <span class='nav-text'>TEAMS</span>
            </a>
          </Menu.Item>
          <Menu.Item>
            <a onClick={() => this.props.history.push('/admin')}>
              <Icon size='large' type='laptop' />
              <span class='nav-text'>ADMIN</span>
            </a>
          </Menu.Item>
        </Menu>
      </div>
    )
  }

  _renderBoardMenu = () => {
  

    return menu
  }
}
