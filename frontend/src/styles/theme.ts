import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  fonts: {
    body: `'Nimbus Mono PS', 'Courier New', monospace`,
    heading: `'Nimbus Mono PS', 'Courier New', monospace`,
  },
  semanticTokens: {
    colors: {
      "chakra-body-text": {
        _light: "black",
      },
    },
  },
})

export default theme