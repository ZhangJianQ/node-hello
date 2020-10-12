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

// 爬取电子书网站的电子书名称和下载地址
// 获取所有电子书的数目
// const Book = require("./modules/book");
// // mongodb连接工具
// const mongoose = require("mongoose");
// const config = require("./utils/config");
// // 连接数据库
// mongoose.connect(config.database);
// const db = mongoose.connection;

// const options = {
//   // 浏览器窗口设置
//   defaultViewport: {
//     width: 1440,
//     height: 800,
//   },
//   headless: false, //有界面浏览
//   slowMo: 250, //每个操作步骤的延迟
// };
// const host = "http://www.iqishu.la/soft/sort01/";

// function saveBook(data) {
//   let book = new Book();

//   book.name = data.name;
//   book.page = data.page;
//   book.download = data.download;

//   book.save((err) => {
//     if (err) return console.log(err);
//     // 保存成功
//     console.log("存储成功");
//   });
// }
// // Promise对象
// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false,
//   });
//   // 获取小说数量
//   async function getTotal(url) {
//     const page = await browser.newPage();
//     await page.goto(url);

//     // 获取电子书数量
//     const pagination = await page.$eval(
//       ".tspage",
//       (el) => el.childNodes[0].textContent
//     );
//     page.close();

//     return pagination.match(/总数(\d+)/)[1];
//   }

//   async function getPageByNumber(num) {
//     let url = "http://www.iqishu.la/soft/sort01/index_" + num + ".html";
//     const page = await browser.newPage();
//     await page.goto(url);

//     const list = await page.$$eval(".listBox li>a", (els) =>
//       els.map((el) => {
//         return {
//           page: new URL(el.getAttribute("href"), "http://www.iqishu.la").href,
//           name: el.textContent,
//           url: "",
//         };
//       })
//     );
//     list.forEach((item) => {
//       getDownloadUrl(item);
//     });
//     page.close();

//     return list;
//   }

//   async function getDownloadUrl(book) {
//     const page = await browser.newPage();
//     await page.goto(book.page);

//     book.download = await page.$$eval(".downButton", (els) =>
//       els[els.length - 1].getAttribute("href")
//     );

//     // 保存到文件
//     // fs.appendFile("output.txt", JSON.stringify(book) + "\n", (err) => {
//     //   if (err) throw err;
//     //   console.log(book.title + "写入完成");
//     // });

//     // 保存到数据库
//     saveBook(book);

//     page.close();
//   }
//   // getTotal(host);

//   // await browser.close();
// })();

function downloadBook(book) {
  console.log("开始下载: " + book.name);
  axios
    .get(encodeURI(book.download), { responseType: "stream" })
    .then((resp) => {
      // 使用管道写入文件流
      const ws = fs.createWriteStream(
        path.join(__dirname, "books", book.name + ".zip")
      );
      resp.data.pipe(ws);
      ws.on("end", () => {
        console.log("下载完毕");
      });
    })
    .catch((error) => {
      console.log("Error: " + error.code);
    });
}

// getPageByNumber(1);

downloadBook({
  page: "http://www.iqishu.la/Shtml80111.html",
  name: "《写写小说就无敌了》全集",
  download: "http://txt.bookshuku.com/home/down/zip/id/4060",
});
