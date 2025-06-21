import React, { memo } from 'react'
import {
  Box,
  Input,
  VStack,
  HStack,
} from '@chakra-ui/react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ChevronDown,
} from 'lucide-react'
import { useForm } from '~hooks/useForm'
import usePropsSelector from '~hooks/usePropsSelector'

type PaddingPanelPropsType = {
  type: 'margin' | 'padding'
}

const ATTRIBUTES = {
  margin: {
    all: 'm',
    left: 'ml',
    right: 'mr',
    bottom: 'mb',
    top: 'mt',
  },
  padding: {
    all: 'p',
    left: 'pl',
    right: 'pr',
    bottom: 'pb',
    top: 'pt',
  },
}

const PaddingPanel = ({ type }: PaddingPanelPropsType) => {
  const { setValueFromEvent } = useForm()

  const all = usePropsSelector(ATTRIBUTES[type].all)
  const left = usePropsSelector(ATTRIBUTES[type].left)
  const right = usePropsSelector(ATTRIBUTES[type].right)
  const bottom = usePropsSelector(ATTRIBUTES[type].bottom)
  const top = usePropsSelector(ATTRIBUTES[type].top)

  return (
    <Box mb={4}>
      <Box fontSize="xs" textTransform="capitalize" mb={2}>
        {type}
      </Box>

      <VStack gap={1}>
        <Input
          placeholder="All"
          size="sm"
          type="text"
          name={ATTRIBUTES[type].all}
          value={all || ''}
          onChange={setValueFromEvent}
        />

        <HStack gap={1}>
          <Box position="relative" flex={1}>
            <Box position="absolute" left={2} top="50%" transform="translateY(-50%)" zIndex={1}>
              <ArrowLeft size={16} color="#A0AEC0" />
            </Box>
            <Input
              placeholder="left"
              size="sm"
              type="text"
              name={ATTRIBUTES[type].left}
              value={left || ''}
              onChange={setValueFromEvent}
              autoComplete="off"
              pl={8}
            />
          </Box>

          <Box position="relative" flex={1}>
            <Box position="absolute" left={2} top="50%" transform="translateY(-50%)" zIndex={1}>
              <ArrowRight size={16} color="#A0AEC0" />
            </Box>
            <Input
              placeholder="right"
              size="sm"
              type="text"
              value={right || ''}
              name={ATTRIBUTES[type].right}
              onChange={setValueFromEvent}
              autoComplete="off"
              pl={8}
            />
          </Box>
        </HStack>

        <HStack gap={1}>
          <Box position="relative" flex={1}>
            <Box position="absolute" left={2} top="50%" transform="translateY(-50%)" zIndex={1}>
              <ArrowUp size={16} color="#A0AEC0" />
            </Box>
            <Input
              placeholder="top"
              size="sm"
              type="text"
              value={top || ''}
              name={ATTRIBUTES[type].top}
              onChange={setValueFromEvent}
              autoComplete="off"
              pl={8}
            />
          </Box>

          <Box position="relative" flex={1}>
            <Box position="absolute" left={2} top="50%" transform="translateY(-50%)" zIndex={1}>
              <ChevronDown size={16} color="#A0AEC0" />
            </Box>
            <Input
              placeholder="bottom"
              size="sm"
              type="text"
              value={bottom || ''}
              name={ATTRIBUTES[type].bottom}
              onChange={setValueFromEvent}
              autoComplete="off"
              pl={8}
            />
          </Box>
        </HStack>
      </VStack>
    </Box>
  )
}

export default memo(PaddingPanel)
