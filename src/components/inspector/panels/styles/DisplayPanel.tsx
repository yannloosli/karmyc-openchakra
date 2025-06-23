import React, { memo } from 'react'
import { Select, createListCollection } from '@chakra-ui/react'
import FormControl from '~components/inspector/controls/FormControl'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import FlexPanel from './FlexPanel'

const displayChoices = createListCollection({
    items: [
        { label: 'block', value: 'block' },
        { label: 'flex', value: 'flex' },
        { label: 'inline', value: 'inline' },
        { label: 'grid', value: 'grid' },
        { label: 'inline-block', value: 'inline-block' },
    ],
})

const DisplayPanel = () => {
    const { setValueFromEvent } = useForm()
    const display = usePropsSelector('display')

    return (
        <>
            <FormControl label="Display">
                <Select.Root
                    size="sm"
                    value={display || ''}
                    onValueChange={setValueFromEvent}
                    name="display"
                    collection={displayChoices}
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
                            {displayChoices.items.map((choice: { label: string; value: string }) => (
                                <option key={choice.value} value={choice.value}>
                                    {choice.label}
                                </option>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Select.Root>
            </FormControl>

            {display === 'flex' && <FlexPanel />}
        </>
    )
}

export default memo(DisplayPanel)
