import React, { useState, useEffect } from 'react'
import { Box, Flex, Stack, Button } from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { FaBomb } from 'react-icons/fa'
import { gridStyles } from '~components/editor/Editor'
import { useKarmycDispatch } from '~hooks/useKarmycStore'

type ErrorBoundaryProps = {
  children?: React.ReactNode
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const [hasError, setHasError] = useState(false)
  const dispatch = useKarmycDispatch()

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Error caught by boundary:', error)
      setHasError(true)
      // Appeler undo pour récupérer l'état précédent
      dispatch.undo()
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      setHasError(true)
      dispatch.undo()
    })

    return () => {
      window.removeEventListener('error', handleError)
    }
  }, [dispatch])

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
          spacing={8}
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
              rightIcon={<CheckCircleIcon path="" />}
              size="sm"
              mt={4}
              display="block"
            >
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
