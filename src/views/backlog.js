import _ from 'lodash'
import React from 'react'
import { Table, Button, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

@connect((store, props) => {
  const { tasks } = store.root
  return {
    tasks
  }
})

export class Backlog extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      filteredInfo: null,
      sortedInfo: null
    }
  }

  render () {
    let { tasks } = this.props
    tasks = _.map(tasks, task => {
      return {...task, key: task._id}
    })

    let { sortedInfo, filteredInfo } = this.state
    sortedInfo = sortedInfo || {}
    filteredInfo = filteredInfo || {}

    const columns = [{
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <a href='#'>{record.title}</a>
      ),
      onCellClick: this._handleCellClick,
      // filters: [
      //   { text: 'Joe', value: 'Joe' },
      //   { text: 'Jim', value: 'Jim' }
      // ],
      // filteredValue: filteredInfo.title || null,
      // onFilter: (value, record) => record.title.includes(value),
      sorter: (a, b) => a.title.length - b.title.length,
      sortOrder: sortedInfo.columnKey === 'title' && sortedInfo.order
    }]

    return (
      <div>
        <Row style={{ marginBottom: 20 }}>
          <Col span={24}><h1>Backlog</h1></Col>
        </Row>
        <Row>
          <Col>
            <Table columns={columns} dataSource={tasks} onChange={this._handleChange} />
          </Col>
        </Row>
      </div>
    )
  }

  _setTitleSort = () => {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'title'
      }
    })
  }

  _clearFilters = () => {
    this.setState({ filteredInfo: null })
  }

  _clearAll = () => {
    this.setState({
      filteredInfo: null,
      sortedInfo: null
    })
  }

  _handleCellClick = record => {
    this.props.history.push('/update/task/' + record._id)
  }

  _handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter)
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    })
  }
}
