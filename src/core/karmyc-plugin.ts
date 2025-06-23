import { IActionPlugin, Action, ActionPriority } from '@gamesberry/karmyc-core'
import { DEFAULT_PROPS } from '~utils/defaultProps'
import templates, { TemplateType } from '~templates'
import { generateId } from '~utils/generateId'
import { duplicateComponent, deleteComponent } from '~utils/recursive'
import omit from 'lodash/omit'
import produce from 'immer'
import { useSpaceHistory } from '@gamesberry/karmyc-core'

// Debug: vérifier si useSpaceHistory est disponible
console.log('useSpaceHistory disponible:', typeof useSpaceHistory !== 'undefined');

// Types pour la compatibilité
export type Overlay = undefined | { rect: DOMRect; id: string; type: ComponentType }

export type AppState = {
  showLayout: boolean
  showCode: boolean
  inputTextFocused: boolean
  overlay: Overlay
}

export type ComponentsState = {
  components: IComponents
  selectedId: IComponent['id']
  hoveredId?: IComponent['id']
}

export type ComponentsStateWithUndo = {
  past: ComponentsState[]
  present: ComponentsState
  future: ComponentsState[]
}

export type RootState = {
  app: AppState
  components: ComponentsStateWithUndo
}

const DEFAULT_ID = 'root'

export const INITIAL_COMPONENTS: IComponents = {
  root: {
    id: DEFAULT_ID,
    parent: DEFAULT_ID,
    type: 'Box' as ComponentType,
    children: [],
    props: {},
  },
}

// État initial
const initialState: RootState = {
  app: {
    showLayout: true,
    showCode: false,
    inputTextFocused: false,
    overlay: undefined,
  },
  components: {
    past: [],
    present: {
      components: INITIAL_COMPONENTS,
      selectedId: DEFAULT_ID,
      hoveredId: undefined,
    },
    future: [],
  },
}

// Clés de persistance
const STORAGE_KEY = 'openchakra-editor-state'
const SPACE_ID = 'openchakra-editor'

// Système de réactivité
type StateChangeCallback = (state: RootState) => void
const stateChangeCallbacks: StateChangeCallback[] = []
let isNotifying = false
let pendingNotifications: RootState[] = []

export const subscribeToStateChanges = (callback: StateChangeCallback) => {
  stateChangeCallbacks.push(callback)
  return () => {
    const index = stateChangeCallbacks.indexOf(callback)
    if (index > -1) {
      stateChangeCallbacks.splice(index, 1)
    }
  }
}

const notifyStateChange = (state: RootState) => {
  if (isNotifying) {
    // Si une notification est déjà en cours, ajouter à la queue
    pendingNotifications.push(state)
    return
  }
  
  isNotifying = true
  
  // Utiliser requestAnimationFrame pour éviter les mises à jour pendant le rendu
  requestAnimationFrame(() => {
    try {
      stateChangeCallbacks.forEach(callback => callback(state))
    } finally {
      isNotifying = false
      
      // Traiter les notifications en attente
      if (pendingNotifications.length > 0) {
        const nextState = pendingNotifications.shift()
        if (nextState) {
          notifyStateChange(nextState)
        }
      }
    }
  })
}

