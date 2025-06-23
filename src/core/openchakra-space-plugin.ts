import { IActionPlugin, Action, ActionPriority } from '@gamesberry/karmyc-core'
import { getState } from './karmyc-plugin'

// Configuration de l'espace par défaut pour OpenChakra
const DEFAULT_OPENCHAKRA_SPACE = {
    id: 'openchakra-default-space',
    name: 'Espace OpenChakra',
    description: 'Espace principal pour l\'éditeur de composants OpenChakra',
    color: '#3182CE', // Bleu Chakra UI
    viewCount: 0
}

// Plugin pour initialiser automatiquement un espace OpenChakra
export const openChakraSpacePlugin: IActionPlugin = {
    id: 'openchakra-space-plugin',
    actionTypes: [
        'INITIALIZE_OPENCHAKRA_SPACE',
        'SAVE_OPENCHAKRA_STATE_TO_SPACE',
        'LOAD_OPENCHAKRA_STATE_FROM_SPACE',
        'RESET_OPENCHAKRA_SPACE'
    ],
    handler: (action: Action) => {
        const { type, payload } = action

        switch (type) {
            case 'INITIALIZE_OPENCHAKRA_SPACE':
                initializeOpenChakraSpace(payload)
                break
            case 'SAVE_OPENCHAKRA_STATE_TO_SPACE':
                saveOpenChakraStateToSpace(payload)
                break
            case 'LOAD_OPENCHAKRA_STATE_FROM_SPACE':
                loadOpenChakraStateFromSpace(payload)
                break
            case 'RESET_OPENCHAKRA_SPACE':
                resetOpenChakraSpace(payload)
                break
        }
    },
    priority: ActionPriority.HIGH,
}

// Fonction pour initialiser l'espace OpenChakra
const initializeOpenChakraSpace = (payload?: { spaceId?: string; spaceName?: string }) => {
    try {
        // Vérifier si l'espace existe déjà
        const existingSpace = localStorage.getItem('openchakra-space-id')
        
        if (!existingSpace) {
            // Créer un nouvel espace OpenChakra
            const spaceId = payload?.spaceId || DEFAULT_OPENCHAKRA_SPACE.id
            const spaceName = payload?.spaceName || DEFAULT_OPENCHAKRA_SPACE.name
            
            // Essayer de migrer les données de l'ancien système
            let migratedState = null
            try {
                const oldState = localStorage.getItem('openchakra-editor-state')
                if (oldState) {
                    migratedState = JSON.parse(oldState)
                    console.log('Migration des données depuis l\'ancien système de stockage')
                }
            } catch (error) {
                console.warn('Erreur lors de la migration des données:', error)
            }
            
            const spaceData = {
                id: spaceId,
                name: spaceName,
                description: DEFAULT_OPENCHAKRA_SPACE.description,
                color: DEFAULT_OPENCHAKRA_SPACE.color,
                sharedState: {
                    payload: { 
                        viewCount: 1, // Première vue
                        lastModified: new Date().toISOString(),
                        openChakraState: migratedState || getState() // Utiliser les données migrées ou l'état initial
                    }
                }
            }
            
            // Sauvegarder l'ID de l'espace
            localStorage.setItem('openchakra-space-id', spaceId)
            localStorage.setItem(`openchakra-space-${spaceId}`, JSON.stringify(spaceData))
            
            console.log(`Espace OpenChakra initialisé: ${spaceName} (ID: ${spaceId})`)
            
            // Si des données ont été migrées, les charger dans l'application
            if (migratedState) {
                // Déclencher un événement pour charger l'état migré
                if (typeof window !== 'undefined' && window.dispatchEvent) {
                    window.dispatchEvent(new CustomEvent('openchakra-state-loaded', {
                        detail: { 
                            spaceId, 
                            state: migratedState,
                            isMigration: true // Indiquer que c'est une migration
                        }
                    }))
                }
            }
            
            // Déclencher une action pour notifier l'initialisation
            if (typeof window !== 'undefined' && window.dispatchEvent) {
                window.dispatchEvent(new CustomEvent('openchakra-space-initialized', {
                    detail: { spaceId, spaceData }
                }))
            }
            
            return spaceId
        } else {
            console.log(`Espace OpenChakra déjà existant: ${existingSpace}`)
            return existingSpace
        }
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de l\'espace OpenChakra:', error)
        return null
    }
}

// Fonction pour sauvegarder l'état OpenChakra dans l'espace
const saveOpenChakraStateToSpace = (payload?: { spaceId?: string }) => {
    try {
        const spaceId = payload?.spaceId || localStorage.getItem('openchakra-space-id')
        
        if (!spaceId) {
            console.warn('Aucun espace OpenChakra trouvé pour la sauvegarde')
            return false
        }
        
        const spaceDataString = localStorage.getItem(`openchakra-space-${spaceId}`)
        if (!spaceDataString) {
            console.warn(`Espace OpenChakra ${spaceId} non trouvé`)
            return false
        }
        
        const spaceData = JSON.parse(spaceDataString)
        const currentState = getState()
        
        // Mettre à jour l'espace avec l'état actuel
        spaceData.sharedState.payload = {
            ...spaceData.sharedState.payload,
            viewCount: (spaceData.sharedState.payload.viewCount || 0) + 1,
            lastModified: new Date().toISOString(),
            openChakraState: currentState
        }
        
        // Sauvegarder l'espace mis à jour
        localStorage.setItem(`openchakra-space-${spaceId}`, JSON.stringify(spaceData))
        
        console.log(`État OpenChakra sauvegardé dans l'espace ${spaceId}`)
        
        // Déclencher un événement de sauvegarde
        if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('openchakra-state-saved', {
                detail: { 
                    spaceId, 
                    state: currentState,
                    isMigration: false // Indiquer que ce n'est pas une migration
                }
            }))
        }
        
        return true
    } catch (error) {
        console.error('Erreur lors de la sauvegarde de l\'état OpenChakra:', error)
        return false
    }
}

