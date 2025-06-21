import React, { memo } from 'react'
import { IconButton, ButtonGroup, useChakraContext } from '@chakra-ui/react'
import ColorsControl from '~components/inspector/controls/ColorsControl'
import { GoBold, GoItalic } from 'react-icons/go'
import {
  MdFormatAlignLeft,
  MdFormatAlignRight,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
} from 'react-icons/md'
import FormControl from '~components/inspector/controls/FormControl'
import { ComboboxOption } from '@reach/combobox'
import InputSuggestion from '~components/inspector/inputs/InputSuggestion'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'

const TextPanel = () => {
  const { setValue, setValueFromEvent } = useForm()
  const { tokens } = useChakraContext()

  const fontWeight = usePropsSelector('fontWeight')
  const fontStyle = usePropsSelector('fontStyle')
  const textAlign = usePropsSelector('textAlign')
  const fontSize = usePropsSelector('fontSize')
  const letterSpacing = usePropsSelector('letterSpacing')
  const lineHeight = usePropsSelector('lineHeight')

  return (
    <>
      <FormControl label="Style">
        <IconButton
          mr={1}
          aria-label="bold"
          onClick={() => {
            setValue('fontWeight', fontWeight ? null : 'bold')
          }}
          size="xs"
          colorScheme={fontWeight ? 'whatsapp' : 'gray'}
          variant={fontWeight ? 'solid' : 'outline'}
        >
          <GoBold />
        </IconButton>
        <IconButton
          aria-label="italic"
          onClick={() => {
            setValue('fontStyle', fontStyle === 'italic' ? null : 'italic')
          }}
          size="xs"
          colorScheme={fontStyle === 'italic' ? 'whatsapp' : 'gray'}
          variant={fontStyle === 'italic' ? 'solid' : 'outline'}
        >
          <GoItalic />
        </IconButton>
      </FormControl>

      <FormControl label="Text align">
        <ButtonGroup size="xs" attached>
          <IconButton
            aria-label="bold"
            onClick={() => {
              setValue('textAlign', 'left')
            }}
            colorScheme={textAlign === 'left' ? 'whatsapp' : 'gray'}
            variant={textAlign === 'left' ? 'solid' : 'outline'}
          >
            <MdFormatAlignLeft />
          </IconButton>

          <IconButton
            aria-label="italic"
            onClick={() => {
              setValue('textAlign', 'center')
            }}
            colorScheme={textAlign === 'center' ? 'whatsapp' : 'gray'}
            variant={textAlign === 'center' ? 'solid' : 'outline'}
          >
            <MdFormatAlignCenter />
          </IconButton>

          <IconButton
            aria-label="italic"
            onClick={() => {
              setValue('textAlign', 'right')
            }}
            colorScheme={textAlign === 'right' ? 'whatsapp' : 'gray'}
            variant={textAlign === 'right' ? 'solid' : 'outline'}
          >
            <MdFormatAlignRight />
          </IconButton>

          <IconButton
            aria-label="italic"
            onClick={() => {
              setValue('textAlign', 'justify')
            }}
            colorScheme={textAlign === 'justify' ? 'whatsapp' : 'gray'}
            variant={textAlign === 'justify' ? 'solid' : 'outline'}
          >
            <MdFormatAlignJustify />
          </IconButton>
        </ButtonGroup>
      </FormControl>

      <FormControl label="Font size">
        <InputSuggestion
          value={fontSize}
          handleChange={setValueFromEvent}
          name="fontSize"
        >
          {Object.keys(tokens.getCategoryValues('fontSizes')).map(option => (
            <ComboboxOption key={option} value={option} />
          ))}
        </InputSuggestion>
      </FormControl>

      <ColorsControl withFullColor enableHues name="color" label="Color" />

      <FormControl label="Line height">
        <InputSuggestion
          value={lineHeight}
          handleChange={setValueFromEvent}
          name="lineHeight"
        >
          {Object.keys(tokens.getCategoryValues('lineHeights')).map(option => (
            <ComboboxOption key={option} value={option} />
          ))}
        </InputSuggestion>
      </FormControl>

      <FormControl label="Letter spacing">
        <InputSuggestion
          value={letterSpacing}
          handleChange={setValueFromEvent}
          name="letterSpacing"
        >
          {Object.keys(tokens.getCategoryValues('letterSpacings')).map(option => (
            <ComboboxOption key={option} value={option} />
          ))}
        </InputSuggestion>
      </FormControl>
    </>
  )
}

export default memo(TextPanel)
