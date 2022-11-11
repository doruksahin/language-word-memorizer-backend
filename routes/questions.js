var express = require("express");
var XLSX = require("xlsx");
var router = express.Router();

router.post("/", async function (req, res, next) {
  const path = req.files.file._writeStream.path;
  const optionCount = 4;
  var workbook = XLSX.readFile(path);
  var sheet_name_list = workbook.SheetNames;
  var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  const result = [];
  for (var i = xlData.length - 1; i > 0; i--) {
    const question = {};
    question.word = xlData[i].word1;
    question.options = getOptions(
      getJunkOptions(xlData, i, optionCount),
      xlData[i].word2
    );
    question.answer = xlData[i].word2;
    result.push(question);
  }
  console.log(result);
  res.send(result);
});

function getOptions(junkOptions, realOption) {
  junkOptions.push(realOption);
  return shuffleArray(junkOptions);
}

function getJunkOptions(xlData, index, optionCount) {
  const options = [];
  const shuffledSlicedRows = shuffleArray([
    ...xlData.slice(0, index),
    ...xlData.slice(index + 1, xlData.length),
  ]).slice(0, optionCount - 1);
  for (const row of shuffledSlicedRows) {
    options.push(row.word2);
  }
  return options;
}

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

module.exports = router;
