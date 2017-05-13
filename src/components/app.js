import _ from 'lodash'
import React from 'react'
import styles from '../styles'
import moment from 'moment'
import createHistory from 'history/createBrowserHistory'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { TaskDetached, BoardUpdate, TaskUpdate, User, Task, Board, BoardCreate, Backlog, Start, Boards, About, Teams, Users, UserCreate, Sprint, Admin } from '../views'
import { ConnectedRouter } from 'react-router-redux'
import { sprintFetch, taskFetch, boardFetch, boardSelect, userFetch, dismiss } from '../actions'
import { TaskModal, BreadCrumbs, HeaderMenu, SideMenu } from './'
import { Button, Modal, Card, Spin, Layout, Menu, Icon } from 'antd'
import { connect } from 'react-redux'
import * as constants from '../constants'
import 'antd/dist/antd.css'
import '../styles/app.css'

moment.locale('en')

const history = createHistory()
const { Content, Footer, Sider } = Layout
const SubMenu = Menu.SubMenu
const MenuItemGroup = Menu.ItemGroup

@connect((store, props) => {
  const { currentUser, appLoading, sprints, boards, users } = store.root

  return {
    user: _.find(users, { _id: currentUser }),
    appLoading,
    sprints,
    boards
  }
})

export class App extends React.Component {
  componentWillMount () {
    this.props.dispatch(boardFetch())
    this.props.dispatch(sprintFetch())
    this.props.dispatch(taskFetch())
    this.props.dispatch(userFetch())
  }

  render = () => {
    const { boards, user } = this.props

    if (this.props.appLoading) return (
      <div style={{ marginTop: '20%', textAlign: 'center' }}>
        <Spin size='large' />
      </div>
    )

    return (
      <ConnectedRouter history={history}>
        <div id='top'>
          <Layout>
            <Sider width={300}>
              <Route path='/' component={SideMenu} />
            </Sider>
            <Layout>
              <Route path='/' component={HeaderMenu} />
              <Content style={{ margin: '0 24px' }}>
                <Route path='/' component={BreadCrumbs} />
                <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                  <Route exact path='/' component={Boards} />
                  <Route exact path='/create/user' component={UserCreate} />
                  <Route exact path='/create/board' component={BoardCreate} />
                  <Route exact path='/update/board' component={BoardUpdate} />
                  <Route exact path='/update/task/:id' component={TaskUpdate} />
                  <Route path='/sprint' component={Sprint} />
                  <Route path='/about' component={About} />
                  <Route path='/boards' component={Boards} />
                  <Route path='/backlog' component={Backlog} />
                  <Route path='/users' component={Users} />
                  <Route path='/teams' component={Teams} />
                  <Route path='/user/:id' component={User} />
                  <Route path='/board' component={Board} />
                  <Route path='/task/:id' component={Task} />
                  <Route path='/admin' component={Admin} />
                </div>
              </Content>
              <Footer style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 14 }}><span style={{ color: '#0e77ca' }}><Icon type='code-o' /></span> with <span style={{ color: '#f04134' }}><Icon type='heart' /></span> by dreitagebart</div>
              </Footer>
            </Layout>
          </Layout>
        </div>
      </ConnectedRouter>
    )
  }
}
