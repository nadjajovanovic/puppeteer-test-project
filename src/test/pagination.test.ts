import { limiter, paginationUrl } from "../utils/consts";
import launchPuppeteerCluster from "../utils/launchPuppeteerCluster";

const url = paginationUrl;

describe("Pagination tests", () => {
  let cluster: any;
  let title: string;
  let nextPageLink: any;
  let initialContent: any;
  let updatedContent: any;

  beforeAll(async () => {
    cluster = await launchPuppeteerCluster();
    await cluster.task(async ({ page, data: url }) => {
        await limiter.schedule(async () => {
          await page.goto(url);
          
        })
        page.waitForSelector('div.wt-show-lg.appears-ready > nav > ul > li:nth-child(11) > a')
        nextPageLink = await page.$("div.wt-show-lg.appears-ready > nav > ul > li:nth-child(11) > a");
        initialContent = await page.$$("ol.wt-grid.wt-grid--block.wt-pl-xs-0.tab-reorder-container > li");
        updatedContent = initialContent;
        title = await page.title();
    })
    await cluster.queue(url);
    await cluster.idle();
  });

  afterAll(async () => {
    await cluster.close();
  });

  test('Title should be "All Categories - Etsy Serbia"', async () => {
    expect(title).toBe("All Categories - Etsy Serbia");
  });

  test('Next button is clicked and next page is loaded with more content test"', async () => {
    try {
        const isBtnClicked = await nextPageLink.click();
        const updatedContentSecondPage = updatedContent;
        expect(isBtnClicked).toBe(true);
        expect(updatedContentSecondPage).toBe(updatedContent);
      } catch (error) {
        console.log(error);
      }
  });

  test('After clicking on next page, you have reached last page', async () => {
    try {
      let isLastPage = false;
      await nextPageLink.click();
      isLastPage = true;
      expect(nextPageLink).toBeNull();
    } catch (err) {
      console.log(err);
    }
  });

});
