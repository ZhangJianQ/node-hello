// 爬虫常规操作，使用puppeteer爬取壁纸网站上的资源
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const fs = require("fs");
// 爬取电子书网站的电子书名称和下载地址
// 获取所有电子书的数目
const Book = require("./modules/book");
// mongodb连接工具
const mongoose = require("mongoose");
const config = require("./utils/config");
// 连接数据库
mongoose.connect(config.database);
const db = mongoose.connection;

const options = {
  // 浏览器窗口设置
  defaultViewport: {
    width: 1440,
    height: 800,
  },
  headless: false, //有界面浏览
  slowMo: 250, //每个操作步骤的延迟
};
const host = "http://www.iqishu.la/soft/sort01/";

function saveBook(data) {
  let book = new Book();

  book.name = data.name;
  book.cover = data.cover;
  book.author = data.author;
  book.size = data.size;
  book.rank = data.rank;
  book.brief = data.brief;
  book.date = data.date;
  book.page = data.page;
  book.download = data.download;

  book.save((err) => {
    if (err) return console.log(err);
    // 保存成功
    console.log("存储成功");
  });
}
// Promise对象
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  // 获取小说数量
  async function getTotal(url) {
    const page = await browser.newPage();
    await page.goto(url);

    // 获取电子书数量
    const pagination = await page.$eval(
      ".tspage",
      (el) => el.childNodes[0].textContent
    );
    page.close();

    return pagination.match(/总数(\d+)/)[1];
  }

  async function getPageByNumber(num) {
    let url = "http://www.iqishu.la/soft/sort01/index_" + num + ".html";
    const page = await browser.newPage();
    await page.goto(url);

    await page.exposeFunction("cheerio", (html) => cheerio.load(html));

    const list = await page.$$eval(".listBox li>a", (els) =>
      els.map((el) => {
        const info = el.previousElementSibling.textContent.match(
          /作者：(\S+)大小：(\S+)MB等级：更新：(\S+)/
        );
        const rank = el.previousElementSibling.children[2].className.replace(
          /[a-z]+/,
          ""
        );
        return {
          page: new URL(el.getAttribute("href"), "http://www.iqishu.la").href,
          name: el.textContent,
          cover: new URL(
            el.childNodes[0].getAttribute("src"),
            "http://www.iqishu.la"
          ).href,
          download: "",
          author: info[1],
          size: info[2],
          date: info[3],
          rank,
          brief: el.nextElementSibling.textContent,
        };
      })
    );
    list.forEach((item) => {
      getDownloadUrl(item);
    });
    await page.close();

    return list;
  }

  async function getDownloadUrl(book) {
    const page = await browser.newPage();
    await page.goto(book.page);

    book.download = await page.$$eval(".downButton", (els) =>
      els[els.length - 1].getAttribute("href")
    );

    // 保存到文件
    fs.appendFile("output.txt", JSON.stringify(book) + "\n", (err) => {
      if (err) throw err;
      console.log(book.name + "写入完成");
    });

    // 保存到数据库
    // saveBook(book);

    page.close();
  }
  // getTotal(host);
  // 按页面获取电子书信息;
  getPageByNumber(1);

  // await browser.close();
})();
