import { Cluster } from "puppeteer-cluster";

const defaultOptions = {
  concurrency: Cluster.CONCURRENCY_PAGE,
  maxConcurrency: 100,
  monitor: true,
  puppeteerOptions: {
    headless: false,
    args: ['--disable-features=site-per-process, `--ignore-certificate-errors`'],
    defaultViewport: null,
    userDataDir: "./tmp",
  },
};

export default async (options = undefined) => {
  const puppeterOptions = options === undefined ? defaultOptions : options;
  return await Cluster.launch(puppeterOptions);
};
