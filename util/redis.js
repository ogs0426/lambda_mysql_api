const IoRedis = require('ioredis');

// 클러스터 구성 일 경우 바꿀것
const redis = new IoRedis({
    port: process.env.PORT_REDIS,
    host: process.env.HOST_REDIS,
    db: 1
});

module.exports = redis;