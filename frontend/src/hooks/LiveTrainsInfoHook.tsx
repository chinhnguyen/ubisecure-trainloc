import { useDispatch, useSelector } from 'react-redux'
import Train from '../models/Train'
import { RootState } from '../store'
import { useCallback, useEffect } from 'react'
import { upsertTrain } from '../store/LiveTrains'

export const useLiveTrainsInfo = (): Train[] => {
  const trains = useSelector<RootState>(
    (state) => state.liveTrains.trains
  ) as Record<string, Train>

  const dispatch = useDispatch()
  const updateTrain = useCallback(
    (train: Train) => {
      dispatch(upsertTrain(train))
    },
    [dispatch]
  )

  useEffect(() => {
    const ws = new WebSocket(process.env.REACT_APP_WS_URL ?? '')
    ws.onopen = () => {
      console.debug('WS', 'connected')
    }
    ws.onclose = () => {
      console.debug('WS', 'closed')
    }
    ws.onmessage = (e) => {
      console.debug('WS', 'messages', e.data)
      const train = JSON.parse(e.data) as Train
      updateTrain({ ...train, updatedAt: new Date().toISOString() })
    }
    ws.onerror = (e) => {
      console.error('WS', 'error', e)
    }
    return () => {
      if (ws?.CONNECTING) ws?.close()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return Object.values(trains)
}
