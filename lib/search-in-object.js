/** @babel */

const compareObjects = (o1, o2) => {
  let i = 0;
  let j = 0;
  const o1Keys = Object.keys(o1);
  const o2Keys = Object.keys(o2);
  for (i = 0; i < o1Keys.length; i += 1) {
    if (o1[o1Keys[i]] !== o2[o1Keys[i]]) {
      return false;
    }
  }
  for (j = 0; j < o2Keys.length; j += 1) {
    if (o1[o2Keys[j]] !== o2[o2Keys[j]]) {
      return false;
    }
  }
  return true;
};

const itemExists = (haystack, needle) => {
  let i = 0;
  for (i = 0; i < haystack.length; i += 1) {
    if (compareObjects(haystack[i], needle)) {
      return true;
    }
  }
  return false;
};

const searchFor = (arrOfObj, toSearch, allowedKeys = []) => {
  const results = [];
  if (arrOfObj.length > 0) {
    const objKeys = Object.keys(arrOfObj[0]);
    const toSearchLowercase = toSearch.toLowerCase();
    arrOfObj.forEach((obj) => {
      objKeys.forEach((key) => {
        if (typeof obj[key] === 'string' && allowedKeys.indexOf(key) !== -1) {
          const lowercaseValue = obj[key].toLowerCase();
          if (lowercaseValue.indexOf(toSearchLowercase) !== -1) {
            if (!itemExists(results, obj)) results.push(obj);
          }
        }
      });
    });
  }
  return results;
};

export default searchFor;
