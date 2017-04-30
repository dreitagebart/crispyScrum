import _ from 'lodash'
import React from 'react'
import styles from '../styles'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { Task, Board, BoardCreate, Backlog, Start, Boards, About, Teams, Users, UserCreate, Sprint, SprintCreate } from '../views'
import { sprintFetch, taskFetch, boardFetch, userFetch, dismiss } from '../actions'
import { TaskModal } from './'
import { Button, Modal, Card, Spin, Layout, Menu, Breadcrumb, Icon } from 'antd'
import { connect } from 'react-redux'
import * as constants from '../constants'
import 'antd/dist/antd.css'
import '../styles/app.css'

const { Header, Content, Footer, Sider } = Layout
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

@connect((store, props) => {
  const { appLoading, sprints } = store

  return {
    appLoading,
    sprints
  }
})

export class App extends React.Component {
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
 
  componentWillMount () {
    this.props.dispatch(boardFetch())
    this.props.dispatch(sprintFetch())
    this.props.dispatch(taskFetch())
    this.props.dispatch(userFetch())
  }

  _onCollapse = collapsed => {
    console.log(collapsed)
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline'
    })
  }

  _handleTopMenuClick = e => {
    let taskModal = false
    let taskTitle = this.state.taskTitle
    let taskType = this.state.taskType

    if (_.startsWith(e.key, 'task')) {
      taskModal = true
      const split = _.split(e.key, ':')
      const type = split[1]
      switch (type) {
        case constants.TASK.types.epic: {
          taskType = type
          taskTitle = 'create new EPIC'
          break
        }
        case constants.TASK.types.incident: {
          taskType = type
          taskTitle = 'create new INCIDENT'
          break
        }
        case constants.TASK.types.meeting: {
          taskType = type
          taskTitle = 'create new MEETING'
          break
        }
      }
    }
    this.setState({
      taskType,
      taskTitle,
      taskModal,
      topMenu: e.key
    })
  }

  render = () => {
    if (this.props.appLoading) return (
      <div style={{ marginTop: '20%', textAlign: 'center' }}>
        <Spin delay={2000} size='large' />
      </div>
    )
    
    return (
      <Router>
        <div>
          <TaskModal closeFn={() => this.setState({ taskModal: false })} title={this.state.taskTitle} type={this.state.taskType} visible={this.state.taskModal} />
          <Layout>
            <Sider
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this._onCollapse}
            >
              <Link to='/'><div class='logo' /></Link>
              <Menu theme='dark' mode={this.state.mode} defaultSelectedKeys={['sub1']}>
                <SubMenu
                  key='sub1'
                  title={<span><Icon type='swap' /><span className='nav-text'>Sprints</span></span>}
                >
                  <Menu.Item>
                    <Link to='/create/sprint'>
                      <Icon type='plus-square-o' />
                      <span class='nav-text'>new sprint</span>
                    </Link>
                  </Menu.Item>
                  {_.map(this.props.sprints, sprint => {
                    return <Menu.Item key={sprint._id}><Link to={'/sprint/' + sprint._id}>{sprint.name}</Link></Menu.Item>
                  })}
                </SubMenu>
                <Menu.Item>
                  <Link to='/users'>
                    <Icon type='user' />
                    <span class='nav-text'>Users</span>
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link to='/teams'>
                    <Icon size='large' type='customer-service' />
                    <span class='nav-text'>Teams</span>
                  </Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout>
              <Header style={{ background: '#fff', padding: 0 }}>
                <Menu
                  onClick={this._handleTopMenuClick}
                  selectedKeys={[this.state.topMenu]}
                  mode='horizontal'
                >
                  <Menu.Item key='boards'>
                    <Link to='/boards'>
                      <Icon type='bars' />Boards
                    </Link>
                  </Menu.Item>
                  <Menu.Item key='backlog'>
                    <Link to='/backlog'>
                      <Icon type='inbox' />Backlog
                    </Link>
                  </Menu.Item>
                  <SubMenu title={<span><Icon type='appstore' />Task ...</span>}>
                    <MenuItemGroup title='choose your type'>
                      <Menu.Item key={'task:' + constants.TASK.types.meeting}>meeting</Menu.Item>
                      <Menu.Item key={'task:' + constants.TASK.types.incident}>incident</Menu.Item>
                      <Menu.Item key={'task:' + constants.TASK.types.epic}>epic</Menu.Item>
                    </MenuItemGroup>
                  </SubMenu>
                </Menu>
              </Header>
              <Content style={{ margin: '0 16px' }}>
                <Breadcrumb style={{ margin: '12px 0' }}>
                  <Breadcrumb.Item>User</Breadcrumb.Item>
                  <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                  <Route exact path='/' component={Boards} />
                  <Route exact path='/create/sprint' component={SprintCreate} />
                  <Route exact path='/create/user' component={UserCreate} />
                  <Route exact path='/create/board' component={BoardCreate} />
                  <Route path='/sprint/:id' component={Sprint} />
                  <Route path='/about' component={About} />
                  <Route path='/boards' component={Boards} />
                  <Route path='/backlog' component={Backlog} />
                  <Route path='/users' component={Users} />
                  <Route path='/teams' component={Teams} />
                  <Route path='/board/:id' component={Board} />
                  <Route path='/task/:id' component={Task} />
                </div>
              </Content>
              <Footer style={{ textAlign: 'center' }}>
                created by dreitagebart
              </Footer>
            </Layout>
          </Layout>
        </div>
      </Router>
    )
  }
}
