import React from 'react'
import { useDrag } from 'react-dnd'
import { Text, Box } from '@chakra-ui/react'
import { GripVertical } from 'lucide-react'

const DragItem: React.FC<ComponentItemProps> = ({
  type,
  soon,
  label,
  isMeta,
  isChild,
  rootParentType,
}) => {
  const [, drag] = useDrag({
    type: type || 'component',
    item: { id: type, type, isMeta, rootParentType },
  })

  let boxProps: any = {
    cursor: 'no-drop',
    color: 'whiteAlpha.600',
  }

  if (!soon) {
    boxProps = {
      ref: drag,
      color: 'whiteAlpha.800',
      cursor: 'move',
      _hover: {
        ml: -1,
        mr: 1,
        bg: 'teal.100',
        boxShadow: 'sm',
        color: 'teal.800',
      },
    }
  }

  if (isChild) {
    boxProps = { ...boxProps, ml: 4 }
  }

  return (
    <Box
      boxSizing="border-box"
      transition="margin 200ms"
      my={1}
      borderRadius="md"
      p={1}
      display="flex"
      alignItems="center"
      {...boxProps}
    >
      <GripVertical size={16} style={{ marginRight: 8 }} />
      <Text letterSpacing="wide" fontSize="sm" textTransform="capitalize">
        {label}
      </Text>
      {isMeta && (
        <Box
          ml={2}
          borderWidth="1px"
          color="teal.300"
          borderColor="teal.600"
          fontSize="xs"
          borderRadius={4}
          px={1}
        >
          preset
        </Box>
      )}
      {soon && (
        <Box
          ml={2}
          borderWidth="1px"
          color="whiteAlpha.500"
          borderColor="whiteAlpha.300"
          fontSize="xs"
          borderRadius={4}
          px={1}
        >
          soon
        </Box>
      )}
    </Box>
  )
}

export default DragItem
