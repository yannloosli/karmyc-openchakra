import { useMemo } from "react";
import { Box } from "@chakra-ui/react";
import { InspectorProvider } from "~contexts/inspector-context";
import Inspector from "../inspector/Inspector";
import { AREA_ROLE, areaRegistry, useKarmycStore, useRegisterAreaType, useRegisterActionHandler } from "@gamesberry/karmyc-core";
import { CircleSlash } from "lucide-react";
import Editor from '~components/editor/Editor'
import EditorErrorBoundary from '~components/errorBoundaries/EditorErrorBoundary'

export const EditorArea = () => {
    const { updateArea } = useKarmycStore.getState();
    // const { registerComponent: registerTopInnerArea } = useToolsSlot('inspector-area', 'top-inner');

    const handleEditorArea = (params: any) => {
        const areaId = params.areaId;
        if (areaId) {
            updateArea({
                id: areaId,
                type: 'editor-area',
                state: areaRegistry.getInitialState('editor-area')
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
        'editor-area',
        EditorComponent,
        {},
        {
            displayName: 'Inspector',
            defaultSize: { width: 300, height: 200 },
            role: AREA_ROLE.FOLLOW,
            icon: CircleSlash
        }
    );


    // Register action handlers
    useRegisterActionHandler('area.create-editor-area', handleEditorArea);


    return null
}


const EditorComponent = () => {
    const ErrorBoundary = EditorErrorBoundary as any;
    return (
        <ErrorBoundary>
            <Box bg="white" flex={1} position="relative">
                <Editor />
            </Box>
        </ErrorBoundary>
    )
}
