import React, { memo } from 'react'

import ButtonPanel from '~components/inspector/panels/components/ButtonPanel'
import ImagePanel from '~components/inspector/panels/components/ImagePanel'
import BoxPanel from '~components/inspector/panels/components/BoxPanel'
import ChildrenControl from '~components/inspector/controls/ChildrenControl'
import LinkPanel from '~components/inspector/panels/components/LinkPanel'
import FlexPanel from '~components/inspector/panels/styles/FlexPanel'
import TabsPanel from '~components/inspector/panels/components/TabsPanel'
import TabPanel from './components/TabPanel'

const Panels: React.FC<{ component: IComponent; isRoot: boolean }> = ({
  component,
  isRoot,
}) => {
  const { type } = component

  if (isRoot) {
    return null
  }

  return (
    <>
      {type === 'Button' && <ButtonPanel />}
      {type === 'Box' && <BoxPanel />}
      {type === 'Image' && <ImagePanel />}
      {type === 'Text' && <ChildrenControl />}
      {type === 'Link' && <LinkPanel />}
      {type === 'Flex' && <FlexPanel />}
      {type === 'Tabs' && <TabsPanel />}
      {type === 'Tab' && <TabPanel />}
    </>
  )
}

export default memo(Panels)
