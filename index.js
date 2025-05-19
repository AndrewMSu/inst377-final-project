const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(__dirname +'/public'));
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = supabaseClient.createClient(supabaseUrl, supabaseKey);

app.get('/', (req, res) => {
    res.sendFile('public/home.html', {root: __dirname});
});

app.get('/FinalProject', async (req, res) => {
    console.log('Getting ResortInfo Data');
    const { data, error } = await supabase.from('ResortInfo').select();

    if(error) {
        console.log(`Error: ${error}`);
        res.statusCode = 400;
        res.send(error);
    }

    res.send(data);
});

app.post('/FinalProject', async (req, res) => {
    console.log('Adding Resort');
    console.log(req.body);

    const resorts = req.body.resort;
    const regions = req.body.region;
    const longitudes = req.body.longitude;
    const latitudes = req.body.latitude;

    const { data, error } = await supabase
    .from('ResortInfo')
    .insert({
        resort: resorts,
        region: regions,
        longitude: longitudes,
        latitude: latitudes
    })
    .select();

    if(error) {
        console.log(`Error: ${error}`);
        res.statusCode = 500;
        res.send(error);
    }

    res.send(data);
});

app.listen(port, () => {
    console.log('App is working on port:', port);
});