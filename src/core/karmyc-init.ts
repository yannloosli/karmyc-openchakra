import { openChakraPlugin } from './karmyc-plugin'

// Configuration d'initialisation pour Karmyc
export const initializeKarmyc = () => {
  // Le plugin est déjà configuré dans le fichier karmyc-plugin.ts
  // Cette fonction peut être utilisée pour des initialisations supplémentaires si nécessaire
  return {
    plugins: [openChakraPlugin],
    // Autres configurations d'initialisation si nécessaire
  }
}

// Fonction pour réinitialiser l'état
export const resetKarmycState = () => {
  // Cette fonction peut être utilisée pour réinitialiser l'état si nécessaire
  // Pour l'instant, le plugin gère déjà l'état initial
} 
