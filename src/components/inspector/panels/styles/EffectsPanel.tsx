import React, { memo, useMemo } from 'react'
import FormControl from '~components/inspector/controls/FormControl'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import {
  Slider,
} from '@chakra-ui/react'
import TextControl from '~components/inspector/controls/TextControl'

const EffectsPanel = () => {
  const { setValue } = useForm()
  const opacity = usePropsSelector('opacity')

  const normalizedOpacity = useMemo(() => {
    return opacity * 100 || 100
  }, [opacity])

  return (
    <>
      <FormControl label="Opacity">
        <Slider.Root
          min={1}
          max={100}
          onValueChange={(details: { value: number[] }) => setValue('opacity', details.value[0] / 100)}
          value={[normalizedOpacity]}
          mr={2}
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumbs />
          </Slider.Control>
        </Slider.Root>
      </FormControl>

      <TextControl name="boxShadow" label="Box Shadow" />
    </>
  )
}

export default memo(EffectsPanel)
