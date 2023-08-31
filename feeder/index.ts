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
  'eyJraWQiOiJTeUN1YWpIVkZhTFRVaGZGUVpQdzRBNnNXUHhtYmlITWNZWW1DbmRJaE9jPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiI4OWZjY2FkMS03MDE2LTQ0NjctOTEzMy1jMjZjNmIxNzRiYmMiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5ldS13ZXN0LTEuYW1hem9uYXdzLmNvbVwvZXUtd2VzdC0xXzhoUmpFdVg2TSIsImNvZ25pdG86dXNlcm5hbWUiOiJjaGluaG5ndXllbiIsImdpdmVuX25hbWUiOiJDaGluaCIsIm9yaWdpbl9qdGkiOiIyNmM5MjQ0OC03M2EyLTQwMzMtOTJlMC00OWNhY2Q4ODBhYTciLCJhdWQiOiI0ZjdvanEwcDA0b3Uwa2lpbGNzbzloZmI2YiIsImV2ZW50X2lkIjoiMjg5NThmZWEtZmM1NS00MjZmLWExNTEtNzY4OWVhZDdiYjQxIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2OTM0ODM0OTUsImV4cCI6MTY5MzQ4NzA5NSwiY3VzdG9tOnBlcm1pc3Npb25zIjoiW1wiUFVUX1RSQUlOX0xPQ0FUSU9OXCJdIiwiaWF0IjoxNjkzNDgzNDk1LCJmYW1pbHlfbmFtZSI6Ik5ndXllbiIsImp0aSI6IjZmNmVlYTA4LWFhYzgtNGM4Yy05YzRmLTgwMmM2OGQyOTMwZCIsImVtYWlsIjoiY2hpbmhAd2lsbGJlLnZuIn0.YA5P_h4L1o-0SmbhT7xoWSwOhNU_qHP9B-Cvch3hcjCPaU1mRk191b4cIY_qRQFHTg5rJ33V4BFUPylrEoRu71ck1SGgiGXunVKXYXCi3YdsMNmtaZ2XVjPx4foXhAODZ1lSiilkm4tjlJbjcFSb_TtqEsXAQYRla_RaQsfbSrYs6G7eJW4D_HOq8DK9qNElQ6QdSSsPirlw7gKno9Soh0uCf_aOZN-ap9eoWEcpMlLd-nemSvsXPh-u8f1Y2w00qPDun2l2E3VeW89RYaYTKgLne20VuoNXQWoOThwiuraNXWybtDSSlfziQwWHiuckdxXCls-FVi6GG-rhHEaZLg'

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
