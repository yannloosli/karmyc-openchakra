import React, { ReactNode } from 'react'
import { Switch } from '@chakra-ui/react'
import FormControl from './FormControl'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'

type SwitchControlPropsType = {
  name: string
  label: string | ReactNode
}

const SwitchControl: React.FC<SwitchControlPropsType> = ({ name, label }) => {
  const { setValue } = useForm()
  const value = usePropsSelector(name)

  return (
    <FormControl label={label} htmlFor={name}>
      <Switch.Root
        name={name}
        id={name}
        size="sm"
        checked={value || false}
        onChange={() => setValue(name, !value)}
      >
        <Switch.HiddenInput />
        <Switch.Control />
      </Switch.Root>
    </FormControl>
  )
}

export default SwitchControl
