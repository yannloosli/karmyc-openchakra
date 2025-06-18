import React, { memo } from 'react'
import { useSelector } from 'react-redux'

import * as Chakra from '@chakra-ui/react'
import { getComponentBy } from '~core/selectors/components'
import ButtonPreview from '~components/editor/previews/ButtonPreview'
import PreviewContainer from '~components/editor/PreviewContainer'
import WithChildrenPreviewContainer from '~components/editor/WithChildrenPreviewContainer'

const ComponentPreview: React.FC<{
  componentName: string
}> = ({ componentName, ...forwardedProps }) => {
  const component = useSelector(getComponentBy(componentName))
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