// Fonction pour charger l'état OpenChakra depuis l'espace
const loadOpenChakraStateFromSpace = (payload?: { spaceId?: string }) => {
    try {
        const spaceId = payload?.spaceId || localStorage.getItem('openchakra-space-id')
        
        if (!spaceId) {
            console.warn('Aucun espace OpenChakra trouvé pour le chargement')
            return false
        }
        
        const spaceDataString = localStorage.getItem(`openchakra-space-${spaceId}`)
        if (!spaceDataString) {
            console.warn(`Espace OpenChakra ${spaceId} non trouvé`)
            return false
        }
        
        const spaceData = JSON.parse(spaceDataString)
        const savedState = spaceData.sharedState.payload?.openChakraState
        
        if (!savedState) {
            console.warn(`Aucun état OpenChakra trouvé dans l'espace ${spaceId}`)
            return false
        }
        
        // Charger l'état dans l'application OpenChakra
        // Note: Cette fonction devrait être appelée via le plugin principal
        if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('openchakra-state-loaded', {
                detail: { 
                    spaceId, 
                    state: savedState,
                    isMigration: false // Chargement manuel, pas une migration
                }
            }))
        }
        
        console.log(`État OpenChakra chargé depuis l'espace ${spaceId}`)
        return savedState
    } catch (error) {
        console.error('Erreur lors du chargement de l\'état OpenChakra:', error)
        return false
    }
}

// Fonction pour réinitialiser l'espace OpenChakra
const resetOpenChakraSpace = (payload?: { spaceId?: string }) => {
    try {
        const spaceId = payload?.spaceId || localStorage.getItem('openchakra-space-id')
        
        if (!spaceId) {
            console.warn('Aucun espace OpenChakra trouvé pour la réinitialisation')
            return false
        }
        
        // Supprimer l'espace
        localStorage.removeItem(`openchakra-space-${spaceId}`)
        localStorage.removeItem('openchakra-space-id')
        
        console.log(`Espace OpenChakra ${spaceId} réinitialisé`)
        
        // Déclencher un événement de réinitialisation
        if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('openchakra-space-reset', {
                detail: { spaceId }
            }))
        }
        
        return true
    } catch (error) {
        console.error('Erreur lors de la réinitialisation de l\'espace OpenChakra:', error)
        return false
    }
}

// Fonction utilitaire pour obtenir l'espace actuel
export const getCurrentOpenChakraSpace = () => {
    try {
        const spaceId = localStorage.getItem('openchakra-space-id')
        if (!spaceId) return null
        
        const spaceDataString = localStorage.getItem(`openchakra-space-${spaceId}`)
        if (!spaceDataString) return null
        
        return JSON.parse(spaceDataString)
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'espace OpenChakra:', error)
        return null
    }
}

// Fonction utilitaire pour vérifier si un espace existe
export const hasOpenChakraSpace = () => {
    const spaceId = localStorage.getItem('openchakra-space-id')
    return !!spaceId && !!localStorage.getItem(`openchakra-space-${spaceId}`)
}

// Fonction utilitaire pour nettoyer l'ancien système de stockage
export const cleanupOldStorage = () => {
    try {
        // Vérifier si l'espace existe et contient des données
        const spaceId = localStorage.getItem('openchakra-space-id')
        if (spaceId) {
            const spaceDataString = localStorage.getItem(`openchakra-space-${spaceId}`)
            if (spaceDataString) {
                const spaceData = JSON.parse(spaceDataString)
                if (spaceData.sharedState.payload?.openChakraState) {
                    // L'espace contient des données, on peut supprimer l'ancien système
                    localStorage.removeItem('openchakra-editor-state')
                    console.log('Ancien système de stockage nettoyé après migration réussie')
                    return true
                }
            }
        }
        return false
    } catch (error) {
        console.warn('Erreur lors du nettoyage de l\'ancien système:', error)
        return false
    }
}

// Fonction d'initialisation automatique appelée au démarrage
export const initializeOpenChakraSpaceOnStartup = () => {
    if (typeof window !== 'undefined') {
        // Attendre que le DOM soit prêt
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                if (!hasOpenChakraSpace()) {
                    initializeOpenChakraSpace()
                    // Nettoyer l'ancien système après un délai pour s'assurer que la migration est terminée
                    setTimeout(cleanupOldStorage, 1000)
                }
            })
        } else {
            if (!hasOpenChakraSpace()) {
                initializeOpenChakraSpace()
                // Nettoyer l'ancien système après un délai pour s'assurer que la migration est terminée
                setTimeout(cleanupOldStorage, 1000)
            }
        }
    }
} 
