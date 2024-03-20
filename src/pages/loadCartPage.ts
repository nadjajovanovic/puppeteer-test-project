import { limiter } from "../utils/consts";

export async function goToCartPage(cluster: any, url: any) {
  //Navigate to cart page
  await cluster.task(async ({ page }) => {
    await limiter.schedule(async () => {
      await page.goto(url);
    })
    //extracting proced to checkout
    const proceedToCheckout = await page.$("button.proceed-to-checkout");
    //clicking to button
    await proceedToCheckout.evaluate((button: any) => button.click()).then('Clicked').catch((err: any) => console.log(err));

    //waitng for dialog to open so you can continue
    await page.waitForSelector("#join-neu-overlay");

    //extracting continue button
    const continueToShipping = await page.$(
      "div.wt-validation button.wt-btn--secondary"
    );

    //clicking on continue button and navigate to shipping form page
    await continueToShipping.evaluate((button: any) => button.click()).then('Clicked').catch((err: any) => console.log(err));

    //navigate to shipping page
    await goToShipingForm(page);

    await cluster.idle();
    await cluster.close(); 
  });
  await cluster.queue(url);
}

async function goToShipingForm(page: any) {
  //populating form and submitting button
  await page.waitForSelector("#shipping-form-email-input");
  await page.type("#shipping-form-email-input", "test@gmail.com");

  await page.waitForSelector("#shipping-form-email-confirmation");
  await page.type("#shipping-form-email-confirmation", "test@gmail.com");

  await page.waitForSelector("#name11-input");
  await page.type("#name11-input", "Nadja Jovanovic");

  await page.waitForSelector("#first_line12-input");
  await page.type("#first_line12-input", "Test");

  await page.waitForSelector("#second_line13-input");
  await page.type("#second_line13-input", "25");

  await page.waitForSelector("#zip14-input");
  await page.type("#zip14-input", "21000");

  await page.waitForSelector("#city15-input");
  await page.type("#city15-input", "Novi Sad");

  await page.waitForSelector("#phone16-input");
  await page.type("#phone16-input", "123456");

  //go to  choose method payment
  const continueToPayment = await page.$(
    "#shipping-address-form > div:nth-child(2) > button"
  );
  await continueToPayment.evaluate((button: any) => button.click()).then('Clicked').catch((err: any) => console.log(err));

  //choosing payment method
  await page.waitForSelector("#gpay_panonly-radio--paymentstep");
  const gpay = await page.$("#gpay_panonly-radio--paymentstep");
  await gpay.evaluate((button: any) => button.click()).then('Clicked').catch((err: any) => console.log(err));

  //after choosing a method show button to review your order and proces is done
  await page.waitForSelector("div.wt-mb-xs-1.wt-mb-md-2.wt-position-relative.wt-bb-xs > div:nth-child(1) > div.wt-mt-xs-2.wt-mt-lg-3 > button");
  const reviewOrder = await page.$("div.wt-mb-xs-1.wt-mb-md-2.wt-position-relative.wt-bb-xs > div:nth-child(1) > div.wt-mt-xs-2.wt-mt-lg-3 > button");
  await reviewOrder.evaluate((button: any) => button.click()).then('Clicked').catch((err: any) => console.log(err));
}

