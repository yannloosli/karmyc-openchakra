import { useCallback, useState, useEffect, useRef } from 'react';
import { useKarmycDispatch } from './useKarmycStore';

export function useOpenChakraUndoRedo() {
    const spaceId = typeof window !== 'undefined' ? localStorage.getItem('openchakra-space-id') : null;
    const dispatch = useKarmycDispatch();
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const isInitialized = useRef(false);

    // Fonction pour vérifier l'état de l'historique
    const checkHistoryState = useCallback(() => {
        if (!spaceId) {
            console.log('checkHistoryState: pas de spaceId');
            return;
        }
        
        console.log('checkHistoryState: vérification de l\'historique pour spaceId:', spaceId);
        
        const spaceDataString = localStorage.getItem(`openchakra-space-${spaceId}`);
        if (spaceDataString) {
            const spaceData = JSON.parse(spaceDataString);
            const history = spaceData.history;
            
            console.log('checkHistoryState: history trouvé:', !!history);
            console.log('checkHistoryState: history structure:', history ? {
                pastLength: history.past?.length || 0,
                present: !!history.present,
                futureLength: history.future?.length || 0
            } : 'null');
            
            if (history) {
                const newCanUndo = history.past && history.past.length > 0;
                const newCanRedo = history.future && history.future.length > 0;
                
                console.log('checkHistoryState: mise à jour canUndo:', canUndo, '->', newCanUndo);
                console.log('checkHistoryState: mise à jour canRedo:', canRedo, '->', newCanRedo);
                
                setCanUndo(newCanUndo);
                setCanRedo(newCanRedo);
            } else {
                console.log('checkHistoryState: pas d\'historique, mise à jour à false');
                setCanUndo(false);
                setCanRedo(false);
            }
        } else {
            console.log('checkHistoryState: pas de données de space');
            setCanUndo(false);
            setCanRedo(false);
        }
    }, [spaceId]);

    // Écouter les changements d'état pour mettre à jour l'historique
    useEffect(() => {
        const handleStateChange = () => {
            // Ne pas mettre à jour l'historique si on vient de faire un undo/redo
            setTimeout(() => {
                checkHistoryState();
            }, 50);
        };

        window.addEventListener('openchakra-state-changed', handleStateChange);
        
        // Vérifier l'état initial seulement une fois
        if (!isInitialized.current) {
            checkHistoryState();
            isInitialized.current = true;
        }

        return () => {
            window.removeEventListener('openchakra-state-changed', handleStateChange);
        };
    }, [checkHistoryState]);

    // Fonction pour recharger l'état depuis le space
    const reloadStateFromSpace = useCallback(() => {
        if (!spaceId) {
            console.log('Pas de spaceId, impossible de recharger');
            return;
        }
        
        console.log('Tentative de rechargement depuis le space:', spaceId);
        
        setTimeout(() => {
            const spaceDataString = localStorage.getItem(`openchakra-space-${spaceId}`);
            console.log('Données du space récupérées:', !!spaceDataString);
            
            if (spaceDataString) {
                const spaceData = JSON.parse(spaceDataString);
                console.log('Structure du space:', Object.keys(spaceData));
                
                const state = spaceData.sharedState?.payload?.openChakraState;
                console.log('État OpenChakra trouvé:', !!state);
                
                if (state) {
                    console.log('Chargement de l\'état via dispatch.loadFromSpace');
                    dispatch.loadFromSpace(state);
                    console.log('État rechargé depuis le space avec succès');
                } else {
                    console.log('Aucun état OpenChakra trouvé dans le space');
                }
            } else {
                console.log('Aucune donnée de space trouvée');
            }
        }, 100);
    }, [spaceId, dispatch]);

    // Undo avec notre propre historique
    const undo = useCallback(() => {
        console.log('undo appelé, canUndo:', canUndo, 'spaceId:', !!spaceId);
        
        if (!spaceId) {
            console.log('Impossible d\'annuler: pas de spaceId');
            return;
        }

        // Vérifier l'état actuel de l'historique avant d'essayer d'annuler
        const spaceDataString = localStorage.getItem(`openchakra-space-${spaceId}`);
        if (!spaceDataString) {
            console.log('Impossible d\'annuler: pas de données de space');
            return;
        }

        const spaceData = JSON.parse(spaceDataString);
        const history = spaceData.history;
        
        if (!history || !history.past || history.past.length === 0) {
            console.log('Impossible d\'annuler: pas d\'historique ou historique vide');
            return;
        }

        console.log('Exécution de l\'undo via notre historique');
        console.log('État avant undo:', {
            pastLength: history.past.length,
            present: !!history.present,
            futureLength: history.future?.length || 0
        });
        
        // Récupérer le dernier état du passé
        const previousState = history.past[history.past.length - 1];
        const newPast = history.past.slice(0, -1);
        
        console.log('État récupéré du passé:', !!previousState);
        
        // Mettre à jour l'historique
        history.past = newPast;
        history.future = [history.present, ...(history.future || [])];
        history.present = previousState;
        
        console.log('État après mise à jour de l\'historique:', {
            pastLength: history.past.length,
            present: !!history.present,
            futureLength: history.future.length
        });
        
        // Mettre à jour l'état partagé
        if (spaceData.sharedState && spaceData.sharedState.payload) {
            spaceData.sharedState.payload.openChakraState = previousState.state;
        }
        
        localStorage.setItem(`openchakra-space-${spaceId}`, JSON.stringify(spaceData));
        
        // Recharger l'état
        reloadStateFromSpace();
        
        // Mettre à jour l'état local immédiatement
        setCanUndo(newPast.length > 0);
        setCanRedo(history.future.length > 0);
        
        console.log('Undo exécuté avec succès, canRedo maintenant:', history.future.length > 0);
        
        // Forcer la mise à jour de l'état local
        setTimeout(() => {
            setCanUndo(newPast.length > 0);
            setCanRedo(history.future.length > 0);
        }, 10);
    }, [spaceId, reloadStateFromSpace]);

    // Redo avec notre propre historique
    const redo = useCallback(() => {
        console.log('redo appelé, canRedo:', canRedo, 'spaceId:', !!spaceId);
        
        if (!spaceId) {
            console.log('Impossible de refaire: pas de spaceId');
            return;
        }

        // Vérifier l'état actuel de l'historique avant d'essayer de refaire
        const spaceDataString = localStorage.getItem(`openchakra-space-${spaceId}`);
        if (!spaceDataString) {
            console.log('Impossible de refaire: pas de données de space');
            return;
        }

        const spaceData = JSON.parse(spaceDataString);
        const history = spaceData.history;
        
        if (!history || !history.future || history.future.length === 0) {
            console.log('Impossible de refaire: pas d\'historique ou pas de futur');
            return;
        }

        console.log('Exécution du redo via notre historique');
        
        // Récupérer le prochain état du futur
        const nextState = history.future[0];
        const newFuture = history.future.slice(1);
        
        // Mettre à jour l'historique
        history.past = [...history.past, history.present];
        history.present = nextState;
        history.future = newFuture;
        
        // Mettre à jour l'état partagé
        if (spaceData.sharedState && spaceData.sharedState.payload) {
            spaceData.sharedState.payload.openChakraState = nextState.state;
        }
        
        localStorage.setItem(`openchakra-space-${spaceId}`, JSON.stringify(spaceData));
        
        // Recharger l'état
        reloadStateFromSpace();
        
        // Mettre à jour l'état local immédiatement
        setCanUndo(history.past.length > 0);
        setCanRedo(newFuture.length > 0);
        
        console.log('Redo exécuté avec succès');
    }, [spaceId, reloadStateFromSpace]);

    return {
        canUndo,
        canRedo,
        undo,
        redo
    };
} 
