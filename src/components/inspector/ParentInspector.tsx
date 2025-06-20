import React from 'react'
import { useSelectedComponentParent } from '~hooks/useKarmycStore'
import ElementListItem from '~components/inspector/elements-list/ElementListItem'
import useDispatch from '~hooks/useDispatch'

const ParentInspector = () => {
  const parentComponent = useSelectedComponentParent()
  const dispatch = useDispatch()

  const onSelect = () => {
    dispatch.components.select(parentComponent.id)
  }

  const onHover = () => {
    dispatch.components.hover(parentComponent.id)
  }

  const onUnhover = () => {
    dispatch.components.unhover()
  }

  return (
    <ElementListItem
      type={parentComponent.type}
      onMouseOver={onHover}
      onMouseOut={onUnhover}
      onSelect={onSelect}
    />
  )
}

export default ParentInspector