// Fonctions de persistance utilisant l'espace OpenChakra
const saveToStorage = (state: RootState) => {
  try {
    if (typeof window !== 'undefined') {
      // Sauvegarder dans l'espace OpenChakra si disponible
      const spaceId = localStorage.getItem('openchakra-space-id')
      if (spaceId) {
        const spaceDataString = localStorage.getItem(`openchakra-space-${spaceId}`)
        if (spaceDataString) {
          const spaceData = JSON.parse(spaceDataString)
          const currentStoredState = spaceData.sharedState.payload?.openChakraState
          
          // Éviter de sauvegarder si l'état est identique (prévenir les boucles)
          if (JSON.stringify(currentStoredState) !== JSON.stringify(state)) {
            spaceData.sharedState.payload = {
              ...spaceData.sharedState.payload,
              openChakraState: state,
              lastModified: new Date().toISOString()
            }
            localStorage.setItem(`openchakra-space-${spaceId}`, JSON.stringify(spaceData))
            
            // Déclencher un événement de sauvegarde
            window.dispatchEvent(new CustomEvent('openchakra-state-saved', {
              detail: { spaceId, state, isMigration: false }
            }))
          }
          
          return
        }
      }
      
      // Fallback vers l'ancien système si l'espace n'est pas disponible
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  } catch (error) {
    console.warn('Failed to save state to localStorage:', error)
  }
}

const loadFromStorage = (): RootState | null => {
  try {
    if (typeof window !== 'undefined') {
      // Charger depuis l'espace OpenChakra si disponible
      const spaceId = localStorage.getItem('openchakra-space-id')
      if (spaceId) {
        const spaceDataString = localStorage.getItem(`openchakra-space-${spaceId}`)
        if (spaceDataString) {
          const spaceData = JSON.parse(spaceDataString)
          const savedState = spaceData.sharedState.payload?.openChakraState
          if (savedState) {
            console.log('État chargé depuis l\'espace OpenChakra:', spaceId)
            return savedState
          }
        }
      }
      
      // Fallback vers l'ancien système si l'espace n'est pas disponible
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        console.log('État chargé depuis l\'ancien système de stockage')
        return JSON.parse(saved)
      }
    }
  } catch (error) {
    console.warn('Failed to load state from localStorage:', error)
  }
  return null
}

// Store Zustand pour remplacer Redux
let currentState: RootState = loadFromStorage() || { ...initialState }
let isSaving = false // Flag pour éviter les boucles infinies

// Variables globales pour le debouncing
let saveTimeout: NodeJS.Timeout | null = null;
let pendingState: RootState | null = null;

// Fonction pour enregistrer un changement dans l'historique du space
const recordStateChange = (state: RootState) => {
  try {
    const spaceId = localStorage.getItem('openchakra-space-id');
    if (!spaceId) return;

    // Créer un diff pour l'historique
    const diff = {
      type: 'openchakra-state-change',
      timestamp: Date.now(),
      state: state
    };

    // Enregistrer le diff dans l'historique du space
    const spaceDataString = localStorage.getItem(`openchakra-space-${spaceId}`);
    if (spaceDataString) {
      const spaceData = JSON.parse(spaceDataString);
      
      // Initialiser l'historique s'il n'existe pas
      if (!spaceData.history) {
        spaceData.history = {
          past: [],
          present: null,
          future: []
        };
      }

      // Ajouter le changement à l'historique
      if (spaceData.history.present) {
        spaceData.history.past.push(spaceData.history.present);
      }
      spaceData.history.present = diff;
      spaceData.history.future = []; // Vider le futur quand on fait un nouveau changement

      localStorage.setItem(`openchakra-space-${spaceId}`, JSON.stringify(spaceData));
      console.log('Changement enregistré dans l\'historique du space - Timestamp:', diff.timestamp, 'Stack:', new Error().stack?.split('\n')[2]?.trim());
    }
  } catch (error) {
    console.warn('Erreur lors de l\'enregistrement dans l\'historique:', error);
  }
};

// Fonction pour sauvegarder l'état après chaque modification
const saveState = (skipHistory = false) => {
  if (isSaving) return // Éviter les boucles infinies
  
  // Log pour identifier quelle action appelle saveState
  const stack = new Error().stack?.split('\n')[2]?.trim() || 'unknown';
  console.log('saveState appelé - skipHistory:', skipHistory, 'Stack:', stack);
  
  // Si skipHistory = false (vraie modification), sauvegarder immédiatement
  if (!skipHistory) {
    console.log('Sauvegarde immédiate pour vraie modification');
    isSaving = true
    saveToStorage(currentState)
    
    // Enregistrer le changement dans l'historique du space
    console.log('Enregistrement dans l\'historique - skipHistory:', skipHistory);
    recordStateChange(currentState)
    
    // Toujours notifier les changements d'état pour les mises à jour visuelles
    notifyStateChange(currentState)
    
    // Déclencher l'événement pour la persistance automatique
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      console.log('Déclenchement de l\'événement openchakra-state-changed');
      window.dispatchEvent(new CustomEvent('openchakra-state-changed', {
        detail: { state: currentState }
      }))
    }
    
    // Réinitialiser le flag après un délai
    setTimeout(() => {
      isSaving = false
    }, 100)
    
    return
  }
  
  // Pour les actions avec skipHistory = true (hover, select, etc.), utiliser le debouncing
  // Si on a déjà un timeout en cours, on l'annule et on programme une nouvelle sauvegarde
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  // Stocker l'état en attente
  pendingState = currentState;
  
  // Programmer la sauvegarde avec un délai de 100ms
  saveTimeout = setTimeout(() => {
    if (pendingState) {
      isSaving = true
      saveToStorage(pendingState)
      
      // Toujours notifier les changements d'état pour les mises à jour visuelles
      notifyStateChange(pendingState)
      
      // Réinitialiser les variables
      pendingState = null;
      saveTimeout = null;
      
      // Réinitialiser le flag après un délai
      setTimeout(() => {
        isSaving = false
      }, 100)
    }
  }, 100)
}

