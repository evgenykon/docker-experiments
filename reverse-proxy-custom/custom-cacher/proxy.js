const express = require('express')
const fs = require('node:fs');
const needle = require('needle');
const path = require('path');

const app = express()
const port = process.env.PROXY_PORT ?? 8000
const target = process.env.TARGET_HOST ?? 'localhost'
const cacheDir = path.join(__dirname, process.env.CACHE_DIR ?? 'static')

const fetchSourcePage = (url, fileName) => {
    return new Promise((resolve, reject) => {
        needle.get(url, {
            open_timeout: 5000,
            response_timeout: 5000,
            read_timeout: 5000,
            compressed: false,
            follow_max: 1,
            parse_response: false,
        }, function(error, response) {
            console.log('Proxy request: GET ', url, response.statusCode);
            if (!error && response.statusCode === 200) {
                console.log('Store to cache:', url, '-->', `${cacheDir}/${fileName}`);
                try {
                    fs.writeFileSync(`${cacheDir}/${fileName}`, response.body);
                } catch (err) {
                    console.error('Proxy request storing error:', response.statusCode, url);
                    reject({message: 'Caching error',  statusCode: 500});
                    return;
                }
                resolve(response.body);
                return;
            }
            console.error('Proxy request error:', url, response.statusCode);
            reject({message: 'Caching error',  statusCode: response.statusCode});
        });
    });
}

app.get('/_generate_index', async (req, res) => {
    console.log('-- Start page generator ---');
    try {
        await fetchSourcePage(`https://${target}/`, 'index.html');
        await fetchSourcePage(`https://${target}/404`, '404.html');
    } catch (err) {
        console.error('Generating index error:', err);
    }

    const dirFiles = fs.readdirSync(cacheDir);
    dirFiles.forEach((fileName) => {
        if (fileName === 'index.html' || fileName === '404.html') {
            return;
        }
        console.log('Drop cache file', `${cacheDir}/${fileName}`);
        fs.unlinkSync(`${cacheDir}/${fileName}`);

    })
    res.send({success:true})
})

app.get('/*', async(req, res, next) => {
    let pageSource = '';
    const page = req.url.replace("\.html", '')
        .replace('/','')
        .replace(/([^a-z0-9\-_#]+)/gi, '_');

    try {
        const status = checkCache(page);
        if (status === true) {
            console.log(`GET /${page} - cached - 200 OK`);
            res.sendFile(`${page}.html`, {root: cacheDir})
            return;
        }

        if (status === false) { // cache miss
            console.log(`GET /${page} - cached - 404 Page Not Found`);
            next({message:'Page not found', statusCode: 404})
            return;
        }

        await fetchSourcePage(`https://${target}/${page}`, `${page}.html`);

    } catch (errData) {
        console.error('Generating source error:', errData);
        if (errData.statusCode === 404) {
            setCacheMiss(page);
        }
        next(errData)
    }
})

const checkCache = (page) => {
    if (fs.existsSync(`404-${cacheDir}/${page}.tmp`)) {
        return false;
    }
    if (fs.existsSync(`${cacheDir}/${page}.html`)) {
        return true;
    }
    return null;
}

const setCacheMiss = (page) => {
    fs.writeFileSync(`404-${cacheDir}/${page}.tmp`, '');
}

const errorHandler = (err, req, res, next) => {
    console.log('-- Error handler ---', err);
    const errStatus = err.statusCode || 500;
    let errorPage = err.message || 'Something went wrong';
    const errorPagePath = `${cacheDir}/${errStatus}.html`;
    if (err.statusCode && fs.existsSync(errorPagePath)) {
        console.log('Response cached template for error code', errorPagePath, errorPage);
        res.sendFile(`404.html`, {root: cacheDir})
        return
    }
    res.status(errStatus).send(err);
}
app.use(errorHandler)


app.listen(port, () => {
    console.log(`Caching proxy for ${target} started as http://cacher:${port}`)
})