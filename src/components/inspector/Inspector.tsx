import React, { useState, memo, useEffect, useMemo } from 'react'
import {
    Link,
    Box,
    Stack,
    Button,
    Text,
    Input,
    Field,
} from '@chakra-ui/react'
import { Copy, Check, Edit } from 'lucide-react'
import Panels from '~components/inspector/panels/Panels'
import { GoRepo, GoCode } from 'react-icons/go'
import { FiTrash2 } from 'react-icons/fi'
import { IoMdRefresh } from 'react-icons/io'
import useDispatch from '~hooks/useDispatch'
import StylesPanel from '~components/inspector/panels/StylesPanel'
import {
    useSelectedComponent,
    useComponents,
    useSelectedComponentId,
    useComponentNames,
} from '~hooks/useKarmycStore'
import ActionButton from './ActionButton'
import { generateComponentCode, formatCode } from '~utils/code'
import useClipboard from '~hooks/useClipboard'
import { useInspectorUpdate } from '~contexts/inspector-context'
import { componentsList } from '~componentsList'

const CodeActionButton = memo(() => {
    const [isLoading, setIsLoading] = useState(false)
    const { onCopy, hasCopied } = useClipboard()

    const selectedId = useSelectedComponentId()
    const components = useComponents()

    const parentId = components[selectedId].parent
    const parent = { ...components[parentId] }
    // Do not copy sibling components from parent
    parent.children = [selectedId]

    return (
        <ActionButton
            isLoading={isLoading}
            label="Copy code component"
            colorScheme={hasCopied ? 'green' : 'gray'}
            onClick={async () => {
                setIsLoading(true)
                const code = await generateComponentCode({
                    component: parent,
                    components,
                    componentName: components[selectedId].componentName,
                    forceBuildBlock: true,
                })
                onCopy(await formatCode(code))
                setIsLoading(false)
            }}
            icon={hasCopied ? <Check size={16} /> : <GoCode />}
        />
    )
})

CodeActionButton.displayName = 'CodeActionButton'

const Inspector = () => {
    const dispatch = useDispatch()
    const component = useSelectedComponent()
    const [componentName, onChangeComponentName] = useState('')
    const [showNameInput, setShowNameInput] = useState(false)
    const componentsNames = useComponentNames()

    const { clearActiveProps } = useInspectorUpdate()

    const saveComponent = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        dispatch.components.setComponentName({
            componentId: component.id,
            name: componentName,
        })
        setShowNameInput(false)
        onChangeComponentName('')
    }

    const isValidComponentName = useMemo(() => {
        return (
            !!componentName.match(/^[A-Z]\w*$/g) &&
            !componentsNames.includes(componentName) &&
            // @ts-ignore
            !componentsList.includes(componentName)
        )
    }, [componentName, componentsNames])

    const { type, rootParentType, id, children } = component

    const isRoot = id === 'root'
    const parentIsRoot = component.parent === 'root'

    const docType = rootParentType || type
    const componentHasChildren = children.length > 0

    useEffect(() => {
        clearActiveProps()
    }, [clearActiveProps])

    return (
        <>
            <Box bg="white" w="100%" >
                <Box
                    fontWeight="semibold"
                    fontSize="md"
                    color="yellow.900"
                    py={2}
                    px={2}
                    boxShadow="sm"
                    bg="yellow.100"
                    display="flex"
                    justifyContent="flex-start"
                    flexDir="column"
                >
                    {isRoot ? 'Document' : type}
                    {!!component.componentName && (
                        <Text fontSize="xs" fontWeight="light">
                            {component.componentName}
                        </Text>
                    )}
                </Box>
                {!isRoot && (
                    <Stack
                        direction="row"
                        py={2}
                        gap={2}
                        align="center"
                        zIndex={99}
                        px={2}
                        flexWrap="wrap"
                        justify="flex-end"
                    >
                        <CodeActionButton />
                        {!component.componentName && (
                            <ActionButton
                                label="Name component"
                                icon={<Edit size={16} />}
                                onClick={() => setShowNameInput(true)}
                            />
                        )}
                        <ActionButton
                            label="Duplicate"
                            onClick={() => dispatch.components.duplicate()}
                            icon={<Copy size={16} />}
                        />
                        <ActionButton
                            label="Reset props"
                            icon={<IoMdRefresh />}
                            onClick={() => dispatch.components.resetProps(component.id)}
                        />
                        <ActionButton
                            label="Chakra UI Doc"
                            as={Link}
                            onClick={() => {
                                window.open(
                                    `https://chakra-ui.com/${docType.toLowerCase()}`,
                                    '_blank',
                                )
                            }}
                            icon={<GoRepo />}
                        />
                        <ActionButton
                            bg="red.500"
                            label="Remove"
                            onClick={() => dispatch.components.deleteComponent(component.id)}
                            icon={<FiTrash2 />}
                        />
                    </Stack>
                )}
            </Box>

            {showNameInput && (
                <Box
                    position="fixed"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    bg="white"
                    p={6}
                    borderRadius="md"
                    boxShadow="xl"
                    zIndex={1000}
                    minW="300px"
                >
                    <form onSubmit={saveComponent}>
                        <Text fontSize="lg" fontWeight="bold" mb={4}>
                            Save this component
                        </Text>
                        <Field.Root invalid={!isValidComponentName && componentName.length > 0}
                        >
                            <Input
                                placeholder="Component name"
                                value={componentName}
                                onChange={(e) => onChangeComponentName(e.target.value)}
                                mb={4}
                            />
                        </Field.Root>
                        <Box display="flex" gap={2} justifyContent="flex-end">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setShowNameInput(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                colorScheme="blue"
                                type="submit"
                                disabled={!isValidComponentName}
                            >
                                Save
                            </Button>
                        </Box>
                    </form>
                </Box>
            )}

            <Box pb={1} bg="white" px={3}>
                <Panels component={component} isRoot={isRoot} />
            </Box>

            <StylesPanel
                isRoot={isRoot}
                showChildren={componentHasChildren}
                parentIsRoot={parentIsRoot}
            />
        </>
    )
}

export default Inspector
