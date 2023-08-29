import { Box } from '@mui/material'
import { useCurrentUser } from '../../hooks/SessionHooks'
import { useEffect } from 'react'

function TrainsView() {
  

  useEffect(() => {
    const ws = new WebSocket('wss://wsapi-staging.kiolyn.com')
    ws.onopen = () => {
      console.log('connected')
    }
    ws.onmessage = (e) => {
      console.log('messages', e)
    }
    ws.onerror = (e) => {}
    return () => {
      ws?.close()
    }
  }, [])

  return <Box className="account">TRAINS VIEW</Box>
}

export default TrainsView
