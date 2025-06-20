import React, { memo } from 'react'
import * as Chakra from '@chakra-ui/react'
import { useComponentBy } from '~hooks/useKarmycStore'
import ButtonPreview from '~components/editor/previews/ButtonPreview'
import PreviewContainer from '~components/editor/PreviewContainer'
import WithChildrenPreviewContainer from '~components/editor/WithChildrenPreviewContainer'

const ComponentPreview: React.FC<{
  componentName: string
}> = ({ componentName, ...forwardedProps }) => {
  const component = useComponentBy(componentName)
  if (!component) {
    console.error(`ComponentPreview unavailable for component ${componentName}`)
  }

  const type = (component && component.type) || null

  switch (type) {
    // Simple components
    case 'Image':
    case 'Text':
    case 'Link':
    case 'TabPanel':
    case 'Tab':
      return (
        <PreviewContainer
          component={component}
          type={Chakra[type]}
          {...forwardedProps}
          isBoxWrapped={false}
        />
      )
    // Components with childrens
    case 'Box':
    case 'Flex':
    case 'Tabs':
    case 'TabList':
    case 'TabPanels':
      return (
        <WithChildrenPreviewContainer
          enableVisualHelper
          component={component}
          type={Chakra[type]}
          {...forwardedProps}
          isBoxWrapped={false}
        />
      )

    // More complex components
    case 'Button':
      return <ButtonPreview component={component} />

    default:
      return null
  }
}

export default memo(ComponentPreview)
