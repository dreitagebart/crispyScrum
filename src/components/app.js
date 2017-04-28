import React from 'react'
import styles from '../styles'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Start, About } from '../views'
import { Layout, Menu, Breadcrumb, Icon } from 'antd'
import 'antd/dist/antd.css'

const { Header, Content, Footer, Sider } = Layout
const SubMenu = Menu.SubMenu

export class App extends React.Component {
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
      <Router>
        <div>
          <Layout>
            <Sider
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this._onCollapse}
            >
              <div className='logo' />
              <Menu theme='dark' mode={this.state.mode} defaultSelectedKeys={['6']}>
                <SubMenu
                  key='sub1'
                  title={<span><Icon type='user' /><span className='nav-text'>User</span></span>}
                >
                  <Menu.Item key='1'>Tom</Menu.Item>
                  <Menu.Item key='2'>Bill</Menu.Item>
                  <Menu.Item key='3'>Alex</Menu.Item>
                </SubMenu>
                <SubMenu
                  key='sub2'
                  title={<span><Icon type='team' /><span className='nav-text'>Team</span></span>}
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
            <Layout>
              <Header style={{ background: '#fff', padding: 0 }} />
              <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '12px 0' }}>
                  <Breadcrumb.Item>User</Breadcrumb.Item>
                  <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                  <Route exact path='/' component={Start} />
                  <Route path='/about' component={About} />
                </div>
              </Content>
              <Footer style={{ textAlign: 'center' }}>
                Ant Design ©2016 Created by Ant UED
              </Footer>
            </Layout>
          </Layout>
        </div>
      </Router>
    )
  }
}