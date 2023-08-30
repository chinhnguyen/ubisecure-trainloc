import { CircularProgress, Alert, Box } from '@mui/material'
import Train from '../../models/Train'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import { ReactElement, useEffect, useMemo, useRef, useState } from 'react'
import './TrainsMapView.scss'

interface TrainsMapViewProps {
  trains: Train[]
  hidden?: boolean
}

function GoogleMap({ trains, hidden }: TrainsMapViewProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [refVisible, setRefVisible] = useState(false)
  const center = { lat: -34.397, lng: 150.644 }
  const zoom = 14

  const map = useMemo(() => {
    if (!refVisible) return
    return new google.maps.Map(ref.current as HTMLDivElement, {
      center,
      zoom
    })
  }, [refVisible]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (map === null) return
    const markers = trains.map(
      (train) =>
        new google.maps.Marker({
          position: { lat: train.latitude, lng: train.longitude },
          map
        })
    )
    return () => {
      markers.forEach((marker) => marker.setMap(null))
    }
  }, [map, trains])

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

function TrainsMapView(props: TrainsMapViewProps) {
  const render = (status: Status): ReactElement => {
    switch (status) {
      case Status.LOADING:
        return <CircularProgress />
      case Status.FAILURE:
        return (
          <Alert severity="error">This is an error alert — check it out!</Alert>
        )
      case Status.SUCCESS:
        return <GoogleMap {...props} />
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
