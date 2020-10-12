var xlsx = require("node-xlsx");
var fs = require("fs");
const _ = require("underscore");

// 解析得到文档中的所有 sheet
var sheets = xlsx.parse("一般贷款台账20200930.xls");
var data = [];

// 遍历 sheet
sheets.forEach(function (sheet) {});

sheets.forEach(function (sheet) {
  if (sheet["name"] === "竞赛期间所有贷款") {
    data.push(formatData(sheet));
  }
});

writeData(data);

function formatData(sheet) {
  const result = {
    name: sheet["name"],
    data: [],
  };
  const count = {};

  const data = [];

  sheet["data"].forEach((row, rIndex) => {
    if (result.data[row[1]]) {
      const index = _.indexOf(result.data[row[1]], row[7]);
      index === -1 && result.data[row[1]].push(row[7]);
      if (row[4] <= 300000) {
        count[row[1]].percent += 1;
      }
      count[row[1]].total += 1;
      //   result.data[row[1]].push(row[7]);
    } else {
      result.data[row[1]] = [row[7]];
      count[row[1]] = {
        percent: 1,
        total: 1,
      };
    }
  });
  for (var key in result.data) {
    data.push([
      key,
      result.data[key].join("、"),
      count[key].percent,
      count[key].total,
    ]);
  }

  result.data = data;

  return result;
}

// function getValue(data){
//   const one = new RegExp('亿')
//   const two = new RegExp('万')
//   if(one.test(data)){
//     return parseFloat(data.replace(one, ''))*10000
//   }
//   if(two.test(data)){
//     return parseFloat(data.replace(two, ''))
//   }
//   if(data == '--'){
//     return 0
//   }
//   return data;
// }

function writeData(data) {
  var buffer = xlsx.build(data);

  // 写入文件

  //   fs.writeFile("数据_无去重.xlsx", buffer, function (err) {
  fs.writeFile("数据.xlsx", buffer, function (err) {
    if (err) {
      console.log("Write failed: " + err);
      return;
    }

    console.log("Write completed.");
  });
}
