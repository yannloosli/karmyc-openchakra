export type MenuItem = {
  children?: MenuItems
  soon?: boolean
  rootParentType?: ComponentType
}

type MenuItems = Partial<
  {
    [k in ComponentType]: MenuItem
  }
>

export const menuItems: MenuItems = {
  Box: {},
  Button: {},
  Flex: {},
  Image: {},
  Link: {},
  Tabs: {
    children: {
      Tabs: {},
      Tab: {},
      TabList: {},
      TabPanel: {},
      TabPanels: {},
    },
  },
  Text: {},
  Menu: { soon: true }
}

export const componentsList: ComponentType[] = [
  'Box',
  'Button',
  'Flex',
  'Image',
  'Link',
  'Menu',
  'Tab',
  'TabList',
  'TabPanel',
  'TabPanels',
  'Tabs',
  'Text',
]
