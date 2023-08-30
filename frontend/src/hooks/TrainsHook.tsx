import { useDispatch, useSelector } from 'react-redux'
import Train from '../models/Train'
import { RootState } from '../store'
import { useCallback, useEffect, useMemo } from 'react'
import { upsertTrain } from '../store/Trains'

export const useLiveTrainsInfo = (): Train[] => {
  const trains = useSelector<RootState>(
    (state) => state.trains.trains
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
    ws.onmessage = (e) => {
      console.debug('WS', 'messages', e.data)
      const train = JSON.parse(e.data) as Train
      updateTrain({ ...train, updatedAt: new Date().toISOString() })
    }
    ws.onerror = (e) => {
      console.error('WS', 'error', e)
    }
    return () => {
      ws?.close()
    }
  }, [])

  return Object.values(trains)
}
