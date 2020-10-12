const fs = require("fs");

// fs.readFile("./output.txt", (err, data) => {
//   console.log(data.toString("utf-8"));
// });

console.log(fs.readFileSync("./output.txt", { encoding: "utf-8" }));
