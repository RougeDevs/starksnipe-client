import { Box,Button,Text } from '@chakra-ui/react'
import React from 'react'

const SwapInterface = () => {
  return (
    <Box mt="3rem" padding="1rem">
        <Box display="flex" flexDirection="column" padding="1rem" borderRadius="6px" width="100%">
            <Text>
                Swap
            </Text>
            <Box display="flex" flexDir="column" width="100%" mt="0.5rem" gap="0.5rem">
                <Box display="flex" flexDir="column" gap="0.5rem" bg="grey" borderRadius="6px" padding="1rem">
                    1sthahsas
                </Box>
                <Button>
                    Button
                </Button>
                <Box bg="grey" borderRadius="6px" padding="1rem" display="flex" flexDir="column" gap="0.5rem">
                    2nd
                </Box>
            </Box>
        </Box>
    </Box>
  )
}

export default SwapInterface