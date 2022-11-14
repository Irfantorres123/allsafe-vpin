export var callTransformations = {
  SHIFT: 0,
  REVERSE: 1,
  INVERTCASE: 2,
  REVERSE_ODD_INDICES: 3,
  INVERTCASE_EVEN_INDICES: 4,
};

export class Call {
  //snSize is the length of the Serial number. We assume that each index comprises of half the length, therefore only allowing 2d SNs
  //Serial numbers is an array of strings where each string is a serial number  (e.g. ["23", "01"])
  constructor(snSize, serialnumbers, charset) {
    this.serialNumberLength = snSize;
    this.serialNumbers = serialnumbers;
    this.charset = charset;
  }
  /* 
    transformations- array of maps mapping callTransformations to parameters
    Like so [{callTransformations.SHIFT:1}, {callTransformations.REVERSE:10}]
    The transformations are applied in the order they are given in the array
    */
  clone() {
    return new Call(this.serialNumberLength, this.serialNumbers.slice());
  }

  transform(transformations) {
    for (let transformation in transformations) {
      switch (transformations[transformation]) {
        case callTransformations.SHIFT:
          this.shift();
          break;
        case callTransformations.REVERSE:
          this.reverse();
          break;
        case callTransformations.INVERTCASE:
          this.invertCase();
          break;
        case callTransformations.REVERSE_ODD_INDICES:
          this.reverseOddIndices();
          break;
        case callTransformations.INVERTCASE_EVEN_INDICES:
          this.invertCaseEvenIndices();
          break;
        default:
          throw new Error(
            "Invalid transformation " + transformations[transformation]
          );
      }
    }
  }
  shift(value) {
    this.serialNumbers.map((serialNumber) => {
      let res = "";
    });
  }
  reverse() {
    this.serialNumbers.map((value) => {
      let rev = "";
      for (let i = value.length - 1; i >= 0; i--) {
        rev += value[i];
      }
      return rev;
    });
  }
  invertCase() {
    this.serialNumbers.map((value) => {
      let rev = "";
      for (let i = 0; i < value.length; i++) {
        if (value[i] === value[i].toUpperCase()) {
          rev += value[i].toLowerCase();
        } else {
          rev += value[i].toUpperCase();
        }
      }
      return rev;
    });
  }
  reverseOddIndices() {
    this.serialNumbers.map((value) => {
      let rev = "";
      for (let i = 0; i < value.length; i++) {
        if (i % 2 === 0) {
          rev += value[i];
        } else {
          rev += value[value.length - i - 1];
        }
      }
      return rev;
    });
  }
  invertCaseEvenIndices() {
    this.serialNumbers.map((value) => {
      let rev = "";
      for (let i = 0; i < value.length; i++) {
        if (i % 2 === 0) {
          rev += value[i].toUpperCase();
          if (value[i] === value[i].toUpperCase()) {
            rev += value[i].toLowerCase();
          } else {
            rev += value[i].toUpperCase();
          }
        }
      }
      return rev;
    });
  }
}

export function decodeCall(call, vcs) {
  if (!call || !vcs) {
    throw new Error("Call or vcs is undefined");
  }
  let result = "";
  for (let i = 0; i < call.serialNumbers.length; i++) {
    let sn = call.serialNumbers[i];
    let row = parseInt(sn.substring(0, call.serialNumberLength / 2));
    let col = parseInt(sn.substring(call.serialNumberLength / 2));
    result += vcs.matrix[row][col];
  }
  return result;
}
