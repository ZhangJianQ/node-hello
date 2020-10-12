var xlsx = require('node-xlsx');
const fs = require('fs');
const moment = require('moment');

const baseTime = 43419;
let total = 0;
let count = 1;
const error = [];

// const areaFile = xlsx.parse(`${__dirname}/area.xlsx`);
// const areas = areaFile[0].data;

function readDir(start) {
    let files = fs.readdirSync(`${__dirname}/es/`);
    let index = -1;
    total = files.length;

    if (start) {
        index = files.indexOf(start);
        files = files.slice(index);
    }

    files.forEach(item => {
        xlsxHandle(`${__dirname}/es/${item}`, item.replace(/\.xlsx/, ''))
    })
}

function buildXLSX(name, data) {
    var outSheets = []
    outSheets.push({ name: 'sheet', data: data })

    var buffer = xlsx.build(outSheets); // Returns a buffer
    fs.writeFileSync(`${__dirname}/latest/${name}.xlsx`, buffer, { 'flag': 'w' });
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
    const mm = [];
    const lj = [];
    console.log('开始执行: ' + dir)

    result.forEach(item => {
        item[2].search('LJ') === -1 ? mm.push(item) : lj.push(item)
    })

    lj.length === 0 && error.push(name)

    buildXLSX(name + '_mm', mm)
    buildXLSX(name + '_lj', lj)
}

// xlsxHandle(`${__dirname}/es/Sheet1.xlsx`, 'Sheet1')
readDir()
console.log(error)
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