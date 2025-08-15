
import { createClient } from 'redis';

const redisClient = createClient({
    url: 'redis://localhost:6379',
})
await redisClient.connect();

export { redisClient }