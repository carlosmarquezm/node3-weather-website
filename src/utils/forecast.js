const request = require('request')


const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/871d3e74d9b870a6afe6298fc0f4d4f9/'+ latitude + ',' + longitude + '?units=si'

    request({ url, json: true}, (error, {body}) => {
        if (error) {
            callback('Unable to connect to weather service!', undefined)            
        } else if (body.error) {
            callback('Unable to find location', undefined)
        } else {
            callback(undefined, 'Today! ' + body.daily.data[0].summary + ' It is currently ' + body.currently.temperature + ' degrees out. There is a ' + body.currently.precipProbability  + '% chance of rain and humitidy concentration of ' + body.currently.humidity + '%')               
        }
    })
}
module.exports = forecast

