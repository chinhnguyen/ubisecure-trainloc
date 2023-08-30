import axios from 'axios'

const trainInfoQueryUrl = 'https://rata.digitraffic.fi/api/v2/graphql/graphql'
const vrQuery = `
  query {
    currentlyRunningTrains(where: {operator: {shortCode: {equals: "vr"}}}) {
      trainNumber
      departureDate
      trainLocations(where: {speed: {greaterThan: 30}}, orderBy: {timestamp: DESCENDING}, take: 1) {
        speed
        timestamp
        location
      }
    }
  }
`

const targetBaseUrl = 'http://localhost:3001/api/v1/trains'

const feed = async () => {
  try {
    const response = await axios.post(trainInfoQueryUrl, {
      query: vrQuery
    })

    const { currentlyRunningTrains: trains } = response.data.data
    for (const train of trains) {
      const { trainNumber, trainLocations } = train
      if (!trainLocations || trainLocations.longth === 0) continue // Should treat this case as train being removed
      const [longitude, latitude] = trainLocations[0].location
      console.log(trainNumber, longitude, latitude)
      try {
        await axios.put(`${targetBaseUrl}/${trainNumber}/location`, {
          longitude,
          latitude
        })
        console.log('Updated train location', trainNumber)
      } catch (error) {
        console.error('Error updating train location', trainNumber, error)
      }
    }
  } catch (error) {
    console.error('Error executing GraphQL query:', error)
  }
  setTimeout(feed, 1000 * 5)
}

feed()
