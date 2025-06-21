import React, { memo } from 'react'
import { Field, Select } from '@chakra-ui/react'
import FormControl from '~components/inspector/controls/FormControl'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'
import FlexPanel from './FlexPanel'

const DisplayPanel = () => {
  const { setValueFromEvent } = useForm()
  const display = usePropsSelector('display')

  return (
    <>
      <Field.Root label="Display">
        <Select.Root
          size="sm"
          value={display || ''}
          onChange={setValueFromEvent}
          name="display"
        >
          <option>block</option>
          <option>flex</option>
          <option>inline</option>
          <option>grid</option>
          <option>inline-block</option>
        </Select.Root>
      </Field.Root>

      {display === 'flex' && <FlexPanel />}
    </>
  )
}

export default memo(DisplayPanel)
