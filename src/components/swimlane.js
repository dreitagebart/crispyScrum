import React from 'react'
import PropTypes from 'prop-types'
import { DropTarget } from 'react-dnd'

const swimlaneTarget = {
  drop(props, monitor) {
    props.onDrop(monitor.getItem())
  }
}

@DropTarget(props => props.accepts, swimlaneTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop()
}))

export class Swimlane extends React.Component {
  static propTypes = {
    tasks: PropTypes.arrayOf(PropTypes.object),
    type: PropTypes.number.isRequired,
    connectDropTarget: PropTypes.func,
    isOver: PropTypes.bool,
    canDrop: PropTypes.bool,
    accepts: PropTypes.arrayOf(PropTypes.string).isRequired,
    lastDroppedItem: PropTypes.object,
    onDrop: PropTypes.func.isRequired
  }

  render () {
    const { tasks, accepts, isOver, canDrop, connectDropTarget, lastDroppedItem } = this.props
    const isActive = isOver && canDrop
    let backgroundColor = '#efefef'

    if (isActive) {
      backgroundColor = '#cfcfcf'
    } else if (canDrop) {
      backgroundColor = '#efefef'
    }

    return connectDropTarget(
      <div style={{ minHeight: 500, backgroundColor, borderRadius: 6 }}>
        {tasks}
        {lastDroppedItem ? <p>Last dropped: {JSON.stringify(lastDroppedItem)}</p> : null}
      </div>
    )
  }
}
