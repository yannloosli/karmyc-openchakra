import React, { ReactNode, memo } from 'react'
import {
  Accordion,
  Box,
  Text,
} from '@chakra-ui/react'

const AccordionContainer: React.FC<{
  title: ReactNode
  defaultIsOpen?: boolean
  children: ReactNode
  value?: string
  disabled?: boolean
}> = ({ title, children, defaultIsOpen = true, value, disabled }) => {
  const AccordionItem = Accordion.Item as any
  
  return (
    <AccordionItem value={value} disabled={disabled}>
      <Accordion.ItemTrigger>
        <Box flex="1" textAlign="left">
          <Text px={2}>{title}</Text>
        </Box>
        <Accordion.ItemIndicator />
      </Accordion.ItemTrigger>
      <Accordion.ItemContent>
        <Box p={4}>
          {children}
        </Box>
      </Accordion.ItemContent>
    </AccordionItem>
  )
}

export default memo(AccordionContainer)
