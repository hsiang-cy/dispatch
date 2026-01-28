type Locationff = {
    lat: number,
    lng: number
}
type Origins = {
    waypoint: {
        location: {
            latLng: {
                latitude: number,
                longitude: number
            }
        }
    }
}
const origins = (locations: Locationff[]) => {
    const result: object[] = []
    locations.forEach((i) => {
        result.push({
            waypoint: {
                location: {
                    latLng: {
                        latitude: i.lat,
                        longitude: i.lng
                    }
                }
            }
        })
    })
    return result
}
const test = origins([{lat:20, lng:30},{lat:20, lng:55}])
console.log(JSON.stringify(test));
