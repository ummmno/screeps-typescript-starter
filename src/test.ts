let matrix: string[][] = [
  ["f", "f", "k", "j", "u", "h", "j", "h", "d", "q", "w", "e", "w", "j", "a", "o"],
  ["h", "h", "r", "t", "g", "y", "h", "v", "s", "f", "u", "l", "j", "j", "v", "y"],
  ["k", "h", "k", "j", "j", "h", "g", "b", "u", "y", "t", "j", "u", "b", "g", "t"],
  ["o", "j", "j", "u", "g", "v", "t", "u", "f", "h", "s", "h", "n", "f", "g", "h"],
  ["a", "o", "h", "h", "h", "f", "y", "a", "h", "j", "u", "m", "y", "n", "g", "k"],
  ["s", "l", "j", "n", "y", "t", "u", "y", "b", "j", "f", "y", "d", "s", "u", "g"],
  ["d", "a", "k", "b", "f", "g", "i", "s", "k", "g", "k", "h", "i", "i", "f", "d"],
  ["f", "s", "h", "g", "f", "r", "t", "g", "f", "g", "h", "i", "o", "j", "g", "o"],
  ["n", "d", "h", "h", "g", "k", "y", "d", "g", "l", "j", "u", "u", "a", "h", "j"],
  ["f", "j", "h", "y", "u", "k", "s", "b", "k", "k", "s", "h", "g", "i", "j", "y"],
  ["n", "f", "d", "j", "s", "a", "o", "l", "f", "d", "s", "a", "g", "g", "b", "o"],
  ["y", "h", "m", "k", "l", "d", "k", "n", "f", "f", "s", "y", "t", "h", "j", "y"],
  ["u", "f", "g", "h", "j", "i", "u", "h", "j", "n", "n", "y", "g", "y", "n", "j"],
  ["g", "h", "f", "v", "o", "h", "l", "h", "v", "n", "i", "f", "u", "t", "h", "h"],
  ["j", "j", "r", "f", "g", "u", "g", "d", "h", "o", "t", "o", "d", "f", "j", "j"],
  ["j", "j", "k", "b", "m", "k", "j", "h", "y", "u", "i", "o", "g", "n", "k", "n"]
];

let minitrix: string[][] = [
  ["a", "b", "c"],
  ["d", "e", "f"],
  ["g", "h", "i"]
];

let MATRIX = minitrix
let QUESTION: string = "dh";

function print_mat(a: any, x: any, y: any) {
  let out:string = ""
  for(let i = 0; i < x; i++)
  {
    for(let j = 0; j < y; j++)
    {
      out = out.concat(` ${a[i][j]}`)
    }
    out = out.concat(`\n`)
  }
  console.log(out)
}

function lookForStringRow(matrix: string[][], answer: string, shifted: number) {
  let attempt: string = "";
  for (let i = 0; i < matrix[0].length; i++) {
    for (let o = 0; o < matrix[0].length; o++) {
      //console.log(i, o)
      attempt = attempt.concat(matrix[i][o]);
    }
    let answerIndex: number = attempt.search(answer);
    if (answerIndex != -1) {
      if (shifted == 1) {
        return [i, answerIndex - i];
      } else if(shifted == -1){
        return [i, answerIndex + i];
      }else {
        return [i, answerIndex];
      }
    }
    attempt = "";
  }
  return null;
}

function lookForStringColumn(matrix: string[][], answer: string, shifted: number) {
  let attempt: string = "";
  for (let i = 0; i < matrix[0].length; i++) {
    for (let o = 0; o < matrix[0].length; o++) {
      //console.log(i, o)
      attempt = attempt.concat(matrix[o][i]);
    }
    let answerIndex: number = attempt.search(answer);
    if (answerIndex != -1) {
      if (shifted == 1) {
        return [i, answerIndex - i];
      } else if(shifted == -1){
        return [i, answerIndex + i];
      } else {
        return [answerIndex, i];
      }
    }
    attempt = "";
  }
  return null;
}

function matrixShiftRight(matrix: string[][]) {
  //matrix = Object.assign({}, xmatrix)
  for (let i = 1; i < matrix.length; i++) {
    matrix[i] = matrix[i].reverse();
    for (let o = 0; o < i; o++) {
      matrix[i] = matrix[i].concat("#");
    }
    matrix[i] = matrix[i].reverse();
    for (let o = 0; o < i; o++) {
      matrix[i].pop();
    }
  }
  return matrix;
}

function matrixShiftLeft(matrix: string[][]) {
  //matrix = Object.assign({}, xmatrix)
  for (let i = 1; i < matrix.length; i++) {
    for (let o = 0; o < i; o++) {
      matrix[i] = matrix[i].concat("-");
    }
    matrix[i] = matrix[i].reverse();
    for (let o = 0; o < i; o++) {
      matrix[i].pop();
    }
    matrix[i] = matrix[i].reverse();
  }
  return matrix;
}

function lookForColumnsRows(matrix: string[][], answer: string, shifted: number) {
  if (!shifted) {
    let a = lookForStringRow(matrix, answer, shifted);
    if (a != null) {
      console.log(a);
      return;
    }
  }

  let b = lookForStringColumn(matrix, answer, shifted);
  if (b != null) {
    console.log(b);
    return;
  }
}

function make_copy<T>(arr: Array<Array<T>>): Array<Array<T>> {
  let fresh: Array<Array<T>> = []
  arr.forEach(row => {
    fresh.push(row.slice())
  })
  return fresh
}

function lookFor(matrix: string[][], answer: string) {
  const matrixOrig = make_copy(matrix)

  print_mat(matrix, matrix.length, matrix[0].length)
  lookForColumnsRows(make_copy(matrix), answer, 0);

  matrix = matrixShiftRight(make_copy(matrixOrig));
  print_mat(matrix, matrix.length, matrix[0].length)
  lookForColumnsRows(matrix, answer, 1);

  matrix = matrixShiftLeft(make_copy(matrixOrig));
  print_mat(matrix, matrix.length, matrix[0].length)
  lookForColumnsRows(matrix, answer, -1);
}

lookFor(MATRIX, QUESTION);
