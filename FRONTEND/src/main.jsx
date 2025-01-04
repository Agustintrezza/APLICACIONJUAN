// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import './index.css'
import App from './App.jsx'

// Define el tema personalizado
const customTheme = extendTheme({
  colors: {
    brand: {
      100: '#f7fafc',
      900: '#1a202c',
    },
  },
})

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <ChakraProvider theme={customTheme}>
      <App />
    </ChakraProvider>
  // </StrictMode>,
)
