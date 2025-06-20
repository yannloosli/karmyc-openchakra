import React, { memo, useState, FormEvent, ChangeEvent, useRef } from 'react'
import { useInspectorState } from '~contexts/inspector-context'
import { useSelectedComponent } from '~hooks/useKarmycStore'
import { IoIosFlash } from 'react-icons/io'
import {
  IconButton,
  Flex,
  Box,
  SimpleGrid,
  InputGroup,
  InputRightElement,
  Input,
  ButtonGroup,
} from '@chakra-ui/react'
import { EditIcon, SmallCloseIcon } from '@chakra-ui/icons'
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
  const customProps = Object.keys(props).filter(
    propsName => !activeProps.includes(propsName),
  )

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
        <InputGroup size="sm">
          <Input
            ref={inputRef}
            placeholder="name=value"
            value={quickProps}
            onChange={onQuickPropsChange}
            isInvalid={hasError}
          />
          <InputRightElement>
            <IconButton
              aria-label="Add prop"
              icon={<IoIosFlash />}
              size="sm"
              type="submit"
            />
          </InputRightElement>
        </InputGroup>
      </form>

      <SimpleGrid columns={2} spacing={1} mt={2}>
        {customProps.map(propsName => (
          <Flex key={propsName} justify="space-between" align="center">
            <Box fontSize="xs" color="gray.600">
              {propsName}
            </Box>
            <ButtonGroup size="xs" isAttached>
              <IconButton
                aria-label="Edit prop"
                icon={<EditIcon path="" />}
                onClick={() => {
                  setQuickProps(`${propsName}=${props[propsName]}`)
                  inputRef.current?.focus()
                }}
              />
              <IconButton
                aria-label="Delete prop"
                icon={<SmallCloseIcon path="" />}
                onClick={() => onDelete(propsName)}
              />
            </ButtonGroup>
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  )
}

export default memo(CustomPropsPanel)
