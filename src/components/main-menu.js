import React from 'react'
import { Link } from 'react-router-dom'
import { Layout, Menu, Icon } from 'antd'
import 'antd/dist/antd.css'

const { SubMenu } = Menu
const { Sider } = Layout

export class MainMenu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      collapsed: false,
      mode: 'inline'
    }
  }
 
  _onCollapse = collapsed => {
    console.log(collapsed)
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline',
    })
  }

  render () {
    return (
      <Sider
        collapsible
        collapsed={this.state.collapsed}
        onCollapse={this._onCollapse}
      >
        <div className='logo' />
        <Menu theme='dark' mode={this.state.mode} defaultSelectedKeys={['6']}>
          <SubMenu
            key='sub1'
            title={<span><Icon type={constants.ICONS.user} /><span className='nav-text'>User</span></span>}
          >
            <Menu.Item key='1'>Tom</Menu.Item>
            <Menu.Item key='2'>Bill</Menu.Item>
            <Menu.Item key='3'>Alex</Menu.Item>
          </SubMenu>
          <SubMenu
            key='sub2'
            title={<span><Icon type={constants.ICONS.team} /><span className='nav-text'>Team</span></span>}
          >
            <Menu.Item key='4'>Team 1</Menu.Item>
            <Menu.Item key='5'>Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key='6'>
            <span>
              <Icon type='file' />
              <span className='nav-text'>File</span>
            </span>
          </Menu.Item>
        </Menu>
      </Sider>
    )
  }
}
