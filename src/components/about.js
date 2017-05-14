import React from 'react'
import ReactDOM from 'react-dom'
import { Icon, Row, Col, Button, Card } from 'antd'
import '../styles/app.css'

const { shell } = window.require('electron')

class About extends React.Component {

  _handleGithub = () => {
    shell.openExternal(process.env.npm_package_homepage)
  }

  _handleIssues = () => {
    shell.openExternal(process.env.npm_package_bugs_url)
  }

  _handleAuthor = () => {
    shell.openExternal('http://mindreport.com')
  }

  _handleLicense = () => {
    shell.openExternal('https://github.com/dreitagebart/crispyScrum/blob/master/LICENSE')
  }

  render () {
    document.title = 'ABOUT'

    const colSpan = 6
    debugger
    return (
      <Row style={{ height: '100%' }} type='flex' align='middle' justify='center'>
        <Col style={{ width: '80%' }}>
          <div style={{ marginBottom: 15, textAlign: 'center' }}>
            <Icon style={{ color: '#cfcfcf', fontSize: 84 }} type='swap' />
            <div style={{ marginTop: -20, fontSize: 48 }}>crispyScrum</div>
          </div>
          <Card>
            <Row class='item' type='flex' align='middle'>
              <Col span={colSpan}><h2>Version</h2></Col>
              <Col><h3>{process.env.npm_package_version}</h3></Col>
            </Row>
            <Row class='item' type='flex' align='middle'>
              <Col span={colSpan}><h2>License</h2></Col>
              <Col><h3><a onClick={() => this._handleLicense()}>{process.env.npm_package_license}</a></h3></Col>
            </Row>
            <Row class='item' type='flex' align='middle'>
              <Col span={colSpan}><h2>Issues</h2></Col>
              <Col>
                <h3>You can report your issues by clicking this button</h3>
              </Col>
            </Row>
            <Row class='item'>
              <Col offset={colSpan}>
                <Button icon='code-o' onClick={() => this._handleIssues()}>report issues</Button>
              </Col>
            </Row>
            <Row class='item'>
              <Col offset={colSpan}>
                <h3>This crispyScrum app is unoppinionated and lovely developed by <a onClick={() => this._handleAuthor()}>{process.env.npm_package_author_name}</a></h3>
              </Col>
            </Row>
            <Row class='item'>
              <Col offset={colSpan}>
                <Button type='primary' icon='github' onClick={() => this._handleGithub()}>visit Github page</Button>  
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    )
  }
}

const about = document.getElementById('about')

ReactDOM.render(<About />, about)
