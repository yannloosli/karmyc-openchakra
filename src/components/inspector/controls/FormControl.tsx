import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/react'

interface FormControlProps {
  label?: string | React.ReactNode
  children: React.ReactNode
  isInvalid?: boolean
  isRequired?: boolean
  isDisabled?: boolean
}

const FormControl: React.FC<FormControlProps> = ({
  label,
  children,
  isInvalid,
  isRequired,
  isDisabled,
}) => {
  return (
    <Flex mb={4} direction="row" alignItems="center">
      {label && (
        <Text
          as="label"
          fontSize="xs"
          fontWeight="bold"
          color={isInvalid ? 'red.500' : 'gray.700'}
          mb={2}
          mr={2}
          display="block"
        >
          {label}
          {isRequired && <Text as="span" color="red.500" ml={1}>*</Text>}
        </Text>
      )}
      <Box opacity={isDisabled ? 0.6 : 1} pointerEvents={isDisabled ? 'none' : 'auto'}>
        {children}
      </Box>
    </Flex>
  )
}

export default FormControl
