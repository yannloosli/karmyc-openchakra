export const COMPONENTS: (ComponentType | MetaComponentType)[] = [
  'Box',
  'Button',
  'Flex',
  'Image',
  'Link',
  'Text',
  'Tab',
  'Menu',
  'Tab',
  'TabList',
  'TabPanel',
  'TabPanels',
  'Tabs',
  // Allow meta components
  'TabsMeta',
]

export const rootComponents = COMPONENTS
  // Remove specific components
  .filter(
    name =>
      ![
        //'Layer',
        //@ts-expect-error unused filter for now
      ].includes(name),
  )
