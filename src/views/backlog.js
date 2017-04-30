import _ from 'lodash'
import React from 'react'
import { Table, Button, Row, Col } from 'antd'
import { connect } from 'react-redux'

@connect((store, props) => {
  const { tasks } = store
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
    const { tasks } = this.props
    let { sortedInfo, filteredInfo } = this.state
    sortedInfo = sortedInfo || {}
    filteredInfo = filteredInfo || {}

    const columns = [{
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      onCellClick: this._handleCellClick,
      filters: [
        { text: 'Joe', value: 'Joe' },
        { text: 'Jim', value: 'Jim' }
      ],
      filteredValue: filteredInfo.title || null,
      onFilter: (value, record) => record.title.includes(value),
      sorter: (a, b) => a.title.length - b.title.length,
      sortOrder: sortedInfo.columnKey === 'title' && sortedInfo.order
    }]

    return (
      <div>
        <Row>
          <Col span={24}><h1>Backlog</h1></Col>
        </Row>
        <Row>
          <Col span={24}>
            <div>
              <div className="table-operations">
                <Button onClick={this._setTitleSort}>Sort title</Button>
                <Button onClick={this._clearFilters}>Clear filters</Button>
                <Button onClick={this._clearAll}>Clear filters and sorters</Button>
              </div>
              <Table columns={columns} dataSource={tasks} onChange={this._handleChange} />
            </div>
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
    this.props.history.push('/task/' + record._id)
  }

  _handleChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter)
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter
    })
  }
}
