const express = require('express')
const fs = require('node:fs');
const needle = require('needle');

const app = express()
const port = process.env.PROXY_PORT ?? 8000
const target = process.env.TARGET_HOST ?? 'localhost'

const fetchSourcePage = (url, fileName) => {
    return new Promise((resolve, reject) => {
        console.log('fetchSourcePage: ', url, fileName);
        needle.get(url, {
            open_timeout: 5000,
            response_timeout: 5000,
            read_timeout: 5000,
            compressed: false,
            follow_max: 1,
            parse_response: false,
        }, function(error, response) {
            if (!error && response.statusCode === 200) {
                try {
                    fs.writeFileSync(`./static/${fileName}`, response.body);
                } catch (err) {
                    reject(err);
                    return;
                }
                resolve(response.body);
                return;
            }
            console.error('fetchSourcePage error:', error, response.statusCode);
            reject(error);
        });
    });
}

app.get('/_generate_index', async (req, res) => {
    console.log('Generating index: fetching source');
    let pageSource = '';
    try {
        pageSource = await fetchSourcePage(`https://${target}/`, 'index.html');
        pageSource = await fetchSourcePage(`https://${target}/404`, '404.html');
    } catch (err) {
        console.error('Generating index error:', e);
    }

    const dirFiles = fs.readdirSync('./static/');
    console.log('Generating index: result files', dirFiles);
    res.send('Index pages generated')
})

app.get('/*', async(req, res) => {
    let pageSource = '';
    const page = req.url.replace("\.html", '')
        .replace('/','')
        .replace(/([^a-z0-9\-_#]+)/gi, '_');
    console.log('Generating source: fetch page', page);
    try {
        pageSource = await fetchSourcePage(`https://${target}/${page}`, `${page}.html`);
    } catch (err) {
        console.error('Generating source error:', err);
    }
    res.send(pageSource ?? '')
})

app.listen(port, () => {
    console.log(`Caching proxy for ${target} started as http://cacher:${port}`)
})