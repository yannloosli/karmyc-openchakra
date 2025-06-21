import React, { useState, ChangeEvent, memo } from 'react'
import {
  Box,
  Input,
  InputGroup,
  InputElement,
  IconButton,
  Flex,
} from '@chakra-ui/react'
import { X, Search } from 'lucide-react'
import DragItem from './DragItem'
import { menuItems, MenuItem } from '~componentsList'

const Menu = () => {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <Box
      overflowY="auto"
      overflowX="visible"
      boxShadow="xl"
      m={0}
      p={0}
      as="menu"
      backgroundColor="#2e3748"
      w="100%"
      h="100%"
    >
      <Box p={5} pb={1} position="sticky" w="100%" bgColor="#2e3748" top={0}>
        <InputGroup mb={4} endElement={searchTerm ? (
                <IconButton
                  color="gray.300"
                  aria-label="clear"
                  size="xs"
                  onClick={() => setSearchTerm('')}
                >
                  <X size={16} />
                </IconButton>
              ) : (
                <Search size={16} color="#A0AEC0" />
              )}>
          <Input
            value={searchTerm}
            color="gray.300"
            placeholder="Search component…"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(event.target.value)
            }
            borderColor="rgba(255, 255, 255, 0.04)"
            bg="rgba(255, 255, 255, 0.06)"
            _hover={{
              borderColor: 'rgba(255, 255, 255, 0.08)',
            }}
            zIndex={0}
          />
        </InputGroup>
      </Box>
      <Box p={5} pt={0}>
        {(Object.keys(menuItems) as ComponentType[])
          .filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(name => {
            const { children, soon } = menuItems[name] as MenuItem

            if (children) {
              const elements = Object.keys(children).map(childName => (
                <DragItem
                  isChild
                  key={childName}
                  label={childName}
                  type={childName as any}
                  id={childName as any}
                  rootParentType={menuItems[name]?.rootParentType || name}
                >
                  {childName}
                </DragItem>
              ))

              return [
                <DragItem
                  isMeta
                  soon={soon}
                  key={`${name}Meta`}
                  label={name}
                  type={`${name}Meta` as any}
                  id={`${name}Meta` as any}
                  rootParentType={menuItems[name]?.rootParentType || name}
                >
                  {name}
                </DragItem>,
                ...elements,
              ]
            }

            return (
              <DragItem
                soon={soon}
                key={name}
                label={name}
                type={name as any}
                id={name as any}
                rootParentType={menuItems[name]?.rootParentType || name}
              >
                {name}
              </DragItem>
            )
          })}
      </Box>
    </Box>
  )
}

export default memo(Menu)
