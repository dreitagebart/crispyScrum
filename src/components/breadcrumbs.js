import React from 'react'
import { Breadcrumb } from 'antd'
import { connect } from 'react-redux'

@connect((store, props) => {
  return store
})

export class BreadCrumbs extends React.Component {
  render () {
    const { props } = this

    return (
      <Breadcrumb style={{ margin: '12px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
      </Breadcrumb>
    )
  }
}
