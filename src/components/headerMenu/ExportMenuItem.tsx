import { useComponents } from '~hooks/useKarmycStore'
import { usePersistState, useFullState } from '~hooks/useKarmycStore'
import { generateCode } from '~utils/code'
import { buildParameters } from '~utils/codesandbox'
import { Box, Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { ChevronDownIcon } from '@chakra-ui/icons'
import { useState } from 'react'

const ExportMenuItem = () => {
  const components = useComponents()
  const { saveToSpace, loadFromSpace } = usePersistState()
  const fullState = useFullState()
  const [isLoading, setIsLoading] = useState(false)

  const handleExportCode = async () => {
    setIsLoading(true)
    try {
      const code = await generateCode(components)
      const blob = new Blob([code], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'components.tsx'
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erreur lors de l\'export:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportToCodeSandbox = async () => {
    setIsLoading(true)
    try {
      const code = await generateCode(components)
      const parameters = buildParameters(code, false)
      const url = `https://codesandbox.io/api/v1/sandboxes/create?parameters=${parameters}`
      window.open(url, '_blank')
    } catch (error) {
      console.error('Erreur lors de l\'export vers CodeSandbox:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveToSpace = () => {
    const spaceData = saveToSpace()
    console.log('État sauvegardé dans le space:', spaceData)
    // Ici vous pouvez intégrer avec le système de spaces de Karmyc
    // Par exemple, utiliser useKarmycStore.getState().saveSpace()
  }

  const handleLoadFromSpace = () => {
    // Exemple de chargement depuis un space
    // Dans un vrai cas d'usage, vous récupéreriez les données depuis Karmyc
    const savedState = localStorage.getItem('openchakra-editor-state')
    if (savedState) {
      const spaceData = JSON.parse(savedState)
      loadFromSpace(spaceData)
    }
  }

  const handleClearStorage = () => {
    localStorage.removeItem('openchakra-editor-state')
    window.location.reload()
  }

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />} isLoading={isLoading}>
        Export
      </MenuButton>
      <MenuList>
        <MenuItem onClick={handleExportCode}>Export Code</MenuItem>
        <MenuItem onClick={handleExportToCodeSandbox}>Export to CodeSandbox</MenuItem>
        <Box borderTop="1px solid" borderColor="gray.200" my={2} />
        <MenuItem onClick={handleSaveToSpace}>Save to Space</MenuItem>
        <MenuItem onClick={handleLoadFromSpace}>Load from Space</MenuItem>
        <MenuItem onClick={handleClearStorage} color="red.500">
          Clear Storage
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default ExportMenuItem
