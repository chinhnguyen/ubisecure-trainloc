import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tabs,
  Tab
} from '@mui/material'
import { useLiveTrainsInfo } from '../../hooks/TrainsHook'
import './TrainsView.scss'
import { useState } from 'react'

function TrainsView() {
  const trains = useLiveTrainsInfo()

  const [tabIndex, setTabIndex] = useState(0)
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue)
  }
  return (
    <Box className="trainsview">
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="Table View" />
        <Tab label="Map View" />
      </Tabs>
      <TableContainer component={Paper} hidden={tabIndex != 0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Train number</TableCell>
              <TableCell align="right">Latitude</TableCell>
              <TableCell align="right">Longitude</TableCell>
              <TableCell align="right">Last Update</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trains.map((train) => (
              <TableRow
                key={train.trainNumber}
                
              >
                <TableCell>{train.trainNumber}</TableCell>
                <TableCell align="right">{train.latitude}</TableCell>
                <TableCell align="right">{train.longitude}</TableCell>
                <TableCell align="right">{train.updatedAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default TrainsView
