import { useMemo } from "react";
import { Box } from "@chakra-ui/react";
import { InspectorProvider } from '~contexts/inspector-context'
import Inspector from '~components/inspector/Inspector'
import { AREA_ROLE, areaRegistry, useKarmycStore, useRegisterAreaType, useRegisterActionHandler } from "@gamesberry/karmyc-core";
import { CircleSlash } from "lucide-react";


export const InspectorArea = () => {
    const { updateArea } = useKarmycStore.getState();
    // const { registerComponent: registerTopInnerArea } = useToolsSlot('inspector-area', 'top-inner');

    const handleInspectorArea = (params: any) => {
        const areaId = params.areaId;
        if (areaId) {
            updateArea({
                id: areaId,
                type: 'inspector-area',
                state: areaRegistry.getInitialState('inspector-area')
            });
        }
    };

    /*    useMemo(() => {
           console.log('registerTopInnerArea');
           registerTopInnerArea(
               () => <div>Top Demo Area center slot</div>,
               { name: 'topInnerSlot', type: 'menu' },
               { order: 990, width: 'auto', alignment: 'center' }
           );
       }, [registerTopInnerArea]); */


    // Define area shortcuts
    /*     useAreaKeyboardShortcuts('inspector-area', [
            {
                key: 'S',
                modifierKeys: ['Control'],
                name: 'Save Inspector Area',
                fn: (areaId: string) => {
                    console.log(`Saving inspector area ${areaId}`);
                    // Save implementation
                },
                history: true,
                isGlobal: true
            },
            {
                key: 'R',
                name: 'Reset Inspector Area',
                fn: (areaId: string) => {
                    console.log(`Resetting inspector area ${areaId}`);
                    updateArea({
                        id: areaId,
                        type: 'inspector-area',
                        state: areaRegistry.getInitialState('inspector-area')
                    });
                }
            }
        ]); */


    // Register area types
    useRegisterAreaType(
        'inspector-area',
        InspectorComponent,
        {},
        {
            displayName: 'Inspector',
            defaultSize: { width: 300, height: 200 },
            role: AREA_ROLE.FOLLOW,
            icon: CircleSlash
        }
    );


    // Register action handlers
    useRegisterActionHandler('area.create-inspector-area', handleInspectorArea);


    return null
}


const InspectorComponent = () => {
    return (
        <Box
            maxH="calc(100vh - 3rem)"
            bg="#f7fafc"
            overflowY="auto"
            overflowX="visible"
            borderLeft="1px solid #cad5de"
            display="flex"
            flexDir="column"
            justifyContent="flex-start"
            w="100%"
            h="100%"
        >
            <InspectorProvider>
                <Inspector />
            </InspectorProvider>
        </Box>
    )
}
