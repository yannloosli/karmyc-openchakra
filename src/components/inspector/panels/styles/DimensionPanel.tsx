import React, { memo } from 'react'
import { SimpleGrid, Select, createListCollection } from '@chakra-ui/react'
import FormControl from '~components/inspector/controls/FormControl'
import usePropsSelector from '~hooks/usePropsSelector'
import { useForm } from '~hooks/useForm'
import TextControl from '~components/inspector/controls/TextControl'

const collection = createListCollection({
    items: [
        { label: "visible", value: "visible" },
        { label: "hidden", value: "hidden" },
        { label: "scroll", value: "scroll" },
    ],
})

const DimensionPanel = () => {
    const { setValue } = useForm()
    const overflow = usePropsSelector('overflow')

    const handleOverflowChange = (e: { value: string }) => {
        setValue('overflow', e.value)
    }
    console.log(overflow)
    return (
        <>
            <SimpleGrid columns={2} gap={1}>
                <TextControl label="Width" name="width" />
                <TextControl label="Height" name="height" />
            </SimpleGrid>

            <SimpleGrid columns={2} gap={1}>
                <TextControl label="Min W" name="minWidth" />
                <TextControl label="Min H" name="minHeight" />

                <TextControl label="Max W" name="maxWidth" />
                <TextControl label="Max H" name="maxHeight" />
            </SimpleGrid>

            <FormControl label="Overflow">
                <Select.Root
                    size="sm"
                    value={overflow || 'visible'}
                    onValueChange={handleOverflowChange}
                    collection={collection}
                >
                    <Select.HiddenSelect />
                    <Select.Label>Select overflow</Select.Label>
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
                            {collection.items.map((item: { label: string; value: string }) => (
                                <Select.Item key={item.value} item={item}>
                                    <Select.ItemText>{item.label}</Select.ItemText>
                                    <Select.ItemIndicator />
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Positioner>
                </Select.Root>
            </FormControl>
        </>
    )
}

export default memo(DimensionPanel)
