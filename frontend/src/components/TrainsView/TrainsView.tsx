import {
  Box,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material'
import { useLiveTrainsInfo } from '../../hooks/TrainsHook'
import './TrainsView.scss'

function TrainsView() {
  const trains = useLiveTrainsInfo()
  return (
    <Box className="trainsview">
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {train.trainNumber}
                </TableCell>
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
