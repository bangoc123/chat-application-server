
class RedisCURD {
  constructor(redisClient) {
    this.redisClient = redisClient;
  }

  get(key) {
    return new Promise((resolve, reject) => {
      this.redisClient.get(key, (err, value) => {
        if (!err) {
          resolve(value);
        } else {
          reject(err);
        }
      });
    });
  }

}

export default RedisCURD;
