import { generateRandomCharacters } from "../cryptography/random.js";
function possibleCombinations(n, r) {
  return Math.pow(n, r);
}

function allUniqueCharacters(charset) {
  if (typeof charset === "string") {
    return new Set(charset).size === charset.length;
  }
  throw new Error("Charset must be a string");
}
export var charsets = {
  //Contains upper and lower case english alphabets and digits from 0=9
  ALPHANUMERIC:
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  ALPHANUMERIC_LOWER_CASE: "abcdefghijklmnopqrstuvwxyz0123456789",
  NUMERIC: "0123456789",
  ENGLISH_ALPHABETS: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  ENGLISH_ALPHABETS_LOWER_CASE: "abcdefghijklmnopqrstuvwxyz",
};

export function generateVCS(
  charset,
  cuLength,
  rows,
  cols,
  maxOccurencePercentage = 3
) {
  if (!allUniqueCharacters(charset))
    throw new Error("All characters in the character set must be unique");
  let repVal = (rows * cols * maxOccurencePercentage) / 100;
  let combs = possibleCombinations(charset.length, cuLength);
  if (repVal * combs < rows * cols)
    throw new Error(
      `Impossible to generate a vcs with given constraints repVal=${repVal}  combs=${combs}`
    );
  let matrix = new Array(rows);
  let cuMap = {};
  for (let i = 0; i < rows; i++) {
    let row = new Array(cols);
    for (let j = 0; j < cols; j++) {
      let cu = generateRandomCharacters(charset, cuLength);
      while (cuMap[cu] && cuMap[cu] > repVal) {
        cu = generateRandomCharacters(charset, cuLength);
      }
      row[j] = cu;
    }
    matrix[i] = row;
  }
  return new VCS(rows, cols, matrix, charset);
}

export function loadVCS(charset, rows, cols, matrix) {
  return new VCS(rows, cols, matrix, charset);
}

//If any element in vcs occupies more than maxRepetitionPercentage of the cells, it will be replaced
export class VCS {
  constructor(rows, cols, matrix, charset) {
    if (matrix.length !== rows) {
      throw Error("Row length does not match provided length");
    }
    for (let i = 0; i < rows; i++) {
      if (matrix[i].length !== cols) {
        throw Error("Column length does not match provided length");
      }
    }
    this.rows = rows;
    this.cols = cols;
    this.matrix = matrix;
    this.charset = charset;
    this.revMap = this.reverseCharset();
  }
  reverseCharset() {
    let revMap = {};
    for (let i = 0; i < this.charset.length; i++) {
      revMap[this.charset[i]] = i;
    }
    return revMap;
  }

  toString = () => {
    let str = new String();
    this.matrix.forEach((row) => {
      let rowString = row.join(" ");
      str = str + rowString + "\n";
    });
    return str;
  };
  isIdentical(vcs) {
    if (
      this.rows !== vcs.rows ||
      this.cols !== vcs.cols ||
      this.charset !== vcs.charset
    ) {
      return false;
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.matrix[i][j] !== vcs.matrix[i][j]) {
          return false;
        }
      }
    }
    return true;
  }
}
