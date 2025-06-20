import React from 'react'
import { useSelectedComponentChildren } from '~hooks/useKarmycStore'
import ElementsList from '~components/inspector/elements-list/ElementsList'
import useDispatch from '~hooks/useDispatch'

const ChildrenInspector = () => {
  const childrenComponent = useSelectedComponentChildren()
  const dispatch = useDispatch()

  const moveChildren = (fromIndex: number, toIndex: number) => {
    dispatch.components.moveSelectedComponentChildren({
      fromIndex,
      toIndex,
    })
  }

  const onSelectChild = (id: IComponent['id']) => {
    dispatch.components.select(id)
  }

  const onHoverChild = (id: IComponent['id']) => {
    dispatch.components.hover(id)
  }

  const onUnhoverChild = () => {
    dispatch.components.unhover()
  }

  return (
    <ElementsList
      elements={childrenComponent}
      moveItem={moveChildren}
      onSelect={onSelectChild}
      onHover={onHoverChild}
      onUnhover={onUnhoverChild}
    />
  )
}

export default ChildrenInspector
