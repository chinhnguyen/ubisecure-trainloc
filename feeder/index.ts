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
const token =
  'eyJraWQiOiJTeUN1YWpIVkZhTFRVaGZGUVpQdzRBNnNXUHhtYmlITWNZWW1DbmRJaE9jPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4OWZjY2FkMS03MDE2LTQ0NjctOTEzMy1jMjZjNmIxNzRiYmMiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLmV1LXdlc3QtMS5hbWF6b25hd3MuY29tXC9ldS13ZXN0LTFfOGhSakV1WDZNIiwiY29nbml0bzp1c2VybmFtZSI6ImNoaW5obmd1eWVuIiwiZ2l2ZW5fbmFtZSI6IkNoaW5oIiwib3JpZ2luX2p0aSI6ImQ1YjIzZjIxLTNiYzQtNDMwMy05YmM1LWRhMGYxNGMzZDcyMCIsImF1ZCI6IjRmN29qcTBwMDRvdTBraWlsY3NvOWhmYjZiIiwiZXZlbnRfaWQiOiJmZWUyNDBlNC0yNzdhLTQxZDctOTM0ZC01MzNiNjQxZDM5NjciLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY5MzUwOTM2MCwiZXhwIjoxNjkzNTU2NjQwLCJjdXN0b206cGVybWlzc2lvbnMiOiJbXCJQVVRfVFJBSU5fTE9DQVRJT05cIl0iLCJpYXQiOjE2OTM1NTMwNDAsImZhbWlseV9uYW1lIjoiTmd1eWVuIiwianRpIjoiOWMwMjllOWYtYTUxYy00MmJhLThjNDAtYzQxZDI5OTQ0NGViIiwiZW1haWwiOiJjaGluaC5uZ3V5ZW5Ad2lsbGJlLnZuIn0.ImACGPx0mS32g_hlQPilxhULfchoDZxXstkHQfD3KY3d612_EIrRL6T7i12pYC1_ShwNSck0aPibc89L-InGp-wpCIuNCJbdYrelPMKvvG8ut7jOjifeMQ4lKnjPttoqzs2x5KNIsOsSHTDJx04r0rS_Q7N0ehn7JeTV_P21fcPxm4GGzbw7vzfNKJtAIcRzuGO7HRECUztUSuzqvPNOWJ6gvgl5A8-9SjcIgvFgzh0TUn87OWyevufY9-li_0PGJVX4jbqZxNNx9Rgxnt-k_9Q62wiFGalH52qC7FSN9tzgzBRGphKAJ8X38vIv8Bgh8-ddLLbC1Ebq3wcaSVUO3Q'

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
        const url = `${targetBaseUrl}/${trainNumber}/location`
        const data = {
          longitude,
          latitude
        }
        await axios.put(url, data, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        console.log('Updated train location', trainNumber)
      } catch (error) {
        console.error('Error updating train location', trainNumber, error)
      }
    }
  } catch (error) {
    console.error('Error executing GraphQL query:', error)
  }
  setTimeout(feed, 1000 * 10)
}

feed()
