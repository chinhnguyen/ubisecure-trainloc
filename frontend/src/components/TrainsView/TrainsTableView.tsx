import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@mui/material'
import Train from '../../models/Train'

interface TrainsTableViewProps {
  trains: Train[]
  hidden?: boolean
}

function TrainsTableView({ trains, hidden }: TrainsTableViewProps) {
  return (
    <TableContainer component={Paper} hidden={hidden}>
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
            <TableRow key={train.trainNumber}>
              <TableCell>{train.trainNumber}</TableCell>
              <TableCell align="right">{train.latitude}</TableCell>
              <TableCell align="right">{train.longitude}</TableCell>
              <TableCell align="right">{train.updatedAt}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default TrainsTableView
