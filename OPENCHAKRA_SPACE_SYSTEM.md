# Système d'Espace OpenChakra

## Vue d'ensemble

Le système d'espace OpenChakra permet de créer et gérer automatiquement un espace Karmyc dédié à l'éditeur de composants OpenChakra. Ce système assure la persistance des données et l'intégration avec l'écosystème Karmyc.

## 🚀 Migration vers le Système d'Espace

### Changement Principal

L'éditeur OpenChakra utilise maintenant **l'espace Karmyc** au lieu de la clé `openchakra-editor-state` pour la persistance des données.

### Migration Automatique

Le système effectue automatiquement la migration des données existantes :

1. **Détection** : Vérifie si des données existent dans l'ancien système
2. **Migration** : Transfère les données vers le nouvel espace
3. **Chargement** : Charge automatiquement les données migrées
4. **Nettoyage** : Supprime l'ancien système après migration réussie

### Avantages de la Migration

- **Intégration Karmyc** : Compatible avec l'écosystème Karmyc
- **Persistance améliorée** : Métadonnées et versioning
- **Interface utilisateur** : Gestion visuelle de l'espace
- **Événements** : Communication asynchrone entre composants

## 🔧 Corrections Techniques

### Boucle Infinie Corrigée

Le système a été corrigé pour éviter les boucles infinies lors du chargement de l'état :

#### Problème Identifié
- Le hook `useOpenChakraSpace` chargeait l'état depuis l'espace au démarrage
- Cela déclenchait un événement qui rechargeait l'état
- Création d'une boucle infinie de chargement

#### Solution Implémentée

1. **Chargement Conditionnel** : L'état n'est chargé que lors de la migration initiale
2. **Flags de Protection** : Utilisation de flags pour éviter les sauvegardes multiples
3. **Événements Différenciés** : Distinction entre migration et chargement manuel

```typescript
// Chargement seulement lors de la migration
if (event.detail.state && event.detail.isMigration) {
    dispatch.loadFromSpace(event.detail.state)
}

// Protection contre les boucles de sauvegarde
if (!isSaving) {
    isSaving = true
    saveToStorage(currentState)
    setTimeout(() => { isSaving = false }, 100)
}
```

#### Mécanismes de Protection

- **Vérification d'état identique** : Évite de sauvegarder si l'état n'a pas changé
- **Flags de sauvegarde** : Empêche les sauvegardes simultanées
- **Délais de protection** : Évite les déclenchements trop fréquents
- **Événements typés** : Distinction entre migration et actions manuelles

## Architecture

### 1. Plugin d'Espace (`openchakra-space-plugin.ts`)

Le plugin principal qui gère toutes les opérations liées à l'espace OpenChakra :

- **Initialisation automatique** : Crée un espace par défaut si aucun n'existe
- **Migration des données** : Transfère les données de l'ancien système
- **Persistance** : Sauvegarde et charge l'état de l'application
- **Gestion des événements** : Écoute et déclenche des événements pour la synchronisation

### 2. Hook Personnalisé (`useOpenChakraSpace.ts`)

Hook React qui fournit une interface simple pour interagir avec l'espace :

```typescript
const { 
    currentSpace, 
    isInitialized, 
    autoSave, 
    loadFromSpace, 
    resetSpace 
} = useOpenChakraSpace()
```

### 3. Composant d'Interface (`SpaceInfo.tsx`)

Composant UI qui affiche les informations de l'espace et permet les actions utilisateur.

## Fonctionnalités

### Initialisation Automatique

L'espace OpenChakra est automatiquement créé au démarrage de l'application s'il n'existe pas :

```typescript
// Configuration par défaut
const DEFAULT_OPENCHAKRA_SPACE = {
    id: 'openchakra-default-space',
    name: 'Espace OpenChakra',
    description: 'Espace principal pour l\'éditeur de composants OpenChakra',
    color: '#3182CE', // Bleu Chakra UI
    viewCount: 0
}
```

### Migration des Données

Le système détecte et migre automatiquement les données existantes :

```typescript
// Migration automatique depuis l'ancien système
const oldState = localStorage.getItem('openchakra-editor-state')
if (oldState) {
    const migratedState = JSON.parse(oldState)
    // Les données sont transférées vers l'espace
    spaceData.sharedState.payload.openChakraState = migratedState
}
```

### Persistance des Données

L'espace stocke automatiquement :
- L'état complet de l'application OpenChakra
- Le nombre de vues
- La date de dernière modification
- Les métadonnées de l'espace

### Actions Disponibles

#### Via le Plugin
- `INITIALIZE_OPENCHAKRA_SPACE` : Initialise un nouvel espace
- `SAVE_OPENCHAKRA_STATE_TO_SPACE` : Sauvegarde l'état actuel
- `LOAD_OPENCHAKRA_STATE_FROM_SPACE` : Charge l'état depuis l'espace
- `RESET_OPENCHAKRA_SPACE` : Réinitialise l'espace

#### Via le Hook
- `initializeSpace()` : Initialise un espace personnalisé
- `autoSave()` : Sauvegarde automatique
- `loadFromSpace()` : Charge depuis l'espace
- `resetSpace()` : Réinitialise l'espace

## Intégration

### 1. Configuration de l'Application

Le plugin est automatiquement inclus dans la configuration Karmyc :

```typescript
const karmycConfig = {
    plugins: [openChakraPlugin, openChakraSpacePlugin],
    // ... autres configurations
}
```

