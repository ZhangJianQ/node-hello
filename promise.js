// Promise和回调函数
// Promise相比回调函数的嵌套更容易理解代码结构
const axios = require("axios");

async function getBaidu(params) {
  const response = await axios.get("http://www.baidu.com");
  return response;
}

function timeout(params) {
  let result = 0;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      result = 200;
      resolve(result);
    }, 2000);
  });
}

timeout().then((result) => {
  console.log("2s timeout", result);

  getBaidu().then((res) => {
    console.log("response", res.headers);
  });
});
