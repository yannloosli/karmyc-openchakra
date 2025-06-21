import { useCallback, useState, useEffect, useMemo } from 'react'
import { 
  actions, 
  getState, 
  getShowLayout, 
  getShowCode, 
  getFocusedComponent, 
  getInputTextFocused,
  getComponents,
  getComponentBy,
  getSelectedComponent,
  getPropsForSelectedComponent,
  getSelectedComponentId,
  getIsSelectedComponent,
  getSelectedComponentChildren,
  getSelectedComponentParent,
  getHoveredId,
  getIsHovered,
  getComponentNames,
  subscribeToStateChanges
} from '~core/karmyc-plugin'

// Types pour la compatibilité
type ComponentType = 'Box' | 'Button' | 'Flex' | 'Image' | 'Link' | 'Menu' | 'Tab' | 'Tabs' | 'TabList' | 'TabPanel' | 'TabPanels' | 'Text'

interface IComponent {
  children: string[]
  type: ComponentType
  parent: string
  id: string
  props: any
  rootParentType?: ComponentType
  componentName?: string
}

interface IComponents {
  [name: string]: IComponent
}

// Hook pour remplacer useDispatch
export const useKarmycDispatch = () => {
  // Créer un objet avec les actions typées
  const typedDispatch = {
    app: {
      toggleBuilderMode: () => actions.toggleBuilderMode(),
      toggleCodePanel: () => actions.toggleCodePanel(),
      toggleInputText: () => actions.toggleInputText(),
      setOverlay: (overlay: any) => actions.setOverlay(overlay),
    },
    components: {
      reset: (components?: IComponents) => actions.reset(components),
      loadDemo: (type: any) => actions.loadDemo(type),
      resetProps: (componentId: string) => actions.resetProps(componentId),
      updateProps: (payload: { id: string; name: string; value: string }) => 
        actions.updateProps(payload),
      deleteProps: (payload: { id: string; name: string }) => 
        actions.deleteProps(payload),
      deleteComponent: (componentId: string) => 
        actions.deleteComponent(componentId),
      moveComponent: (payload: { parentId: string; componentId: string }) => 
        actions.moveComponent(payload),
      moveSelectedComponentChildren: (payload: { fromIndex: number; toIndex: number }) => 
        actions.moveSelectedComponentChildren(payload),
      addComponent: (payload: { parentName: string; type: ComponentType; rootParentType?: ComponentType; testId?: string }) => 
        actions.addComponent(payload),
      addMetaComponent: (payload: { components: IComponents; root: string; parent: string }) => 
        actions.addMetaComponent(payload),
      select: (selectedId: IComponent['id']) => actions.select(selectedId),
      unselect: () => actions.unselect(),
      selectParent: () => actions.selectParent(),
      duplicate: () => actions.duplicate(),
      setComponentName: (payload: { componentId: string; name: string }) => 
        actions.setComponentName(payload),
      hover: (componentId: IComponent['id']) => actions.hover(componentId),
      unhover: () => actions.unhover(),
    },
    undo: () => actions.undo(),
    redo: () => actions.redo(),
    // Actions de persistance
    saveToSpace: () => actions.saveToSpace(),
    loadFromSpace: (spaceData: any) => actions.loadFromSpace(spaceData),
  }

  return typedDispatch
}

// Hook pour remplacer useSelector avec réactivité
export const useKarmycSelector = <T>(selector: () => T): T => {
  // Utiliser useMemo pour éviter les recalculs inutiles et les appels pendant le rendu
  const initialValue = useMemo(() => selector(), [])
  const [value, setValue] = useState<T>(initialValue)

  useEffect(() => {
    let isSubscribed = true
    
    const unsubscribe = subscribeToStateChanges(() => {
      // Utiliser requestAnimationFrame pour éviter les mises à jour pendant le rendu
      requestAnimationFrame(() => {
        if (isSubscribed) {
          setValue(selector())
        }
      })
    })
    
    return () => {
      isSubscribed = false
      unsubscribe()
    }
  }, [selector])

  return value
}

// Hooks spécifiques pour les selectors les plus utilisés
export const useShowLayout = () => useKarmycSelector(getShowLayout)
export const useShowCode = () => useKarmycSelector(getShowCode)
export const useFocusedComponent = (id: IComponent['id']) => useKarmycSelector(() => getFocusedComponent(id))
export const useInputTextFocused = () => useKarmycSelector(getInputTextFocused)
export const useComponents = () => useKarmycSelector(getComponents)
export const useComponentBy = (nameOrId: string | IComponent['id']) => useKarmycSelector(() => getComponentBy(nameOrId))
export const useSelectedComponent = () => useKarmycSelector(getSelectedComponent)
export const usePropsForSelectedComponent = (propsName: string) => useKarmycSelector(() => getPropsForSelectedComponent(propsName))
export const useSelectedComponentId = () => useKarmycSelector(getSelectedComponentId)
export const useIsSelectedComponent = (componentId: IComponent['id']) => useKarmycSelector(() => getIsSelectedComponent(componentId))
export const useSelectedComponentChildren = () => useKarmycSelector(getSelectedComponentChildren)
export const useSelectedComponentParent = () => useKarmycSelector(getSelectedComponentParent)
export const useHoveredId = () => useKarmycSelector(getHoveredId)
export const useIsHovered = (id: IComponent['id']) => useKarmycSelector(() => getIsHovered(id))
export const useComponentNames = () => useKarmycSelector(getComponentNames)

// Hooks pour la persistance
export const usePersistState = () => {
  const dispatch = useKarmycDispatch()
  
  const saveToSpace = useCallback(() => {
    return dispatch.saveToSpace()
  }, [dispatch])

  const loadFromSpace = useCallback((spaceData: any) => {
    return dispatch.loadFromSpace(spaceData)
  }, [dispatch])

  return {
    saveToSpace,
    loadFromSpace,
  }
}

// Hook pour obtenir l'état complet
export const useFullState = () => {
  return useKarmycSelector(getState)
} 
