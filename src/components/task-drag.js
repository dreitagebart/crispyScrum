import React from 'react'
import PropTypes from 'prop-types'
import { DragSource } from 'react-dnd'
import { Tag, Card, Icon, Row, Col } from 'antd'
import * as constants from '../constants'

const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left'
}

const taskSource = {
  beginDrag(props) {
    return {
      id: props.id,
      title: props.title
    }
  }
}

@DragSource(props => props.type, taskSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))

export class TaskDrag extends React.Component {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func,
    isDragging: PropTypes.bool,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    descr: PropTypes.string,
    type: PropTypes.string.isRequired,
    assignee: PropTypes.string,
    isDropped: PropTypes.bool.isRequired
  }

  render () {
    const { title, assignee, type, descr, id, isDropped, isDragging, connectDragSource } = this.props
    const opacity = isDragging ? 0.4 : 1
    let icon = constants.ICONS.task

    if (type === constants.TASK.types.incident) icon = constants.ICONS.incident
    if (type === constants.TASK.types.epic) icon = constants.ICONS.epic
    if (type === constants.TASK.types.meeting) icon = constants.ICONS.meeting

    const taskTitle = (
      <Row>
        <Col span={20}>
          <div style={{ marginTop: -14 }}>
            <h3>{title}</h3>
          </div>
        </Col>
      </Row>
    )
    
    return connectDragSource(
      <div style={{ marginBottom: 10 }}>
        <Card onClick={this.props.onClick} style={{ cursor: 'pointer', opacity }} extra={<Icon style={{ color: '#108ee9', fontSize: 16 }} type={icon} />}>
          {taskTitle}
          <div style={{ fontSize: 14, marginBottom: 14 }}>{descr}</div>
          <div style={{ fontWeight: 'bold', textAlign: 'right' }}><Tag color='#108ee9'>{assignee}</Tag></div>
        </Card>
      </div>
    )
  }
}