// Actions Redux migrées
export const actions = {
  // Actions App
  toggleBuilderMode: () => {
    currentState = {
      ...currentState,
      app: {
        ...currentState.app,
        showLayout: !currentState.app.showLayout,
      },
    }
    saveState()
    return currentState
  },

  toggleCodePanel: () => {
    currentState = {
      ...currentState,
      app: {
        ...currentState.app,
        showCode: !currentState.app.showCode,
      },
    }
    saveState()
    return currentState
  },

  toggleInputText: () => {
    currentState = {
      ...currentState,
      app: {
        ...currentState.app,
        inputTextFocused: !currentState.app.inputTextFocused,
      },
    }
    saveState()
    return currentState
  },

  setOverlay: (overlay: Overlay) => {
    currentState = {
      ...currentState,
      app: {
        ...currentState.app,
        overlay,
      },
    }
    saveState()
    return currentState
  },

  // Actions Components
  reset: (components?: IComponents) => {
    currentState = {
      ...currentState,
      components: {
        ...currentState.components,
        present: {
          ...currentState.components.present,
          components: components || INITIAL_COMPONENTS,
          selectedId: DEFAULT_ID,
        },
      },
    }
    saveState()
    return currentState
  },

  loadDemo: (type: TemplateType) => {
    currentState = {
      ...currentState,
      components: {
        ...currentState.components,
        present: {
          ...currentState.components.present,
          selectedId: 'comp-root',
          components: templates[type],
        },
      },
    }
    saveState()
    return currentState
  },

  resetProps: (componentId: string) => {
    currentState = produce(currentState, (draft) => {
      const component = draft.components.present.components[componentId]
      const { form, ...defaultProps } = DEFAULT_PROPS[component.type] || {}
      draft.components.present.components[componentId].props = defaultProps || {}
    })
    saveState()
    return currentState
  },

  updateProps: (payload: { id: string; name: string; value: string }) => {
    currentState = produce(currentState, (draft) => {
      draft.components.present.components[payload.id].props[payload.name] = payload.value
    })
    saveState()
    return currentState
  },

  deleteProps: (payload: { id: string; name: string }) => {
    currentState = {
      ...currentState,
      components: {
        ...currentState.components,
        present: {
          ...currentState.components.present,
          components: {
            ...currentState.components.present.components,
            [payload.id]: {
              ...currentState.components.present.components[payload.id],
              props: omit(currentState.components.present.components[payload.id].props, payload.name),
            },
          },
        },
      },
    }
    saveState()
    return currentState
  },

  deleteComponent: (componentId: string) => {
    if (componentId === 'root') {
      return currentState
    }

    currentState = produce(currentState, (draft) => {
      let component = draft.components.present.components[componentId]

      // Remove self
      if (component && component.parent) {
        const children = draft.components.present.components[
          component.parent
        ].children.filter((id: string) => id !== componentId)

        draft.components.present.components[component.parent].children = children
      }

      // Remove children
      const childrenToRemove = component.children || []
      childrenToRemove.forEach((childId: string) => {
        delete draft.components.present.components[childId]
      })

      // Remove self
      delete draft.components.present.components[componentId]

      // Update selected
      if (draft.components.present.selectedId === componentId) {
        draft.components.present.selectedId = component.parent
      }
    })
    saveState()
    return currentState
  },

  moveComponent: (payload: { parentId: string; componentId: string }) => {
    currentState = produce(currentState, (draft) => {
      const component = draft.components.present.components[payload.componentId]
      const oldParent = component.parent

      // Remove from old parent
      if (oldParent && draft.components.present.components[oldParent]) {
        draft.components.present.components[oldParent].children = draft.components.present.components[
          oldParent
        ].children.filter((id: string) => id !== payload.componentId)
      }

      // Add to new parent
      if (draft.components.present.components[payload.parentId]) {
        draft.components.present.components[payload.parentId].children.push(payload.componentId)
      }

      // Update component parent
      component.parent = payload.parentId
    })
    saveState()
    return currentState
  },

  moveSelectedComponentChildren: (payload: { fromIndex: number; toIndex: number }) => {
    currentState = produce(currentState, (draft) => {
      const selectedComponent = draft.components.present.components[draft.components.present.selectedId]
      const children = [...selectedComponent.children]
      const [movedChild] = children.splice(payload.fromIndex, 1)
      children.splice(payload.toIndex, 0, movedChild)
      selectedComponent.children = children
    })
    saveState()
    return currentState
  },

  addComponent: (payload: {
    parentName: string
    type: ComponentType
    rootParentType?: ComponentType
    testId?: string
  }) => {
    const id = payload.testId || generateId()
    const { form, ...defaultProps } = DEFAULT_PROPS[payload.type] || {}

    currentState = produce(currentState, (draft) => {
      draft.components.present.components[id] = {
        children: [],
        type: payload.type,
        parent: payload.parentName,
        id,
        props: defaultProps || {},
        rootParentType: payload.rootParentType || payload.type,
      }

      if (draft.components.present.components[payload.parentName]) {
        draft.components.present.components[payload.parentName].children.push(id)
      }
    })
    saveState()
    return currentState
  },

  addMetaComponent: (payload: { components: IComponents; root: string; parent: string }) => {
    currentState = produce(currentState, (draft) => {
      // Add all components from the meta component
      Object.keys(payload.components).forEach((componentId) => {
        draft.components.present.components[componentId] = payload.components[componentId]
      })

      // Add the root component to the parent
      if (draft.components.present.components[payload.parent]) {
        draft.components.present.components[payload.parent].children.push(payload.root)
      }
    })
    saveState()
    return currentState
  },

  select: (selectedId: IComponent['id']) => {
    currentState = {
      ...currentState,
      components: {
        ...currentState.components,
        present: {
          ...currentState.components.present,
          selectedId,
        },
      },
    }
    saveState(true) // Skip history car la sélection ne doit pas être dans l'historique
    return currentState
  },

  unselect: () => {
    currentState = {
      ...currentState,
      components: {
        ...currentState.components,
        present: {
          ...currentState.components.present,
          selectedId: DEFAULT_ID,
        },
      },
    }
    saveState(true) // Skip history car la désélection ne doit pas être dans l'historique
    return currentState
  },

  selectParent: () => {
    const selectedComponent = currentState.components.present.components[currentState.components.present.selectedId]
    if (selectedComponent && selectedComponent.parent) {
      currentState = {
        ...currentState,
        components: {
          ...currentState.components,
          present: {
            ...currentState.components.present,
            selectedId: selectedComponent.parent,
          },
        },
      }
      saveState(true) // Skip history car la sélection du parent ne doit pas être dans l'historique
    }
    return currentState
  },

  duplicate: () => {
    const selectedComponent = currentState.components.present.components[currentState.components.present.selectedId]
    if (selectedComponent) {
      const { newId, clonedComponents } = duplicateComponent(selectedComponent, currentState.components.present.components)
      
      currentState = produce(currentState, (draft) => {
        // Add all cloned components
        Object.keys(clonedComponents).forEach((componentId) => {
          draft.components.present.components[componentId] = clonedComponents[componentId]
        })

        // Add the root component to the parent
        if (draft.components.present.components[selectedComponent.parent]) {
          draft.components.present.components[selectedComponent.parent].children.push(newId)
        }

        // Select the duplicated component
        draft.components.present.selectedId = newId
      })
      saveState()
    }
    return currentState
  },

  setComponentName: (payload: { componentId: string; name: string }) => {
    currentState = produce(currentState, (draft) => {
      if (draft.components.present.components[payload.componentId]) {
        draft.components.present.components[payload.componentId].componentName = payload.name
      }
    })
    saveState()
    return currentState
  },

  hover: (componentId: IComponent['id']) => {
    console.log('Action HOVER appelée pour:', componentId);
    currentState = {
      ...currentState,
      components: {
        ...currentState.components,
        present: {
          ...currentState.components.present,
          hoveredId: componentId,
        },
      },
    }
    saveState(true) // Skip history car le hover ne doit pas être dans l'historique
    return currentState
  },

  unhover: () => {
    console.log('Action UNHOVER appelée');
    currentState = {
      ...currentState,
      components: {
        ...currentState.components,
        present: {
          ...currentState.components.present,
          hoveredId: undefined,
        },
      },
    }
    saveState(true) // Skip history car le unhover ne doit pas être dans l'historique
    return currentState
  },

  // Actions de persistance
  saveToSpace: () => {
    // Cette fonction peut être utilisée pour sauvegarder l'état dans un space Karmyc
    // si nécessaire pour une intégration plus avancée
    
    // Déclencher un événement pour notifier le système d'espace
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('openchakra-state-changed', {
        detail: { state: currentState }
      }))
    }
    
    return currentState
  },

  // Action pour charger l'état depuis un space Karmyc
  loadFromSpace: (spaceData: RootState) => {
    currentState = { ...spaceData }
    saveState(true) // Skip history pour éviter les boucles
    return currentState
  },

  // Actions pour l'espace OpenChakra
  initializeOpenChakraSpace: (payload?: { spaceId?: string; spaceName?: string }) => {
    // Cette action sera gérée par le plugin d'espace
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('openchakra-space-action', {
        detail: { 
          type: 'INITIALIZE_OPENCHAKRA_SPACE',
          payload 
        }
      }))
    }
    return currentState
  },

  saveOpenChakraStateToSpace: (payload?: { spaceId?: string }) => {
    // Cette action sera gérée par le plugin d'espace
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('openchakra-space-action', {
        detail: { 
          type: 'SAVE_OPENCHAKRA_STATE_TO_SPACE',
          payload 
        }
      }))
    }
    return currentState
  },

  loadOpenChakraStateFromSpace: (payload?: { spaceId?: string }) => {
    // Cette action sera gérée par le plugin d'espace
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('openchakra-space-action', {
        detail: { 
          type: 'LOAD_OPENCHAKRA_STATE_FROM_SPACE',
          payload 
        }
      }))
    }
    return currentState
  },

  resetOpenChakraSpace: (payload?: { spaceId?: string }) => {
    // Cette action sera gérée par le plugin d'espace
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('openchakra-space-action', {
        detail: { 
          type: 'RESET_OPENCHAKRA_SPACE',
          payload 
        }
      }))
    }
    return currentState
  },
}

