'use client'

import React, { useEffect, useRef, useState } from 'react'
import { AREA_ROLE, KarmycNextWrapper, Karmyc, useKarmyc, Tools, TOOLBAR_HEIGHT } from '@gamesberry/karmyc-core'
import { AreaInitializer } from '~components/AreaInitializer'
import { Box } from '@chakra-ui/react'
import { Provider } from '~components/ui/provider'
import AppErrorBoundary from '~components/errorBoundaries/AppErrorBoundary'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Global } from '@emotion/react'
import Metadata from '~components/Metadata'
import useShortcuts from '~hooks/useShortcuts'
import { openChakraPlugin } from '~core/karmyc-plugin'

// Composant wrapper pour gérer le rendu côté client
function ClientOnlyApp({ isClient }: { isClient: boolean }) {
    useShortcuts()

    const karmycConfig = {
        plugins: [openChakraPlugin],
        initialAreas: [
            { id: 'area-1', type: 'sidebar-area', state: {}, role: AREA_ROLE.SELF },
            { id: 'area-2', type: 'editor-area', state: {}, role: AREA_ROLE.LEAD },
            { id: 'area-3', type: 'inspector-area', state: {}, role: AREA_ROLE.FOLLOW },
        ],
        keyboardShortcutsEnabled: true,
        builtInLayouts: [
            {
                id: 'default',
                name: 'Default layout',
                config: {
                    _id: 10,
                    rootId: 'root',
                    errors: [],
                    activeAreaId: 'area-1',
                    joinPreview: null,
                    layout: {
                        root: {
                            id: 'root',
                            type: 'area_row',
                            orientation: 'horizontal',
                            areas: [
                                { id: 'area-1', size: 0.25 },
                                { id: 'area-2', size: 0.5 },
                                { id: 'area-3', size: 0.25 },
                            ]
                        },
                        'area-1': {
                            type: 'area',
                            id: 'area-1'
                        },
                        'area-2': {
                            type: 'area',
                            id: 'area-2'
                        },
                        'area-3': {
                            type: 'area',
                            id: 'area-3'
                        },
                    },
                    areas: {
                        'area-1': { id: 'area-1', type: 'demo-area', state: {}, role: AREA_ROLE.LEAD },
                        'area-2': { id: 'area-2', type: 'logo-karmyc-area', state: {}, role: AREA_ROLE.SELF },
                        'area-3': { id: 'area-3', type: 'keyboard-shortcuts-area', state: {}, role: AREA_ROLE.SELF },
                    },
                    viewports: {},
                    areaToOpen: null,
                    lastSplitResultData: null,
                    lastLeadAreaId: 'area-1'
                },
                isBuiltIn: true
            },
            {
                id: 'minimal',
                name: 'Layout minimal',
                config: {
                    _id: 10,
                    rootId: 'root',
                    errors: [],
                    activeAreaId: 'area-1',
                    joinPreview: null,
                    layout: {
                        root: {
                            id: 'root',
                            type: 'area_row',
                            orientation: 'vertical',
                            areas: [
                                { id: 'area-1', size: 0.7 },
                                { id: 'area-2', size: 0.3 }
                            ]
                        },
                        'area-1': {
                            type: 'area',
                            id: 'area-1'
                        },
                        'area-2': {
                            type: 'area',
                            id: 'area-2'
                        }
                    },
                    areas: {},
                    viewports: {},
                    areaToOpen: null,
                    lastSplitResultData: null,
                    lastLeadAreaId: 'area-1'
                },
                isBuiltIn: true
            }
        ],
        initialLayout: 'default',
        resizableAreas: true,
        manageableAreas: true,
        multiScreen: true,
    };

    const karmyc = useKarmyc(karmycConfig);

    return (
        <>
            <Metadata />
            <KarmycNextWrapper config={karmyc} isClient={isClient}>
                <AreaInitializer />
                <Provider>
                    <Global
                        styles={() => ({
                            html: { minWidth: '860px', backgroundColor: '#1a202c' },
                        })}
                    />
                    <Box w="100%" h="100vh">
                        <DndProvider backend={HTML5Backend}>
                            <AppErrorBoundary>
                                <Tools areaType="app">
                                    <Karmyc offset={TOOLBAR_HEIGHT * 1} />
                                </Tools>
                            </AppErrorBoundary>
                        </DndProvider>
                    </Box>
                </Provider>
            </KarmycNextWrapper>
        </>
    )
}

export default function HomePage() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Ne pas rendre si on n'est pas côté client
    if (!isClient) {
        return <div>Chargement...</div>;
    }

    return <ClientOnlyApp isClient={isClient} />
}
