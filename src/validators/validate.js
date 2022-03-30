const isValidValue = function (value) {
    //it should not be like undefined or null.
    if (typeof value === "undefined" || value === null) return false; //if the value is undefined or null it will return false.
    if (typeof value === "string" && value.trim().length === 0) return false; //if the value is string & length is 0 it will return false.
    return true;
  };
  
  const isValidDetails = function (details) {
    return Object.keys(details).length > 0;
  };
  //***************************************validation for title******************************************
  let isValidTitle = (title) => {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1;
  };

  module.exports.isValidDetails=isValidDetails
  module.exports.isValidValue=isValidValue
  module.exports.isValidTitle=isValidTitle