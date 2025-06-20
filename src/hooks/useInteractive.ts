import { useRef, MouseEvent } from 'react'
import useDispatch from './useDispatch'
import { useDrag } from 'react-dnd'
import {
  useIsSelectedComponent,
  useIsHovered,
  useShowLayout,
  useFocusedComponent,
} from './useKarmycStore'

export const useInteractive = (
  component: IComponent,
  enableVisualHelper = false,
  withoutComponentProps = false,
) => {
  const dispatch = useDispatch()
  const showLayout = useShowLayout()
  const isComponentSelected = useIsSelectedComponent(component.id)
  const isHovered = useIsHovered(component.id)
  const focusInput = useFocusedComponent(component.id)

  const [, drag] = useDrag({
    type: component.type || 'component',
    item: { id: component.id, type: component.type, isMoved: true },
  })

  const ref = useRef<HTMLDivElement>(null)
  let props = {
    ...(withoutComponentProps ? {} : component.props),
    onMouseOver: (event: MouseEvent) => {
      event.stopPropagation()
      dispatch.components.hover(component.id)
    },
    onMouseOut: () => {
      dispatch.components.unhover()
    },
    onClick: (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      dispatch.components.select(component.id)
    },
    onDoubleClick: (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      if (focusInput === false) {
        dispatch.app.toggleInputText()
      }
    },
  }

  if (showLayout && enableVisualHelper) {
    props = {
      ...props,
      border: `1px dashed #718096`,
      padding: props.p || props.padding ? props.p || props.padding : 4,
    }
  }

  if (isHovered || isComponentSelected) {
    props = {
      ...props,
      boxShadow: `${focusInput ? '#ffc4c7' : '#4FD1C5'} 0px 0px 0px 2px inset`,
    }
  }

  return { props, ref: drag(ref), drag }
}
