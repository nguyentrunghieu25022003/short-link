const puppeteer = require("puppeteer");
const { sleep } = require("../../../helper/sleep");
const SocialSnapshot = require("../../../models/social-snapshot.model");

module.exports.getAllResult = async (req, res) => {
  try {
    const result = await SocialSnapshot.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
};

module.exports.handleCrawlDataByUsername = async (req, res) => {
  let browser = null;
  try {
    const { userInput } = req.body;
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    const url = `${process.env.FACEBOOK_URL}/login/identify/?ctx=recover&from_login_screen=0`;
    await page.goto(url, {
      waitUntil: "networkidle2",
    });
    await sleep(1000);
    await page.type("#identify_email", userInput);
    await sleep(2000);
    await page.click("button[name='did_submit']");
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    await sleep(1000);
    const tryAnotherWayLink = await page.$("a[name='tryanotherway']");
    if (tryAnotherWayLink) {
      await tryAnotherWayLink.click();
      await page.waitForNavigation({ waitUntil: "networkidle2" });
    }
    await sleep(3000);
    const email = await page.evaluate(() => {
      const emailElements = document.querySelector("div._9o1y") || document.querySelector("div._aklx");
      if(emailElements) {
        const emailArray = emailElements ? emailElements.innerText.trim().split('\n').map(email => email.trim()) : [];
        const validEmailArray = emailArray.filter(email => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        });
    
        return Array.from(new Set(validEmailArray));
      }
      return [];
    });
    const phone = await page.evaluate(() => {
      const phoneElements = Array.from(document.querySelectorAll("div[dir='ltr']"));
      if(phoneElements) {
        const phoneArray = phoneElements ? phoneElements.map(phoneElement => phoneElement.innerText.trim()) : [];
        return Array.from(new Set(phoneArray));
      }
      return [];
    });
    const socialSnapshot = new SocialSnapshot({
      userInfo: userInput,
      email: email,
      phoneNumber: phone,
    });
    await socialSnapshot.save();
    const client = await page.createCDPSession();
    await client.send("Network.clearBrowserCookies");
    await client.send("Network.clearBrowserCache");
    await client.send("Storage.clearDataForOrigin", {
      origin: url,
      storageTypes: "all",
    });
    await browser.close();
    res.status(200).json({
        email: email,
        phone: phone
    });
  } catch (err) {
    res.status(500).send("Can't crawl data: " + err.message);
  }
};

module.exports.handleCrawlDataByUserId = async (req, res) => {
  let browser = null;
  try {
    const { userInput } = req.body;
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    const url = `${process.env.FACEBOOK_URL}/login`;
    await page.goto(url, {
      waitUntil: "networkidle2",
    });
    await sleep(1000);
    await page.type("#email", userInput);
    await sleep(2000);
    await page.click("button[name='login']");
    await page.waitForNavigation({ waitUntil: "networkidle2" });
    await sleep(3000);
    const tryAnotherWayLink = await page.$("a[name='tryanotherway']");
    if (tryAnotherWayLink) {
      await tryAnotherWayLink.click();
      await page.waitForNavigation({ waitUntil: "networkidle2" });
    }
    await sleep(3000);
    const email = await page.evaluate(() => {
      const emailElements = document.querySelector("div._9o1y") || document.querySelector("div._aklx");
      if(emailElements) {
        const emailArray = emailElements ? emailElements.innerText.trim().split('\n').map(email => email.trim()) : [];
        const validEmailArray = emailArray.filter(email => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        });
    
        return Array.from(new Set(validEmailArray));
      }
      return [];
    });
    const phone = await page.evaluate(() => {
      const phoneElements = Array.from(document.querySelectorAll("div[dir='ltr']"));
      if(phoneElements) {
        const phoneArray = phoneElements ? phoneElements.map(phoneElement => phoneElement.innerText.trim()) : [];
        return Array.from(new Set(phoneArray));
      }
      return [];
    });
    const socialSnapshot = new SocialSnapshot({
      userInfo: userInput,
      email: email,
      phoneNumber: phone,
    });
    await socialSnapshot.save();
    const client = await page.createCDPSession();
    await client.send("Network.clearBrowserCookies");
    await client.send("Network.clearBrowserCache");
    await client.send("Storage.clearDataForOrigin", {
      origin: url,
      storageTypes: "all",
    });
    await browser.close();
    res.status(200).send({
      email: email,
      phone: phone
    });
  } catch (err) {
    res.status(500).send("Can't crawl data: " + err.message);
  }
};