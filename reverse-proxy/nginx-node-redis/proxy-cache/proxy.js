import express from 'express'
import {cacheSet, cacheGet} from './redis-client.js';
import proxyClient from "./proxy-client.js";


const app = express()
const port = process.env.PROXY_PORT ?? 8000
const target = process.env.TARGET_HOST ?? 'target-host'
const baseHost = process.env.BASE_HOST ?? 'localhost'
const bypassPages = ['/robots.txt', '/sitemap.xml',];
const postProcessPages = ['robots_txt', 'sitemap_xml',];

app.get('/_warm_cache', async (req, res) => {
    console.log('-- Start warming cache ---');

    try {
        await fetchSourcePage(`https://${target}/`, clearPageName('/'));
        await fetchSourcePage(`https://${target}/404`, clearPageName('/404'));
        await fetchSourcePage(`https://${target}/robots.txt`, clearPageName('/robots.txt'));
        await fetchSourcePage(`https://${target}/sitemap.xml`, clearPageName('/sitemap.xml'));
    } catch (err) {
        console.error('Generating index error:', err);
    }

    res.send({success:true})
})


const getPageCacheKey = (page) => {
    if (page === '') {
        page = 'index'
    }
    return `proxy-cache-${page}`;
}

const clearPageName = (url) => {
    return url
        .replace(/^\//, '')
        .replace(/([^a-z0-9\-_#]+)/gi, '_');
}

app.get('/*', async(req, res, next) => {

    let page = clearPageName(req.url);

    console.log(`REQUEST "${req.url}", page key: "${page}"`);

    try {
        const status = await checkCache(page);
        if (status === true) {
            console.log(`   Response from cache - 200 OK`);
            const body = await cacheGet(getPageCacheKey(page));
            res.send(body);
            return;
        }

        if (status === false) { // cache miss
            console.log(`   Response from cache - 404 Page Not Found`);
            next({message:'Page not found', statusCode: 404})
            return;
        }

        let proxyUrl = `https://${target}`;
        if (bypassPages.includes(req.url)) {
            proxyUrl += req.url;
        } else {
            proxyUrl += `/${page}`;
        }

        const body = await fetchSourcePage(proxyUrl, page);
        console.log(`   Response from proxy - 200 OK`);
        res.send(body);

    } catch (errData) {
        console.error(`   Proxy returns error for page /${page}`, errData);
        if (errData.statusCode === 404) {
            await setCacheMiss(page);
        }
        next(errData)
    }
})

const checkCache = async (page) => {
    try {
        const hasMiss = !!(await cacheGet(`proxy-cache-miss-${page}`));
        const pageKey = getPageCacheKey(page);
        const hasPage = !!(await cacheGet(pageKey));
        console.log(`   checkCache --> "/${page}", key "${pageKey}", hasMiss: ${hasMiss}, hasPage: ${hasPage}`)
        if (hasMiss) {
            return false;
        }
        if (hasPage) {
            return true;
        }
    } catch (err) {
        console.error(' checkCache error:', page, err);
    }

    return null;
}

const setCacheMiss = async(page) => {
    console.log(`   setCacheMiss --> "/${page}"`)
    try {
        await cacheSet(`proxy-cache-miss-${page}`, '1', 60);
    } catch (err) {
        console.error(' setCacheMiss storing error:', page, err);
    }
}


const fetchSourcePage = async (url, page) => {
    let response = await proxyClient(url);
    const pageKey = getPageCacheKey(page);
    console.log('   Store to cache:', url, '-->', pageKey);

    if (postProcessPages.includes(page)) {
        response = postProcess(page, response);
    }

    await cacheSet(pageKey, response, 60*60);

    return response;
}

const postProcess = (page, body) => {
    console.log('   Post processing page:', page);
    body = body.replaceAll(target, baseHost);
    return body;
}

const errorHandler = (err, req, res, next) => {
    console.log(`   Error handler --> "${req.url}"`, err);

    const errStatus = err.statusCode || 500;
    let errorData = err.message || 'Something went wrong';

    cacheGet(`proxy-cache-${errStatus}`)
        .then((cachedData) => {
            if (cachedData) {
                console.log('   Error handler --> get response page from cache for error code ', errStatus);
                res.status(errStatus).send(cachedData);
            } else {
                console.log('   Error handler --> no response page for status code, send default');
                res.status(err.statusCode).send(errorData);
            }
        })
        .catch((e) => {
            console.error('   Error handler --> response page check error', e);
            res.status(500).send(errorData);
        });
}
app.use(errorHandler)


app.listen(port, () => {
    console.log(`Caching proxy for ${target} started as http://proxy-cache:${port}`)
})