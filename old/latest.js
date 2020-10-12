var xlsx = require('node-xlsx');
const fs = require('fs');
const moment = require('moment');

const baseTime = 43419;
let total = 0;
let count = 1;
const error = [];

const tagObj = {};

const tagIdFile = xlsx.parse(`${__dirname}/数据库点位表.xlsx`);
tagIdFile[0].data.forEach(item=>{
    tagObj[item[1]] = item[0]
});

function readDir(start) {
    let files = fs.readdirSync(`${__dirname}/sources/`);
    let index = -1;
    total = files.length;

    if (start) {
        index = files.indexOf(start);
        files = files.slice(index);
    }

    files.forEach(item => {
        xlsxHandle(`${__dirname}/sources/${item}`, item.replace(/\.xlsx/, ''))
    })
}

function buildXLSX(name, data) {
    var outSheets = []
    outSheets.push({ name: 'sheet', data: data })

    var buffer = xlsx.build(outSheets); // Returns a buffer
    fs.writeFileSync(`${__dirname}/${name}.xlsx`, buffer, { 'flag': 'w' });
    console.log(name + ' 写入完成...')
    console.log('完成: ' + Math.round(count / total * 100) + '%')
    count++
}

function xlsxHandle(dir, name) {
    const workSheetsFromFile = xlsx.parse(dir);
    const datas = workSheetsFromFile[0].data;
    const tag = [];
    if (!datas.length) return false;

    const result = datas;
    console.log('开始执行: ' + dir)

    result.forEach((item, index) => {
        if(index === 0){
            return false
        }
        item[3] = tagObj[item[4]]
    })

    buildXLSX(name, result)
}

xlsxHandle(`${__dirname}/YB.xls`, 'target')
// readDir()
// setArea(`${__dirname}/201910111120.xls`, '201910111120')

// function setArea(dir, name) {
//     const workSheetsFromFile = xlsx.parse(dir);
//     const datas = workSheetsFromFile[0].data;
//     const tag = [];
//     if (!datas.length) return false;

//     const result = datas;

//     result.forEach(item => {
//         const area = areas.find(area => area[0] === item[1]) || []
//         console.log(area)
//         item[2] = area[1]
//     })

//     buildXLSX(name, result)
// }