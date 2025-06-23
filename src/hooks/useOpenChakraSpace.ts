import { useCallback, useEffect, useState, useRef } from 'react'
import { actionRegistry } from '@gamesberry/karmyc-core'
import { 
    getCurrentOpenChakraSpace, 
    hasOpenChakraSpace, 
    initializeOpenChakraSpaceOnStartup 
} from '~core/openchakra-space-plugin'
import { useKarmycDispatch } from './useKarmycStore'

// Types pour l'espace OpenChakra
export interface OpenChakraSpace {
    id: string
    name: string
    description: string
    color: string
    sharedState: {
        payload: {
            viewCount: number
            lastModified: string
            openChakraState: any
        }
    }
}

// Hook pour utiliser l'espace OpenChakra
export const useOpenChakraSpace = () => {
    const [currentSpace, setCurrentSpace] = useState<OpenChakraSpace | null>(null)
    const [isInitialized, setIsInitialized] = useState(false)
    const dispatch = useKarmycDispatch()
    const initializedRef = useRef(false)

    // Initialiser l'espace au démarrage
    useEffect(() => {
        // Éviter l'initialisation multiple
        if (initializedRef.current) return
        initializedRef.current = true

        const initializeSpace = () => {
            if (!hasOpenChakraSpace()) {
                // Déclencher l'action d'initialisation via le système d'actions
                actionRegistry.handleAction({
                    type: 'INITIALIZE_OPENCHAKRA_SPACE',
                    payload: {}
                })
            } else {
                // Si l'espace existe déjà, juste charger les informations de l'espace
                // sans recharger l'état (évite la boucle infinie)
                const space = getCurrentOpenChakraSpace()
                setCurrentSpace(space)
                setIsInitialized(true)
                console.log('Espace existant détecté, informations chargées')
            }
        }

        // Initialiser au montage du composant
        initializeSpace()

        // Écouter les événements de l'espace
        const handleSpaceInitialized = (event: CustomEvent) => {
            setCurrentSpace(event.detail.spaceData)
            setIsInitialized(true)
            
            // Si des données ont été migrées, elles seront chargées automatiquement
            // via l'événement openchakra-state-loaded
        }

        const handleStateSaved = (event: CustomEvent) => {
            // Recharger l'espace après sauvegarde
            const space = getCurrentOpenChakraSpace()
            setCurrentSpace(space)
        }

        const handleStateLoaded = (event: CustomEvent) => {
            // Charger l'état dans l'application OpenChakra seulement si c'est une migration
            // ou un chargement manuel (pas automatique au démarrage)
            if (event.detail.state && event.detail.isMigration) {
                dispatch.loadFromSpace(event.detail.state)
                console.log('État chargé depuis l\'espace via événement (migration)')
            }
        }

        const handleSpaceReset = () => {
            setCurrentSpace(null)
            setIsInitialized(false)
        }

        // Ajouter les écouteurs d'événements
        if (typeof window !== 'undefined') {
            window.addEventListener('openchakra-space-initialized', handleSpaceInitialized as EventListener)
            window.addEventListener('openchakra-state-saved', handleStateSaved as EventListener)
            window.addEventListener('openchakra-state-loaded', handleStateLoaded as EventListener)
            window.addEventListener('openchakra-space-reset', handleSpaceReset as EventListener)
        }

        // Nettoyer les écouteurs d'événements
        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('openchakra-space-initialized', handleSpaceInitialized as EventListener)
                window.removeEventListener('openchakra-state-saved', handleStateSaved as EventListener)
                window.removeEventListener('openchakra-state-loaded', handleStateLoaded as EventListener)
                window.removeEventListener('openchakra-space-reset', handleSpaceReset as EventListener)
            }
        }
    }, []) // Dépendances vides pour éviter les re-exécutions

    // Actions pour gérer l'espace
    const initializeSpace = useCallback((payload?: { spaceId?: string; spaceName?: string }) => {
        actionRegistry.handleAction({
            type: 'INITIALIZE_OPENCHAKRA_SPACE',
            payload
        })
    }, [])

    const saveStateToSpace = useCallback((payload?: { spaceId?: string }) => {
        actionRegistry.handleAction({
            type: 'SAVE_OPENCHAKRA_STATE_TO_SPACE',
            payload
        })
    }, [])

    const loadStateFromSpace = useCallback((payload?: { spaceId?: string }) => {
        actionRegistry.handleAction({
            type: 'LOAD_OPENCHAKRA_STATE_FROM_SPACE',
            payload
        })
    }, [])

    const resetSpace = useCallback((payload?: { spaceId?: string }) => {
        actionRegistry.handleAction({
            type: 'RESET_OPENCHAKRA_SPACE',
            payload
        })
    }, [])

    // Fonction pour sauvegarder automatiquement l'état actuel
    const autoSave = useCallback(() => {
        saveStateToSpace()
    }, [saveStateToSpace])

    // Fonction pour charger l'état depuis l'espace
    const loadFromSpace = useCallback(() => {
        loadStateFromSpace()
    }, [loadStateFromSpace])

    // Fonction pour vérifier si l'espace existe
    const spaceExists = useCallback(() => {
        return hasOpenChakraSpace()
    }, [])

    return {
        // État
        currentSpace,
        isInitialized,
        spaceExists: spaceExists(),
        
        // Actions
        initializeSpace,
        saveStateToSpace,
        loadStateFromSpace,
        resetSpace,
        autoSave,
        loadFromSpace,
        
        // Fonctions de compatibilité avec l'ancien système
        saveToSpace: autoSave
    }
}

// Hook simplifié pour l'initialisation automatique
export const useOpenChakraSpaceInitializer = () => {
    const initializedRef = useRef(false)

    useEffect(() => {
        if (!initializedRef.current) {
            initializedRef.current = true
            initializeOpenChakraSpaceOnStartup()
        }
    }, [])
}

// Hook pour la persistance automatique
export const useOpenChakraSpacePersistence = () => {
    const { autoSave, loadFromSpace } = useOpenChakraSpace()
    const [isAutoSaving, setIsAutoSaving] = useState(false)

    // Sauvegarder automatiquement après chaque modification
    useEffect(() => {
        const handleStateChange = () => {
            if (!isAutoSaving) {
                setIsAutoSaving(true)
                autoSave()
                // Réinitialiser le flag après un délai
                setTimeout(() => {
                    setIsAutoSaving(false)
                }, 500)
            }
        }

        // Écouter les changements d'état d'OpenChakra
        if (typeof window !== 'undefined') {
            window.addEventListener('openchakra-state-changed', handleStateChange)
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('openchakra-state-changed', handleStateChange)
            }
        }
    }, [autoSave, isAutoSaving])

    return {
        autoSave,
        loadFromSpace
    }
} 
