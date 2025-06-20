import React from 'react'
import { render } from '@testing-library/react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ChakraProvider } from '@chakra-ui/react'
import theme from '@chakra-ui/theme'
import { KarmycCoreProvider, useKarmyc } from '@gamesberry/karmyc-core'
import { openChakraPlugin } from '~core/karmyc-plugin'

import ComponentPreview from './ComponentPreview'

function renderWithKarmyc(
  components: React.ReactNode,
) {
  const karmycConfig = {
    plugins: [openChakraPlugin],
    initialAreas: [],
    keyboardShortcutsEnabled: false,
    builtInLayouts: [],
    initialLayout: 'default',
    resizableAreas: false,
    manageableAreas: false,
    multiScreen: false,
  };

  const karmyc = useKarmyc(karmycConfig);

  return {
    ...render(
      <ChakraProvider resetCSS theme={theme}>
        <DndProvider backend={HTML5Backend}>
          <KarmycCoreProvider options={karmyc}>
            {components}
          </KarmycCoreProvider>
        </DndProvider>
      </ChakraProvider>,
    ),
  }
}

const componentsToTest = [
  'Button',
  'Image',
  'Text',
  'Progress',
  'Link',
  'Checkbox',
  'Code',
  'FormLabel',
  // 'Tab',
  'Box',
  'Flex',

  // 'Tabs',
  // 'TabList',
  // 'TabPanels',
]

test.each(componentsToTest)('Component Preview for %s', componentName => {
  // Ajouter un composant de test via le plugin Karmyc
  const { actions } = require('~core/karmyc-plugin')
  actions.addComponent({
    parentName: 'root',
    type: componentName,
    rootParentType: componentName,
    testId: 'test',
  })

  renderWithKarmyc(<ComponentPreview componentName="test" />)
})
