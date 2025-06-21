import React, { memo } from 'react'
import dynamic from 'next/dynamic'
import {
  Box,
  Button,
  Menu,
  Portal,
  ButtonProps,
  PopoverBody,
  Flex,
} from '@chakra-ui/react'
import { ChevronDown } from 'lucide-react'
import { FaBomb } from 'react-icons/fa'
import { GoRepo, GoArchive } from 'react-icons/go'

const ExportMenuItem = dynamic(() => import('./ExportMenuItem'), { ssr: false })
const ImportMenuItem = dynamic(() => import('./ImportMenuItem'), { ssr: false })

const HeaderMenu = () => {
  return (
    <Menu.Root positioning={{ placement: 'bottom' }}>
      <Menu.Trigger>
          <Flex>Editor<ChevronDown/></Flex>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.ItemGroup>
              <ExportMenuItem />
              <ImportMenuItem />
            </Menu.ItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}

export default memo(HeaderMenu)
