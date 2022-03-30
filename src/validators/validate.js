//*****************************************-validation-for-values-**********************************************
const isValidValue = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

//*************************************-validation-for-requestBody-**********************************************
const isValidDetails = function (details) {
  return Object.keys(details).length > 0;
};

//***************************************-validation-for-title-***************************************************
let isValidTitle = (title) => {
  return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1;
};

module.exports.isValidDetails = isValidDetails;
module.exports.isValidValue = isValidValue;
module.exports.isValidTitle = isValidTitle;
