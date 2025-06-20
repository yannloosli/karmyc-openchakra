import { useSelectedComponent, usePropsForSelectedComponent } from './useKarmycStore'
import { getDefaultFormProps } from '~utils/defaultProps'
import { useInspectorUpdate } from '~contexts/inspector-context'
import { useEffect } from 'react'

const usePropsSelector = (propsName: string) => {
  const { addActiveProps } = useInspectorUpdate()

  useEffect(() => {
    // Register form props name for custom props panel
    addActiveProps(propsName)
  }, [addActiveProps, propsName])

  const component = useSelectedComponent()
  const value = usePropsForSelectedComponent(propsName)

  if (value !== undefined) {
    return value
  }

  // Fallback pour les props par défaut
  if (component) {
    const defaultProps = getDefaultFormProps(component.type || 'Box')
    if (defaultProps[propsName] !== undefined) {
      return defaultProps[propsName]
    }
  }

  return ''
}

export default usePropsSelector
