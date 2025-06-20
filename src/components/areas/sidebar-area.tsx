import { useMemo } from "react";
import { Box } from "@chakra-ui/react";
import Sidebar from '~components/sidebar/Sidebar'
import { AREA_ROLE, areaRegistry, useKarmycStore, useRegisterAreaType, useRegisterActionHandler } from "@gamesberry/karmyc-core";
import { CircleSlash } from "lucide-react";


export const SidebarArea = () => {
    const { updateArea } = useKarmycStore.getState();
    // const { registerComponent: registerTopInnerArea } = useToolsSlot('inspector-area', 'top-inner');

    const handleSidebarArea = (params: any) => {
        const areaId = params.areaId;
        if (areaId) {
            updateArea({
                id: areaId,
                type: 'sidebar-area',
                state: areaRegistry.getInitialState('sidebar-area')
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
        'sidebar-area',
        SidebarComponent,
        {},
        {
            displayName: 'Inspector',
            defaultSize: { width: 300, height: 200 },
            role: AREA_ROLE.SELF,
            icon: CircleSlash
        }
    );


    // Register action handlers
    useRegisterActionHandler('area.create-sidebar-area', handleSidebarArea);


    return null
}


const SidebarComponent = () => {

    return (
        <Sidebar />
    )
}
