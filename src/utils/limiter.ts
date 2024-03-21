export const Bottleneck = require("bottleneck");
export const limiter = new Bottleneck({
  maxConcurrent: 15,
  minTime: 2000,
});
