import React, { ReactNode, useState, memo, useEffect } from 'react'
import { Box, Button, IconButton, Checkbox, Select, Field } from '@chakra-ui/react'
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
    const [gradientColor, setGradientColor] = useState(['green.200'])
    const [directionValue, setDirectionValue] = useState('to right')
    const gradient = usePropsSelector(props.name)
    const textGradient = usePropsSelector('bgClip')

    // Valeurs par défaut pour les options de gradient
    const defaultOptions: Gradient[] = [
        'to top',
        'to top right',
        'to right',
        'to bottom right',
        'to bottom',
        'to bottom left',
        'to left',
        'to top left',
    ]

    const choices = createListCollection({
        items: (props.options || defaultOptions).map((option) => ({ label: option, value: option })),
    })

    const updateValue = () => {
        if (
            gradientColor.length >= 2 &&
            gradient !== `${directionValue}, ${gradientColor.join(', ')}`
        ) {
            setValue(
                props.name,
                `${directionValue}, ${gradientColor.join(', ')}`,
            )
        }
    }

    useEffect(() => {
        updateValue()
        //eslint-disable-next-line
    }, [directionValue, gradientColor])

    useEffect(() => {
        if (gradient === '' || gradient === null) {
            setGradientColor(['green.200'])
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
    }, [gradient])

    const updateGradient = async (value: string, index: number) => {
        let colorCopy = [...gradientColor]
        colorCopy[index] = value
        setGradientColor(colorCopy)
    }

    const removeGradient = async (index: number) => {
        let colorCopy = [...gradientColor]
        colorCopy.splice(index, 1)
        if (colorCopy.length >= 2) {
            setGradientColor(colorCopy)
        } else {
            setGradientColor(colorCopy)
            setValue(props.name, null)
        }
    }

    return (
        <>
            <FormControl label={props.label}>
                <Select.Root
                    size="sm"
                    id={'direction'}
                    name={'direction'}
                    value={directionValue || 'to right'}
                    onValueChange={(e: { value: string }) => {
                        setDirectionValue(e.value)
                        if (gradientColor.length >= 2) {
                            setValue(
                                props.name,
                                `${e.value}, ${gradientColor.join(', ')}`,
                            )
                        }
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

            {gradientColor.map((e, i) => (
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
            ))}

            <Box textAlign="right" mt={3}>
                <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => setGradientColor([...gradientColor, 'blue.500'])}
                >
                    + Add
                </Button>
            </Box>
        </>
    )
}

export default memo(GradientControl)
