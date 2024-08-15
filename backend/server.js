const express = require('express')
const app = express()
const axios = require('axios')
const cors = require('cors')
const fs = require('fs')
const path = require('path')
const API_KEY = 'apikey julia.fok86:519a817962e7902cb2eb2e81ec6a727d'
const CLIENT_ID = 'vrfAdDaa1nieRhL7b45lT3bKpYxgD5sUooEw3iA'
const filePath = path.join(__dirname, 'public', `${Date.now()}.json`) //set path to public folder to strote JSON files

app.use(express.json())
app.use(cors())

app.get('/api/image', async (req, res) => {
    let data = JSON.stringify({
        "file_url": "https://i.ibb.co/HLZxyHB/20240811-185101-Medium.jpg"
      });
      
    let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.veryfi.com/api/v8/partner/documents',
    headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json', 
        'CLIENT-ID': CLIENT_ID, 
        'AUTHORIZATION': API_KEY, 
    },
    data : data
    };

    let receiptData;

    try {
        //sending IMG to Veryfi API and getting data from API
        const response = await axios(config)
        receiptData = response.data    
        
        //if no data return 404
        if(!receiptData) return res.status(400).send('No data received')

        //write data from Veryfi API into a file
        fs.writeFile(filePath, JSON.stringify(receiptData, null, 2), 'utf8',(err) => {
            if (err) return res.status(500).send({message: 'Error writing file', details: err})
            res.send('File written successfully')
        })
        
    } 
    catch(err) {
        console.log(err)
        res.status(500).send('Error fetching data from api')
    }  
})

app.get('/file/data', (req, res) => {
    fs.readFile('/Users/juliafok/Documents/receipt-scanner/backend/public/1723602368300.json', 'utf8', (err, data) => {
        if (err) {
            console.log('Error reading file', err)
            return res.status(500).send({message: 'Server error', details: err});
        }
        res.json(data)
    })
})

app.listen('8001', () => {
    console.log('Server is running on 8001')
})