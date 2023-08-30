import { Box, Tabs, Tab } from '@mui/material'
import { useLiveTrainsInfo } from '../../hooks/LiveTrainsInfoHook'
import './TrainsView.scss'
import { useState } from 'react'
import TrainsTableView from './TrainsTableView'
import TrainsMapView from './TrainsMapView'

function TrainsView() {
  const trains = useLiveTrainsInfo()

  const [tabIndex, setTabIndex] = useState(0)
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue)
  }
  return (
    <Box className="trainsview">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Table View " />
          <Tab label="Map View" />
        </Tabs>
      </Box>
      <TrainsTableView trains={trains} hidden={tabIndex !== 0} />
      <TrainsMapView trains={trains} hidden={tabIndex !== 1} />
    </Box>
  )
}

export default TrainsView
