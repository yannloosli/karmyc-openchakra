import { useMemo, useState } from 'react';
import { useToolsSlot } from '@gamesberry/karmyc-core';
import { InspectorArea } from './areas/inspector-area';
import { SidebarArea } from './areas/sidebar-area';
import { EditorArea } from './areas/editor-area';
import HeaderMenu from '~components/headerMenu/HeaderMenu'
import { useSelector } from 'react-redux';
import { getShowCode, getShowLayout } from '~core/selectors/app';
import { Button, FormControl, FormLabel, LightMode, PopoverFooter, PopoverContent, Popover, Switch, PopoverTrigger, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody } from '@chakra-ui/react';
import { Tooltip } from '@chakra-ui/react';
import useDispatch from '~hooks/useDispatch';
import { CheckIcon, ExternalLinkIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { FaReact } from 'react-icons/fa';
import { SiTypescript } from 'react-icons/si';
import { buildParameters } from '~utils/codesandbox'
import { generateCode } from '~utils/code'
import { getComponents } from '~core/selectors/components'

export const AreaInitializer = () => {

    // const { registerComponent: registerTitleComponent } = useToolsSlot('apptitle', 'top-outer');
    const { registerComponent: registerRootMenu } = useToolsSlot('app', 'top-outer');
    const { registerComponent: registerRootStatus } = useToolsSlot('app', 'bottom-outer');

    useMemo(() => {
        registerRootMenu(
            () => <HeaderMenu />,
            { name: 'topOuterLeftSlot', type: 'menu' },
            { order: 990, width: 'auto', alignment: 'left' }
        );
        registerRootMenu(
            () => {
                const showLayout = useSelector(getShowLayout)
                const dispatch = useDispatch()

                return (

                    <FormControl flexDirection="row" display="flex" alignItems="center">
                        <Tooltip
                            zIndex={100}
                            hasArrow
                            bg="yellow.100"
                            aria-label="Builder mode help"
                            label="Builder mode adds extra padding/borders"
                        >
                            <FormLabel
                                cursor="help"
                                color="gray.200"
                                fontSize="xs"
                                htmlFor="preview"
                                pb={0}
                                mb={0}
                                mr={2}
                                whiteSpace="nowrap"
                            >
                                Builder mode
                            </FormLabel>
                        </Tooltip>
                        <LightMode>
                            <Switch
                                isChecked={showLayout}
                                colorScheme="teal"
                                size="sm"
                                onChange={() => dispatch.app.toggleBuilderMode()}
                                id="preview"
                            />
                        </LightMode>
                    </FormControl>
                )
            },
            { name: 'topOuterLayoutSlot', type: 'menu' },
            { order: 991, width: 'auto', alignment: 'left' }
        );
        registerRootMenu(
            () => <CodeSandboxButton />,
            { name: 'export-button', type: 'menu' },
            { order: 991, width: 'auto', alignment: 'right' }
        );
        registerRootMenu(
            () => {
                const showCode = useSelector(getShowCode)
                const dispatch = useDispatch()

                return (
                    <FormControl display="flex" flexDirection="row" alignItems="center">
                        <FormLabel
                            color="gray.200"
                            fontSize="xs"
                            mr={2}
                            mb={0}
                            htmlFor="code"
                            pb={0}
                            whiteSpace="nowrap"
                        >
                            Code panel
                        </FormLabel>
                        <LightMode>
                            <Switch
                                isChecked={showCode}
                                id="code"
                                colorScheme="teal"
                                onChange={() => dispatch.app.toggleCodePanel()}
                                size="sm"
                            />
                        </LightMode>
                    </FormControl>
                )
            },
            { name: 'topOuterLayoutSlot', type: 'menu' },
            { order: 991, width: 'auto', alignment: 'left' }
        );

        registerRootStatus(
            () => {
                const dispatch = useDispatch()

                return (
                    <Popover>
                        {({ onClose }) => (
                            <>
                                <PopoverTrigger>
                                    <Button
                                        ml={4}
                                        rightIcon={<SmallCloseIcon />}
                                        size="xs"
                                        variant="unstyled"
                                    >
                                        Clear
                                    </Button>
                                </PopoverTrigger>
                                <LightMode>
                                    <PopoverContent zIndex={100} bg="white">
                                        <PopoverArrow />
                                        <PopoverCloseButton />
                                        <PopoverHeader>Are you sure?</PopoverHeader>
                                        <PopoverBody fontSize="sm">
                                            Do you really want to remove all components on the
                                            editor?
                                        </PopoverBody>
                                        <PopoverFooter display="flex" justifyContent="flex-end">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                colorScheme="red"
                                                rightIcon={<CheckIcon path="" />}
                                                onClick={() => {
                                                    dispatch.components.reset()
                                                    if (onClose) {
                                                        onClose()
                                                    }
                                                }}
                                            >
                                                Yes, clear
                                            </Button>
                                        </PopoverFooter>
                                    </PopoverContent>
                                </LightMode>
                            </>
                        )}
                    </Popover>
                )
            },
            { name: 'reset-button', type: 'status' },
            { order: 890, alignment: 'right', width: 'auto' }
        );
        registerRootStatus(
            () => <div style={{ color: 'white', padding: '8px' }}>Screen management 💪==&gt;</div>,
            { name: 'screen-status-bar', type: 'status' },
            { order: 990, alignment: 'right', width: 'auto' }
        );
        /*      registerTitleComponent(
                 () => {
                     const { activeSpaceId, getSpaceById } = useSpace();
                     const activeSpace = activeSpaceId ? getSpaceById(activeSpaceId) : null;
     
                     return (
                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white' }}>
                             <img
                                 src={iconSvg}
                                 style={{ width: '28px', height: '28px' }}
                             />
                             <strong>
                                 Karmyc core Demo
                             </strong>
                             {activeSpace && (
                                 <span style={{ marginLeft: '8px', opacity: 0.7 }}>
                                     {activeSpace.name}
                                 </span>
                             )}
                         </div>
                     );
                 },
                 { name: 'topOuterLeftSlot', type: 'menu' },
                 { order: 990, width: 'auto', alignment: 'left' }
             );
             registerTitleComponent(
                 () => (
                     <a
                     href="https://github.com/yannloosli/karmyc"
                     target="_blank"
                     style={{ display: 'flex', alignItems: 'center', }}
                     >
                     <svg
                     viewBox='0 0 24 24'
                     style={{ width: '28px', height: '28px', fill: 'white' }}
                     >
                     <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                         </svg>
                     </a>
                 ),
                 { name: 'github_link', type: 'link' },
                 { order: 990, width: 'auto', alignment: 'right' }
             ); */
    }, [registerRootStatus, registerRootMenu, /* registerTitleComponent */]);



    return (
        <>
            <SidebarArea />
            <EditorArea />
            <InspectorArea />
        </>
    );
};



const CodeSandboxButton = () => {
    const components = useSelector(getComponents)
    const [isLoading, setIsLoading] = useState(false)

    const exportToCodeSandbox = async (isTypeScript: boolean) => {
        setIsLoading(true)
        const code = await generateCode(components)
        setIsLoading(false)
        const parameters = buildParameters(code, isTypeScript)

        window.open(
            `https://codesandbox.io/api/v1/sandboxes/define?parameters=${parameters}`,
            '_blank',
        )
    }

    return (
        <Popover>
            {({ onClose }) => (
                <>
                    <PopoverTrigger>
                        <Button
                            isLoading={isLoading}
                            rightIcon={<ExternalLinkIcon path="" />}
                            variant="ghost"
                            size="xs"
                        >
                            Export code
                        </Button>
                    </PopoverTrigger>

                    <LightMode>
                        <PopoverContent zIndex={100} bg="white">
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Export format</PopoverHeader>
                            <PopoverBody fontSize="sm">
                                Export the code in CodeSandbox in which format ?
                            </PopoverBody>
                            <PopoverFooter display="flex" justifyContent="flex-end">
                                <Button
                                    size="sm"
                                    mr={2}
                                    variant="ghost"
                                    colorScheme="orange"
                                    rightIcon={<FaReact />}
                                    onClick={async () => {
                                        await exportToCodeSandbox(false)
                                        if (onClose) {
                                            onClose()
                                        }
                                    }}
                                >
                                    JSX
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="blue"
                                    rightIcon={<SiTypescript />}
                                    onClick={async () => {
                                        await exportToCodeSandbox(true)
                                        if (onClose) {
                                            onClose()
                                        }
                                    }}
                                >
                                    TSX
                                </Button>
                            </PopoverFooter>
                        </PopoverContent>
                    </LightMode>
                </>
            )}
        </Popover>
    )
}
