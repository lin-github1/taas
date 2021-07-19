import React from 'react'

export default (props) => {
  return React.Children.map(props.children, childrenItem => {
    return React.cloneElement(childrenItem, { user: props.user || {} })
  })
}
