const path = require('path')
const express = require('express')
const aws = require('aws-sdk')
const hbs = require('hbs')
const sharp = require('sharp')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()

const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
app.engine('html', require('ejs').renderFile)

const S3_BUCKET = process.env.S3_BUCKET

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('/account', (req, res) => res.render('account.html'))

app.get('/sign-s3', (req, res) => {
    const s3 = new aws.S3();
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      Expires: 60,
      ContentType: fileType,
      ACL: 'public-read'
    };
  
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if(err){
        console.log(err);
        return res.end();
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
      };
      res.write(JSON.stringify(returnData));
      res.end();
    });
  });
  
  /*
   * Respond to POST requests to /submit_form.
   * This function needs to be completed to handle the information in
   * a way that suits your application.
   */
  app.post('/save-details', (req, res) => {
    
    var params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Body: "Hello"
    };

    s3.putObject(s3params, function (err, data) {
        if (err) {
            console.log("Error uploading data: ", err);
        } else {
            console.log("Successfully uploaded data to myBucket/myKey");
        }
    });
});

app.get('', (req, res) =>{
    res.render('index', {
        title: 'Weather app',
        name: 'Carlos Marquez'
    })
})

app.get('/about', (req, res) =>{
    res.render('about', {
        title: 'About me',
        name: 'Carlos Marquez'
    })
})

app.get('/help', (req, res) =>{
    res.render('help', {
        title: 'Help page',
        message: 'This is a message of hope',
        name: 'Carlos Marquez'
    })
})


app.get('/weather', (req, res) =>{
    const address = req.query.address

    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    } else {
        geocode(address, (error, {latitude, longitude, location} = {}) => {
            if (error) {
                return res.send({error})
            }

            forecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send(error)
                }
                res.send({
                    location,
                    forecast: forecastData,
                    address
                })
            })
        })
    }
})


app.get('/products', (req, res) =>{
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }

    console.log(req.query.search)
    res.send({
        products: []
    })
})


app.get('/help/*',(req, res) =>{
    res.render('404', {
        title: '404',
        errormessage: 'Help article not found',
        name: 'Carlos Marquez'
    })
})

app.get('*', (req, res) =>{
    res.render('404', {
        title: '404',
        errormessage: 'Page not found',
        name: 'Carlos Marquez'
    })
})


app.listen(port, () =>{
    console.log('Server is up on port ' + port)
})