// Plugin Karmyc pour gérer les actions Redux
export const openChakraPlugin: IActionPlugin = {
  id: 'openchakra-plugin',
  actionTypes: [
    // Actions App
    'app/toggleBuilderMode',
    'app/toggleCodePanel',
    'app/toggleInputText',
    'app/setOverlay',
    // Actions Components
    'components/reset',
    'components/loadDemo',
    'components/resetProps',
    'components/updateProps',
    'components/deleteProps',
    'components/deleteComponent',
    'components/moveComponent',
    'components/moveSelectedComponentChildren',
    'components/addComponent',
    'components/addMetaComponent',
    'components/select',
    'components/unselect',
    'components/selectParent',
    'components/duplicate',
    'components/setComponentName',
    'components/hover',
    'components/unhover',
    // Actions de persistance
    'saveToSpace',
    'loadFromSpace',
    // Actions pour l'espace OpenChakra
    'initializeOpenChakraSpace',
    'saveOpenChakraStateToSpace',
    'loadOpenChakraStateFromSpace',
    'resetOpenChakraSpace',
  ],
  handler: (action: Action) => {
    const { type, payload } = action

    switch (type) {
      // Actions App
      case 'app/toggleBuilderMode':
        actions.toggleBuilderMode()
        break
      case 'app/toggleCodePanel':
        actions.toggleCodePanel()
        break
      case 'app/toggleInputText':
        actions.toggleInputText()
        break
      case 'app/setOverlay':
        actions.setOverlay(payload)
        break

      // Actions Components
      case 'components/reset':
        actions.reset(payload)
        break
      case 'components/loadDemo':
        actions.loadDemo(payload)
        break
      case 'components/resetProps':
        actions.resetProps(payload)
        break
      case 'components/updateProps':
        actions.updateProps(payload)
        break
      case 'components/deleteProps':
        actions.deleteProps(payload)
        break
      case 'components/deleteComponent':
        actions.deleteComponent(payload)
        break
      case 'components/moveComponent':
        actions.moveComponent(payload)
        break
      case 'components/moveSelectedComponentChildren':
        actions.moveSelectedComponentChildren(payload)
        break
      case 'components/addComponent':
        actions.addComponent(payload)
        break
      case 'components/addMetaComponent':
        actions.addMetaComponent(payload)
        break
      case 'components/select':
        actions.select(payload)
        break
      case 'components/unselect':
        actions.unselect()
        break
      case 'components/selectParent':
        actions.selectParent()
        break
      case 'components/duplicate':
        actions.duplicate()
        break
      case 'components/setComponentName':
        actions.setComponentName(payload)
        break
      case 'components/hover':
        actions.hover(payload)
        break
      case 'components/unhover':
        actions.unhover()
        break

      // Actions de persistance
      case 'saveToSpace':
        actions.saveToSpace()
        break
      case 'loadFromSpace':
        actions.loadFromSpace(payload)
        break

      // Actions pour l'espace OpenChakra
      case 'initializeOpenChakraSpace':
        actions.initializeOpenChakraSpace(payload)
        break
      case 'saveOpenChakraStateToSpace':
        actions.saveOpenChakraStateToSpace(payload)
        break
      case 'loadOpenChakraStateFromSpace':
        actions.loadOpenChakraStateFromSpace(payload)
        break
      case 'resetOpenChakraSpace':
        actions.resetOpenChakraSpace(payload)
        break
    }
  },
  priority: ActionPriority.HIGH,
}

