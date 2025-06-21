import React, { memo, useState, useEffect } from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import { Box, Button, useClipboard } from '@chakra-ui/react'
import { generateCode } from '~utils/code'
import theme from 'prism-react-renderer/themes/nightOwl'
import { useComponents } from '~hooks/useKarmycStore'

const CodePanel = () => {
  const components = useComponents()
  const [code, setCode] = useState<string | undefined>(undefined)

  useEffect(() => {
    const getCode = async () => {
      const code = await generateCode(components)
      setCode(code)
    }

    getCode()
  }, [components])

  const { onCopy, hasCopied } = useClipboard(code!)

  return (
    <Box
      zIndex={5}
      p={4}
      fontSize="sm"
      backgroundColor="#011627"
      overflow="auto"
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
    >
      <Button
        onClick={onCopy}
        size="sm"
        position="absolute"
        textTransform="uppercase"
        colorScheme="teal"
        fontSize="xs"
        height="24px"
        top={4}
        right="1.25em"
      >
        {hasCopied ? 'copied' : 'copy'}
      </Button>
      <Highlight
        {...defaultProps}
        theme={theme}
        code={code || '// Formatting code… please wait ✨'}
        language="jsx"
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => {
              const lineProps = getLineProps({ line, key: i })
              const { key, ...linePropsWithoutKey } = lineProps
              return (
                <div key={key} {...linePropsWithoutKey}>
                  {line.map((token, key) => {
                    const tokenProps = getTokenProps({ token, key })
                    const { key: tokenKey, ...tokenPropsWithoutKey } = tokenProps
                    return (
                      <span key={tokenKey} {...tokenPropsWithoutKey} />
                    )
                  })}
                </div>
              )
            })}
          </pre>
        )}
      </Highlight>
    </Box>
  )
}

export default memo(CodePanel)
