import React, { useState, useEffect } from 'react'
import { Box, Flex, Stack, Button } from '@chakra-ui/react'
import { CheckCircle } from 'lucide-react'
import { FaBomb } from 'react-icons/fa'
import { gridStyles } from '~components/editor/Editor'
import { useOpenChakraUndoRedo } from '~hooks/useOpenChakraUndoRedo'

type ErrorBoundaryProps = {
  children?: React.ReactNode
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false)
  const { undo } = useOpenChakraUndoRedo()

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Error caught by boundary:', error)
      setHasError(true)
      // Appeler undo pour récupérer l'état précédent
      undo()
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      setHasError(true)
      undo()
    })

    return () => {
      window.removeEventListener('error', handleError)
    }
  }, [undo])

  if (hasError) {
    return (
      <Flex
        {...gridStyles}
        alignItems="center"
        justifyContent="center"
        flex={1}
        position="relative"
      >
        <Stack
          alignItems="center"
          direction="row"
          gap={8}
          bg="white"
          px={6}
          py={6}
          boxShadow="sm"
          width="lg"
        >
          <Box as={FaBomb} fontSize="100px" />
          <Box>
            <b>Oups…</b>
            <br />
            Something went wrong! We have recovered the editor to its previous
            version.
            <Button
              onClick={() => {
                setHasError(false)
              }}
              variant="outline"
              size="sm"
              mt={4}
              display="block"
            >
              <CheckCircle style={{ marginRight: '4px' }} />
              Reload
            </Button>
          </Box>
        </Stack>
      </Flex>
    )
  }

  return <>{children}</>
}

export default ErrorBoundary
