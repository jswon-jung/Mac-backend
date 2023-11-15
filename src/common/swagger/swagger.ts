const swaggerAutogen = require('swagger-autogen')();
import 'dotenv/config';

const options = {
    info: {
        version: '3.0.0',
        title: 'mac project API Docs',
        description: '맥 [Mac] 프로젝트 api 문서입니다',
    },
    servers: [
        { url: process.env.LOCAL },
        { url: process.env.ORIGIN },
    ],
    schemes: ['http', 'https'],
    tags: [
        {
            name: 'Users',
            description: 'User관련 API',
        },
        {
            name: 'Auth',
            description: '관련 API',
        },
    ],
};

const outputFile = './swagger-output.json';
const endpointsFiles = [''];
swaggerAutogen(outputFile, endpointsFiles, options);
