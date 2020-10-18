// 爬虫常规操作，使用puppeteer爬取壁纸网站上的资源
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const url = require("url");
const mime = require("mime");

// 设置事件的最大监听数，默认为10个；直接设置为何不行
require("events").EventEmitter.defaultMaxListeners = 15;
// emitter.setMaxListeners(15);

// (async () => {
//   // 常规操作，打开连接
//   const browser = await puppeteer.launch({
//     headless: false,
//   });
//   const page = await browser.newPage();
//   await page.goto("https://www.baidu.com");
//   await page.screenshot({ path: "baidu.png" });

//   // 常规操作，关闭连接；如果不设置窗口会一直打开着，直到用户手动关闭浏览器标签
//   await browser.close();
// })();
// const host = "https://www.toopic.cn";

// openPage(host);

// async function openPage(url) {
//   const browser = await puppeteer.launch({
//     // 用界面打开
//     headless: false,
//   });

//   const page = await browser.newPage();
//   await page.goto(url);
//   const handles = page.$$(".fenlei-lb a");
//   console.log(handles);
//   // handles[1].click();
//   await browser.close();
// }

// 1. 创建请求链接
// 2. 解析页面图片（资源）地址
// 3. 根据地址爬取资源到本地
// const urls = [
//   "https://www.toopic.cn/dnbz/?q=82.html&page=1",
//   "https://www.toopic.cn/dnbz/?q=82.html&page=2",
//   "https://www.toopic.cn/dnbz/?q=82.html&page=3",
// ];
// urls.forEach((url) => {
//   // 后期考虑怎么把异步回调改成同步的方式，同步的方式更容易理解
//   getResources(url, download);
// });

// function download(file) {
//   console.log("Begin: " + file.name);
//   axios.get(file.url, { responseType: "stream" }).then((resp) => {
//     // 获取响应头，提取编码和文件类型
//     const headers = resp.headers;
//     // 使用mime获取文件类型、扩展名
//     const extension = mime.getExtension(headers["content-type"]);
//     // 使用管道写入文件流
//     const ws = fs.createWriteStream(
//       path.join(__dirname, "images", file.name + "." + extension)
//     );
//     resp.data.pipe(ws);
//     console.log("End: " + file.name);
//   });
// }

// function getResources(url, callback) {
//   axios.get(url).then((resp) => {
//     const $ = cheerio.load(resp.data);
//     $(".pic img").each((index, pic) => {
//       callback({
//         name: $(pic).parent().attr("title"),
//         url: "https://www.toopic.cn" + $(pic).attr("src"),
//       });
//     });
//   });
// }

// 延迟函数
// function timeout(millionSeconds) {
//   return new Promise((resolve, reject) => {
//     setTimeout(function () {
//       resolve("success");
//     }, millionSeconds);
//   });
// }

// timeout(2000).then((resp) => {
//   console.log(resp);
// });

// 下载函数
// function downloadBook(book) {
//   console.log("开始下载: " + book.name);
//   axios
//     .get(encodeURI(book.download), { responseType: "stream" })
//     .then((resp) => {
//       // 使用管道写入文件流
//       const ws = fs.createWriteStream(
//         path.join(__dirname, "books", book.name + ".zip")
//       );
//       resp.data.pipe(ws);
//       ws.on("end", () => {
//         console.log("下载完毕");
//       });
//     })
//     .catch((error) => {
//       console.log("Error: " + error.code);
//     });
// }
// 下载电子书
// downloadBook({
//   page: "http://www.iqishu.la/Shtml80111.html",
//   name: "《写写小说就无敌了》全集",
//   download: "http://txt.bookshuku.com/home/down/zip/id/4060",
// });

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//   });

//   async function getTime(url) {
//     const page = await browser.newPage();
//     page.goto(url);

//     // const info = await page.evaluateHandle(() => window.__INITIAL_STATE__);
//     // console.log(await info.jsonValue());
//     // const result = await page.evaluate(() => {
//     //   window.onload = function () {
//     //     alert(window.__INITIAL_STATE__);
//     //   };

//     //   return;
//     // });

//     // const executionContext = await page.mainFrame().executionContext();
//     // const result = await executionContext.evaluate(() =>
//     //   Promise.resolve(8 * 7)
//     // );
//     // console.log(result); // 输出 "56"
//   }

//   getTime(
//     "https://www.bilibili.com/video/BV1dz4y1o7XS/?spm_id_from=333.788.videocard.0"
//   );
// })();
