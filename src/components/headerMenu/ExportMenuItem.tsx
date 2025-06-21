import { useComponents } from '~hooks/useKarmycStore'
import { usePersistState, useFullState } from '~hooks/useKarmycStore'
import { generateCode } from '~utils/code'
import { buildParameters } from '~utils/codesandbox'
import { Box, Button, VStack, Separator } from '@chakra-ui/react'
import { Download, ExternalLink, Save, Upload, Trash2 } from 'lucide-react'
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
    <VStack align="stretch" gap={1}>
      <Button
        onClick={handleExportCode}
        disabled={isLoading}
        variant="ghost"
        size="sm"
        justifyContent="flex-start"
        h="auto"
        py={2}
        display={'flex'}
        flexDirection={'row'}
      >
        <Download size={16} style={{ marginRight: '8px' }} />
        Export Code
      </Button>
      <Button
        onClick={handleExportToCodeSandbox}
        disabled={isLoading}
        variant="ghost"
        size="sm"
        justifyContent="flex-start"
        h="auto"
        py={2}
      >
        <ExternalLink size={16} style={{ marginRight: '8px' }} />
        Export to CodeSandbox
      </Button>
      
      <Separator />
      
      <Button
        onClick={handleSaveToSpace}
        variant="ghost"
        size="sm"
        justifyContent="flex-start"
        h="auto"
        py={2}
      >
        <Save size={16} style={{ marginRight: '8px' }} />
        Save to Space
      </Button>
      <Button
        onClick={handleLoadFromSpace}
        variant="ghost"
        size="sm"
        justifyContent="flex-start"
        h="auto"
        py={2}
      >
        <Upload size={16} style={{ marginRight: '8px' }} />
        Load from Space
      </Button>
      <Button
        onClick={handleClearStorage}
        variant="ghost"
        size="sm"
        justifyContent="flex-start"
        h="auto"
        py={2}
        color="red.500"
        _hover={{ bg: 'red.50' }}
      >
        <Trash2 size={16} style={{ marginRight: '8px' }} />
        Clear Storage
      </Button>
    </VStack>
  )
}

export default ExportMenuItem
