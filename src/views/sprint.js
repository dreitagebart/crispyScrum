import _ from 'lodash'
import React from 'react'
import { connect } from 'react-redux'

@connect((store, props) => {
  const { sprints } = store
  return {
    sprint: _.find(sprints, { _id: props.match.params.id })
  }
})

export class Sprint extends React.Component {
  constructor (props) {
    super(props)
    
    this.state = {
      params: null
    }
  }

  render () {
    const { sprint } = this.props
    return (
      <div>I am Sprint {sprint.name}</div>
    )
  }
}
