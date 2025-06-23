import React, { ReactNode, useState, memo, useEffect } from 'react'
import { Box, Button, IconButton, Checkbox, Select, Field, Flex } from '@chakra-ui/react'
import { X } from 'lucide-react'
import FormControl from './FormControl'
import { useForm } from '~hooks/useForm'
import ColorPickerControl from './ColorPickerControl'
import usePropsSelector from '~hooks/usePropsSelector'
import { createListCollection } from '@chakra-ui/react'

export type Gradient =
    | 'to top'
    | 'to top right'
    | 'to right'
    | 'to bottom right'
    | 'to bottom'
    | 'to bottom left'
    | 'to left'
    | 'to top left'
type GradientControlPropsType = {
    name: string
    label: string | ReactNode
    enableHues?: boolean
    withFullColor?: boolean
    options?: Gradient[]
}

const GradientControl = (props: GradientControlPropsType) => {
    const { setValue } = useForm()
    const [gradientFromColor, setGradientFromColor] = useState('green.200')
    const [gradientToColor, setGradientToColor] = useState('green.200')
    const [gradientViaColor, setGradientViaColor] = useState('green.200')
    const [directionValue, setDirectionValue] = useState('to right')
    const gradient = usePropsSelector(props.name)
    const gradientFrom = usePropsSelector('gradientFrom')
    const gradientVia = usePropsSelector('gradientVia')
    const gradientTo = usePropsSelector('gradientTo')
    const textGradient = usePropsSelector('bgClip')

    // Valeurs par défaut pour les options de gradient
    const defaultOptions: Gradient[] = [
        'to-t',
        'to-tr',
        'to-r',
        'to-br',
        'to-b',
        'to-bl',
        'to-l',
        'to-tl',
    ]

    const choices = createListCollection({
        items: (props.options || defaultOptions).map((option) => ({ label: option, value: option })),
    })

    const updateValue = (name: string, value: string) => {
            setValue(
                name,
            value,
        )
    }

    useEffect(() => {
        updateValue('gradientFrom', gradientFromColor)
        updateValue('gradientVia', gradientViaColor)
        updateValue('gradientTo', gradientToColor)
        updateValue(props.name, directionValue)
        //eslint-disable-next-line
    }, [directionValue, gradientFromColor, gradientToColor, gradientViaColor])

   /*  useEffect(() => {
        if (gradient === '' || gradient === null) {
            setGradientFromColor('green.200')
            setGradientViaColor('green.200')
            setGradientToColor('green.200')
        } else {
            try {
                const parts = gradient.split(',')
                if (parts.length >= 2) {
                    const actualDirection = parts[0].trim()
                    const colorArray = parts.slice(1).map((color: string) => color.trim())
                    setDirectionValue(actualDirection)
                    setGradientColor(colorArray)
                }
            } catch (e) {
                console.log(e)
            }
        }
    }, [gradient, gradientFrom, gradientVia, gradientTo]) */


    return (
        <>
            <FormControl label={props.label}>
                <Select.Root
                    size="sm"
                    id={'direction'}
                    name={'direction'}
                    value={directionValue || 'to-r'}
                    onValueChange={(e: { value: string }) => {
                        setDirectionValue(e.value)
                        setValue(
                            props.name,
                            e.value,
                        )
                    }}
                    collection={choices}
                >
                    <Select.HiddenSelect />
                    <Select.Label>Select direction</Select.Label>
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Select.Positioner>
                        <Select.Content>
                            {choices.items.map((choice: any) => (
                                <Select.Item item={choice} key={choice.value}>
                                    <Select.ItemText>{choice.label}</Select.ItemText>
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Select.Root>
            </FormControl>

            <Field.Root label="Clip to Text">
                <Field.Label>Clip to Text</Field.Label>
                <Checkbox.Root
                    defaultChecked={textGradient}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        e.target.checked
                            ? setValue('bgClip', `text`)
                            : setValue('bgClip', null)
                    }
                >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                </Checkbox.Root>
            </Field.Root>

            <Flex textAlign="right" mt={3} >
                <Box>
                    <ColorPickerControl
                        withFullColor={props.withFullColor}
                        name={'gradientFrom'}
                        gradient={false}
                        index={0}

                    />
                    <IconButton
                        asChild
                        onClick={() => setGradientFromColor("")}
                        variant="ghost"
                        marginRight={2}
                        size="xs"
                        aria-label="delete"
                    >
                        <X size={8} />
                    </IconButton>
                </Box>
                <Box>
                    <ColorPickerControl
                        withFullColor={props.withFullColor}
                        name={'gradientVia'}
                        gradient={false}
                        index={0}

                    />
                    <IconButton
                        asChild
                        onClick={() => setGradientViaColor("")}
                        variant="ghost"
                        marginRight={2}
                        size="xs"
                        aria-label="delete"
                    >
                        <X size={8} />
                    </IconButton>
                </Box>
                <Box>
                    <ColorPickerControl
                        withFullColor={props.withFullColor}
                        name={'gradientTo'}
                        gradient={false}
                        index={0}

                    />
                    <IconButton
                        asChild
                        onClick={() => setGradientToColor("")}
                        variant="ghost"
                        marginRight={2}
                        size="xs"
                        aria-label="delete"
                    >
                        <X size={8} />
                    </IconButton>
                </Box>
            </Flex>

            {/* {gradientColor.map((e, i) => (
                <Box textAlign="right" mt={3} key={i}>
                    {i >= 1 && (
                        <IconButton
                            asChild
                            onClick={() => removeGradient(i)}
                            variant="ghost"
                            marginRight={2}
                            size="xs"
                            aria-label="delete"
                        >
                            <X size={16} />
                        </IconButton>
                    )}

                    <ColorPickerControl
                        withFullColor={props.withFullColor}
                        name={props.name}
                        gradient
                        index={i}
                        gradientColor={e}
                        updateGradient={updateGradient}
                    />
                </Box>
            ))} */}

            {/*  <Box textAlign="right" mt={3}>
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setGradientColor([...gradientColor, 'blue.500'])}
                >
                    + Add
                </Button>
            </Box> */}
        </>
    )
}

export default memo(GradientControl)