// Sélecteurs
export const getState = (): RootState => currentState

export const getAppState = (): AppState => currentState.app

export const getComponentsState = (): ComponentsState => currentState.components.present

export const getComponentsStateWithUndo = (): ComponentsStateWithUndo => currentState.components

export const getShowLayout = () => currentState.app.showLayout

export const getShowCode = () => currentState.app.showCode

export const getFocusedComponent = (id: IComponent['id']) => 
  currentState.app.inputTextFocused && currentState.components.present.selectedId === id

export const getInputTextFocused = () => currentState.app.inputTextFocused

export const getComponents = () => currentState.components.present.components

export const getComponentBy = (nameOrId: string | IComponent['id']) => 
  currentState.components.present.components[nameOrId]

export const getSelectedComponent = () =>
  currentState.components.present.components[currentState.components.present.selectedId]

export const getPropsForSelectedComponent = (propsName: string) =>
  currentState.components.present.components[currentState.components.present.selectedId]
    .props[propsName]

export const getSelectedComponentId = () => currentState.components.present.selectedId

export const getIsSelectedComponent = (componentId: IComponent['id']) => 
  currentState.components.present.selectedId === componentId

export const getSelectedComponentChildren = () => {
  const selectedComponent = getSelectedComponent()
  return selectedComponent.children.map(child => getComponentBy(child))
}

export const getSelectedComponentParent = () =>
  currentState.components.present.components[getSelectedComponent().parent]

export const getHoveredId = () => currentState.components.present.hoveredId

export const getIsHovered = (id: IComponent['id']) => getHoveredId() === id

export const getComponentNames = () => {
  const names = Object.values(currentState.components.present.components)
    .map(comp => comp.componentName)
    .filter(comp => !!comp)

  return Array.from(new Set(names))
} 
