import Fastify, { errorCodes } from 'fastify'
import FastifyView from "@fastify/view"
import ejs from 'ejs'
import FastifyJWT from "@fastify/jwt"

const fastify = Fastify({
    logger: true,
})

fastify.register(FastifyView, {
    engine: { ejs },
    root: "./views",
})

fastify.register(FastifyJWT, {
    secret: "my_secret",
    sign: {
        algorithm: 'HS256'
    }
})

fastify.setErrorHandler((error, request, reply) => {
    reply.status(500).send({ error: true, message: error.message, })
})

fastify.register((app, options, next) => {

    fastify.setErrorHandler((error, request, reply) => {
        throw error
    })

    next()
})

fastify.get('/', async function handler (request, reply) {
    reply.view("index.ejs", { name: "User" });
    return reply;
})

const jwtRequestSchema = {
    type: 'object',
    required: ['user_id'],
    properties: {
        user_id: { type: 'number' },
    },
}

const schema = {
    body: jwtRequestSchema,
}

fastify.post('/jwt', {
    schema
}, async function handler (request, reply) {
    const allowedUserIds = [123,123722]; // @todo any check you need
    if (!allowedUserIds.includes(request.body.user_id)) {
        throw new Error('Bad user id')
    }

    const payload = {
        "sub": `${request.body.user_id}`,
        "iat": Math.ceil((new Date()).getTime() / 1000),
        "exp": Math.ceil((new Date()).getTime() / 1000) + 604800, // add week to timestamp
    }
    console.log('jwt payload', payload)

    const token = await reply.jwtSign(payload);

    return {token};
})

try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' })
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}