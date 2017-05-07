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
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
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
    let icon = 'bars'

    if (type === constants.TASK.types.incident) icon = 'exception'
    if (type === constants.TASK.types.epic) icon = 'trophy'
    if (type === constants.TASK.types.meeting) icon = 'flag'

    const taskTitle = (
      <div>
        <Row>
          <Col span={20}>
            {title}
          </Col>
          <Col style={{ textAlign: 'right', color: '#108ee9' }} span={4}>
            <Icon style={{ fontSize: 16 }} type={icon} />
          </Col>
        </Row>
      </div>
    )
    
    return connectDragSource(
      <div style={{ marginBottom: 10 }}>
        <Card onClick={this.props.onClick} style={{ cursor: 'pointer', opacity }} title={taskTitle}>
          <div style={{ marginTop: -14 }}>{descr}</div>
          <div style={{ marginTop: 8, fontWeight: 'bold', textAlign: 'right' }}><Tag color='#108ee9'>{assignee}</Tag></div>
        </Card>
      </div>
    )
  }
}
