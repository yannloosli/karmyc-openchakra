import Composer from './composer'

type ComposedComponent = {
  components: IComponents
  root: string
  parent: string
}

export const buildTabs = (parent: string): ComposedComponent => {
  const composer = new Composer('Tabs')

  const nodeId = composer.addNode({ type: 'Tabs', parent })
  const tabListId = composer.addNode({ type: 'TabList', parent: nodeId })
  const tabPanelsId = composer.addNode({ type: 'TabPanels', parent: nodeId })

  composer.addNode({
    type: 'Tab',
    parent: tabListId,
    props: { children: 'One' },
  })
  composer.addNode({
    type: 'Tab',
    parent: tabListId,
    props: { children: 'Two' },
  })

  composer.addNode({
    type: 'TabPanel',
    parent: tabPanelsId,
    props: { children: 'One !' },
  })
  composer.addNode({
    type: 'TabPanel',
    parent: tabPanelsId,
    props: { children: 'Two !' },
  })

  const components = composer.getComponents()

  return {
    components,
    root: nodeId,
    parent,
  }
}

type BuilderFn = (parent: string) => ComposedComponent

type ComposerBuilders = {
  [k: string]: BuilderFn
}

const builders: ComposerBuilders = {
  TabsMeta: buildTabs,
  // other meta
}

export default builders
