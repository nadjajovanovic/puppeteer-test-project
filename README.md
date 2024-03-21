# puppeteer-test-project

## npm install

First you have to install necessary packages from package.sjon file

## npm start

To start the application use npm start

## npm test

To start the test use npm test

## Assumptions

Assumptions I made during development is that sometimes the pages will take longer time to load and render, maybe due to low network connection or complexity of web page. Structure, content or behaviour of the target web page can be changed due to frequently updated web sites or dynamically generated content. Low network connection can impact on page loading and rendering. 

## Challenges

* Complex HTML structure - HTML of the site is very complex in some cases, so in some cases it was very difficult to find the specific element from structure. I overcome this inspection the element on the browser and querying them through Console in the browser to find the right element
* I faced with 
* Sometimes the site was changing its default behaviour (for example: when checking out the cart, instead of opening the dialog - which is default, it directed me to sign in page). Investigating this situation, I found out that maybe my internet connection is preventing access and I just had to change my network connection. 

## Additionals and improvements
Improvements:
* I used puppeter cluster instead of puppeter.launch for running multiple pages in parallel
* Rate limiting is implemented using bottleneck package

I added two additional feature in this test project
* Tests for pagination and loading the first 10 products of the page and clicking the checkout button
* Optimization - Anti-Bot detection - this was implemented using plugin puppeteer-extra-plugin-stealth and Rotating User-Agents - this was implemented using plugin puppeteer-extra-plugin-anonymize-ua

Anti-Bot Detection: By default, Puppeteer scrapers leak a lot of fingerprints that can be used to detect them. Therefore, you need to fortify your Puppeteer scraper. There are many ways to do this, such as fixing browser leaks, optimizing headers, or using plugins like puppeteer-extra-plugin-stealth.

Rotating Fake User-Agents: Websites can detect and block bots that send requests using the same user agent every time. Therefore, when web scraping at scale, it is important to rotate user agents to avoid being blocked by websites. This can be achieved by maintaining a pool of user agents and randomly selecting one for each request.
