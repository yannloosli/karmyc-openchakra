'use client'

import React, { Component } from 'react'
import { Box, Flex, Stack, Button } from '@chakra-ui/react'
import { CheckCircle } from 'lucide-react'
import { FaBomb } from 'react-icons/fa'
import { gridStyles } from '~components/editor/Editor'

type ErrorBoundaryState = {
  hasError: boolean
}

type ErrorBoundaryProps = { children?: React.ReactNode }

export default class AppErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state = { hasError: false }

  static getDerivedStateFromError(error: any) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <Flex
          {...gridStyles}
          p={0}
          alignItems="center"
          justifyContent="center"
          flex={1}
          position="relative"
          height="100vh"
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
              Something went wrong! Clear cache and refresh.
              <Button
                onClick={() => {
                  localStorage.clear()
                  window.location.reload()
                }}
                variant="outline"
                size="sm"
                mt={4}
                display="block"
              >
                <CheckCircle style={{ marginRight: '4px' }} />
                Clear & reload
              </Button>
            </Box>
          </Stack>
        </Flex>
      )
    }
    return this.props.children
  }
}
