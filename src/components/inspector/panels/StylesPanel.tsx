import React, { memo, useMemo } from 'react'
import { Accordion } from '@chakra-ui/react'
import PaddingPanel from '~components/inspector/panels/styles/PaddingPanel'
import DimensionPanel from '~components/inspector/panels/styles/DimensionPanel'
import BorderPanel from '~components/inspector/panels/styles/BorderPanel'
import DisplayPanel from '~components/inspector/panels/styles/DisplayPanel'
import TextPanel from '~components/inspector/panels/styles/TextPanel'
import AccordionContainer from '~components/inspector/AccordionContainer'
import ColorsControl from '~components/inspector/controls/ColorsControl'
import GradientControl from '~components/inspector/controls/GradientControl'
import EffectsPanel from './styles/EffectsPanel'
import ChildrenInspector from '~components/inspector/ChildrenInspector'
import ParentInspector from '~components/inspector/ParentInspector'
import CustomPropsPanel from './CustomPropsPanel'

interface Props {
  isRoot: boolean
  showChildren: boolean
  parentIsRoot: boolean
}

const StylesPanel: React.FC<Props> = ({
  isRoot,
  showChildren,
  parentIsRoot,
}) => {
  // Mémoriser le composant CustomPropsPanel pour éviter les re-rendus inutiles
  const customPropsPanel = useMemo(() => {
    if (isRoot) return null
    return (
      <AccordionContainer title="Custom props" value="custom-props">
        <CustomPropsPanel />
      </AccordionContainer>
    )
  }, [isRoot])

  return (
    <Accordion.Root defaultValue={["custom-props"]} multiple>
      {customPropsPanel}

      {!isRoot && !parentIsRoot && (
        <AccordionContainer title="Parent" value="parent">
          <ParentInspector />
        </AccordionContainer>
      )}

      {showChildren && (
        <AccordionContainer title="Children" value="children">
          <ChildrenInspector />
        </AccordionContainer>
      )}

      {!isRoot && (
        <>
          <AccordionContainer title="Layout" value="layout">
            <DisplayPanel />
          </AccordionContainer>
          <AccordionContainer title="Spacing" value="spacing">
            <PaddingPanel type="margin" />
            <PaddingPanel type="padding" />
          </AccordionContainer>
          <AccordionContainer title="Size" value="size">
            <DimensionPanel />
          </AccordionContainer>
          <AccordionContainer title="Typography" value="typography">
            <TextPanel />
          </AccordionContainer>
        </>
      )}

      <AccordionContainer title="Backgrounds" value="backgrounds">
        <ColorsControl
          withFullColor
          label="Color"
          name="backgroundColor"
          enableHues
        />
        {!isRoot && (
          <GradientControl
            withFullColor
            label="Gradient"
            name="bgGradient"
            options={[
              'to-t',
              'to-tr',
              'to-tl',
              'to-b',
              'to-br',
              'to-bl',
              'to-r',
              'to-l',
            ]}
            enableHues
          />
        )}
      </AccordionContainer>

      {!isRoot && (
        <>
          <AccordionContainer title="Border" value="border">
            <BorderPanel />
          </AccordionContainer>

          <AccordionContainer title="Effect" value="effect">
            <EffectsPanel />
          </AccordionContainer>
        </>
      )}
    </Accordion.Root>
  )
}

export default memo(StylesPanel)