### 2. Initialisation au Démarrage

L'espace est initialisé automatiquement :

```typescript
function ClientOnlyApp({ isClient }: { isClient: boolean }) {
    useOpenChakraSpaceInitializer() // Initialise l'espace
    // ... reste du code
}
```

### 3. Interface Utilisateur

Le composant `SpaceInfo` est intégré dans la barre de statut :

```typescript
registerRootStatus(
    () => <SpaceInfo />,
    { name: 'space-info', type: 'status' },
    { order: 891, alignment: 'left', width: 'auto' }
)
```

## Stockage

### LocalStorage

L'espace utilise le localStorage pour la persistance :

- `openchakra-space-id` : ID de l'espace actuel
- `openchakra-space-{spaceId}` : Données complètes de l'espace
- `openchakra-editor-state` : Ancien système (supprimé après migration)

### Structure des Données

```typescript
interface OpenChakraSpace {
    id: string
    name: string
    description: string
    color: string
    sharedState: {
        payload: {
            viewCount: number
            lastModified: string
            openChakraState: RootState // État complet d'OpenChakra
        }
    }
}
```

## Événements

Le système utilise des événements personnalisés pour la communication :

- `openchakra-space-initialized` : Espace initialisé
- `openchakra-state-saved` : État sauvegardé
- `openchakra-state-loaded` : État chargé
- `openchakra-space-reset` : Espace réinitialisé
- `openchakra-state-changed` : État modifié

### Types d'Événements

```typescript
// Migration (chargement automatique)
{
    detail: { 
        spaceId: string, 
        state: RootState, 
        isMigration: true 
    }
}

// Action manuelle
{
    detail: { 
        spaceId: string, 
        state: RootState, 
        isMigration: false 
    }
}
```

## Utilisation

### Sauvegarde Manuelle

```typescript
const { autoSave } = useOpenChakraSpace()
autoSave() // Sauvegarde l'état actuel
```

### Chargement

```typescript
const { loadFromSpace } = useOpenChakraSpace()
loadFromSpace() // Charge l'état depuis l'espace
```

### Réinitialisation

```typescript
const { resetSpace } = useOpenChakraSpace()
resetSpace() // Réinitialise l'espace (avec confirmation)
```

## Migration depuis l'Ancien Système

### Processus Automatique

1. **Détection** : Le système vérifie s'il existe des données dans `openchakra-editor-state`
2. **Migration** : Les données sont transférées vers le nouvel espace
3. **Chargement** : L'état migré est automatiquement chargé
4. **Nettoyage** : L'ancien système est supprimé après migration réussie

### Compatibilité

Le nouveau système est compatible avec l'ancien système de persistance :

- Les actions `saveToSpace()` et `loadFromSpace()` sont préservées
- L'état localStorage existant est migré automatiquement
- Migration transparente pour l'utilisateur

### Fallback

Si l'espace n'est pas disponible, le système utilise l'ancien mécanisme de stockage :

```typescript
// Fallback vers l'ancien système si l'espace n'est pas disponible
localStorage.setItem('openchakra-editor-state', JSON.stringify(state))
```

## Avantages

1. **Persistance Automatique** : L'état est sauvegardé automatiquement
2. **Intégration Karmyc** : Compatible avec l'écosystème Karmyc
3. **Interface Utilisateur** : Interface intuitive pour gérer l'espace
4. **Événements** : Communication asynchrone entre composants
5. **Migration Transparente** : Migration automatique des données existantes
6. **Extensibilité** : Facilement extensible pour de nouvelles fonctionnalités
7. **Protection contre les Boucles** : Mécanismes de protection contre les boucles infinies

## Développement Futur

### Fonctionnalités Prévues

1. **Espaces Multiples** : Support de plusieurs espaces
2. **Synchronisation Cloud** : Sauvegarde dans le cloud
3. **Collaboration** : Partage d'espaces entre utilisateurs
4. **Historique** : Versioning des états
5. **Templates** : Espaces prédéfinis

### API Extensions

```typescript
// Exemple d'extension future
const { 
    createSpace, 
    switchSpace, 
    listSpaces, 
    shareSpace 
} = useOpenChakraSpace()
```

## Dépannage

### Problèmes Courants

1. **Espace non initialisé** : Vérifier que `useOpenChakraSpaceInitializer()` est appelé
2. **Données corrompues** : Utiliser `resetSpace()` pour réinitialiser
3. **Erreurs localStorage** : Vérifier les permissions du navigateur
4. **Migration échouée** : Vérifier les logs de la console
5. **Boucles infinies** : Vérifier les flags de protection et les délais

### Debug

```typescript
// Activer le debug
localStorage.setItem('openchakra-debug', 'true')

// Vérifier l'espace actuel
console.log(getCurrentOpenChakraSpace())

// Vérifier la migration
console.log('Ancien système:', localStorage.getItem('openchakra-editor-state'))
console.log('Nouvel espace:', getCurrentOpenChakraSpace())

// Vérifier les flags de protection
console.log('Flag de sauvegarde:', isSaving)
```

### Logs de Migration

Le système affiche des logs détaillés lors de la migration :

```
Migration des données depuis l'ancien système de stockage
Espace OpenChakra initialisé: Espace OpenChakra (ID: openchakra-default-space)
État chargé depuis l'espace existant
Ancien système de stockage nettoyé après migration réussie
``` 
