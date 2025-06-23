import React, { memo } from 'react'
import { createListCollection, Select } from '@chakra-ui/react'
import FormControl from '~components/inspector/controls/FormControl'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'

const FlexPanel = () => {
    const { setValueFromEvent } = useForm()

    const alignItems = usePropsSelector('alignItems')
    const flexDirection = usePropsSelector('flexDirection')
    const justifyContent = usePropsSelector('justifyContent')

    const flexDirectionChoices = createListCollection({
        items: [
            { label: 'row', value: 'row' },
            { label: 'row-reverse', value: 'row-reverse' },
            { label: 'column', value: 'column' },
            { label: 'column-reverse', value: 'column-reverse' },
        ],
    })

    const justifyContentChoices = createListCollection({
        items: [
            { label: 'flex-start', value: 'flex-start' },
            { label: 'center', value: 'center' },
            { label: 'flex-end', value: 'flex-end' },
            { label: 'space-between', value: 'space-between' },
            { label: 'space-around', value: 'space-around' },
        ],
    })

    const alignItemsChoices = createListCollection({
        items: [
            { label: 'stretch', value: 'stretch' },
            { label: 'flex-start', value: 'flex-start' },
            { label: 'center', value: 'center' },
            { label: 'flex-end', value: 'flex-end' },
            { label: 'space-between', value: 'space-between' },
            { label: 'space-around', value: 'space-around' },
        ],
    })
    return (
        <>
            <FormControl label="Direction">
                <Select.Root
                    name="flexDirection"
                    size="sm"
                    value={flexDirection || 'row'}
                    onValueChange={setValueFromEvent}
                    collection={flexDirectionChoices}
                >
                    <Select.HiddenSelect />
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
                            {flexDirectionChoices.items.map((choice: { label: string; value: string }) => (
                                <option key={choice.value} value={choice.value}>
                                    {choice.label}
                                </option>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Select.Root>
            </FormControl>

            <FormControl label="Justify content">
                <Select.Root
                    name="justifyContent"
                    size="sm"
                    value={justifyContent || 'flex-start'}
                    onValueChange={setValueFromEvent}
                    collection={justifyContentChoices}
                >
                    <Select.HiddenSelect />
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
                            {justifyContentChoices.items.map((choice: { label: string; value: string }) => (
                                <option key={choice.value} value={choice.value}>
                                    {choice.label}
                                </option>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Select.Root>
            </FormControl>

            <FormControl label="Align items">
                <Select.Root
                    name="alignItems"
                    size="sm"
                    value={alignItems || 'stretch'}
                    onValueChange={setValueFromEvent}
                    collection={alignItemsChoices}
                >
                    <Select.HiddenSelect />
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
                            {alignItemsChoices.items.map((choice: { label: string; value: string }) => (
                                <option key={choice.value} value={choice.value}>
                                    {choice.label}
                                </option>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Select.Root>
            </FormControl>
        </>
    )
}

export default memo(FlexPanel)
