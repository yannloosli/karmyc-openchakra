import React, { memo, useState, FormEvent, ChangeEvent, useRef, useMemo } from 'react'
import { useInspectorState } from '~contexts/inspector-context'
import { useSelectedComponent } from '~hooks/useKarmycStore'
import { IoIosFlash } from 'react-icons/io'
import {
    IconButton,
    Flex,
    Box,
    SimpleGrid,
    Input,
    ButtonGroup,
    InputGroup,
    Field
} from '@chakra-ui/react'
import { Edit, X } from 'lucide-react'
import { useKarmycDispatch } from '~hooks/useKarmycStore'
import { useForm } from '~hooks/useForm'

const SEPARATOR = '='

const CustomPropsPanel = () => {
    const dispatch = useKarmycDispatch()
    const inputRef = useRef<HTMLInputElement>(null)

    const activePropsRef = useInspectorState()
    const { props, id } = useSelectedComponent()
    const { setValue } = useForm()

    const [quickProps, setQuickProps] = useState('')
    const [hasError, setError] = useState(false)

    const onDelete = (propsName: string) => {
        dispatch.components.deleteProps({
            id,
            name: propsName,
        })
    }

    const activeProps = activePropsRef || []

    const customProps = useMemo(() => {
        return Object.keys(props).filter(
            propsName => !activeProps.includes(propsName),
        )
    }, [props, activeProps])

    const onQuickPropsSubmit = (e: FormEvent) => {
        e.preventDefault()
        const [name, value] = quickProps.split(SEPARATOR)

        if (!name || !value) {
            setError(true)
            return
        }

        setValue(name.trim(), value.trim())
        setQuickProps('')
        setError(false)
    }

    const onQuickPropsChange = (e: ChangeEvent<HTMLInputElement>) => {
        setQuickProps(e.target.value)
        setError(false)
    }

    return (
        <Box>
            <form onSubmit={onQuickPropsSubmit}>
                <Field.Root invalid={hasError}>
                    <InputGroup
                        endAddon={
                            <IconButton
                                aria-label="Add prop"
                                size="sm"
                                type="submit"
                                borderLeftRadius={0}
                            >
                                <IoIosFlash />
                            </IconButton>
                        }
                    >
                        <Input
                            ref={inputRef}
                            placeholder="name=value"
                            value={quickProps}
                            onChange={onQuickPropsChange}
                            size="sm"
                            flex={1}
                            borderRightRadius={0}
                        />

                    </InputGroup>
                </Field.Root>
            </form>

            <SimpleGrid columns={2} gap={1} mt={2}>
                {customProps.map(propsName => (
                    <Flex key={propsName} justify="space-between" align="center">
                        <Box fontSize="xs" color="gray.600">
                            {propsName}
                        </Box>
                        <ButtonGroup size="xs" attached>
                            <IconButton
                                aria-label="Edit prop"
                                onClick={() => {
                                    setQuickProps(`${propsName}=${props[propsName]}`)
                                    setTimeout(() => {
                                        inputRef.current?.focus()
                                    }, 0)
                                }}
                            >
                                <Edit size={16} />
                            </IconButton>
                            <IconButton
                                aria-label="Delete prop"
                                onClick={() => onDelete(propsName)}
                            >
                                <X size={16} />
                            </IconButton>
                        </ButtonGroup>
                    </Flex>
                ))}
            </SimpleGrid>
        </Box>
    )
}

export default memo(CustomPropsPanel)
