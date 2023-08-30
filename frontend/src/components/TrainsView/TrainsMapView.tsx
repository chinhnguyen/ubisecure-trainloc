import { CircularProgress, Alert, Box } from '@mui/material'
import Train from '../../models/Train'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import './TrainsMapView.scss'
import throttle from 'lodash/throttle'
import { set } from 'lodash'

interface TrainsMapViewProps {
  trains: Train[]
  hidden?: boolean
}

function GoogleMap({ trains, hidden }: TrainsMapViewProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [refVisible, setRefVisible] = useState(false)
  const center = { lat: 62.2426, lng: 25.7473 }
  const zoom = 6

  const map = useMemo(() => {
    if (!refVisible) return
    return new google.maps.Map(ref.current as HTMLDivElement, {
      center,
      zoom
    })
  }, [refVisible]) // eslint-disable-line react-hooks/exhaustive-deps

  const [markers, setMarkers] = useState<google.maps.Marker[]>([])

  const updateMarkers = throttle((map: google.maps.Map, trains: Train[]) => {
    const newMarkers = []
    for (const [index, train] of trains.entries()) {
      const marker =
        markers[index] ??
        new google.maps.Marker({
          label: {
            text: '\ue530', // codepoint from https://fonts.google.com/icons
            fontFamily: 'Material Icons',
            color: '#ffffff',
            fontSize: '18px'
          }
        })
      marker.setPosition({ lat: train.latitude, lng: train.longitude })
      marker.setTitle(train.trainNumber)
      marker.setMap(map)
      newMarkers.push(marker)
      setMarkers(newMarkers)
    }
  }, 5000)

  useEffect(() => {
    if (map === null) return
    updateMarkers(map as google.maps.Map, trains)
  }, [map, trains]) // eslint-disable-line react-hooks/exhaustive-deps

  // Remove markers when component is unmounted
  useEffect(() => {
    return () => {
      markers.map((marker) => marker.setMap(null))
      setMarkers([])
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      hidden={hidden}
      ref={(el) => {
        ref.current = el
        setRefVisible(el !== null)
      }}
      id="map"
    />
  )
}

function TrainsMapView({ trains, hidden }: TrainsMapViewProps) {
  const render = (status: Status): ReactElement => {
    switch (status) {
      case Status.LOADING:
        return <CircularProgress hidden={hidden} />
      case Status.FAILURE:
        return (
          <Alert hidden={hidden} severity="error">
            There was error loading maps view. Please try to reload the page.
          </Alert>
        )
      case Status.SUCCESS:
        return <GoogleMap trains={trains} hidden={hidden} />
    }
  }

  return (
    <Box className="trainsmap">
      <Wrapper
        apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY ?? ''}
        render={render}
      />
    </Box>
  )
}

export default TrainsMapView
