const rpmLowInput = document.querySelector("#rpm-low");
const rpmMediumInput = document.querySelector("#rpm-medium");
const rpmHighInput = document.querySelector("#rpm-high");

const frLow1Input = document.querySelector("#fr1-low");
const frMedium1Input = document.querySelector("#fr1-medium");
const frHigh1Input = document.querySelector("#fr1-high");

const frLow2Input = document.querySelector("#fr2-low");
const frMedium2Input = document.querySelector("#fr2-medium");
const frHigh2Input = document.querySelector("#fr2-high");

const frLow3Input = document.querySelector("#fr3-low");
const frMedium3Input = document.querySelector("#fr3-medium");
const frHigh3Input = document.querySelector("#fr3-high");

const rpmLow = parseFloat(rpmLowInput.value || rpmLowInput.placeholder);
const rpmMedium = parseFloat(
  rpmMediumInput.value || rpmMediumInput.placeholder
);
const rpmHigh = parseFloat(rpmHighInput.value || rpmHighInput.placeholder);

const frLow1 = parseFloat(frLow1Input.value);
const frLow2 = parseFloat(frLow2Input.value);
const frLow3 = parseFloat(frLow3Input.value);

const frMedium1 = parseFloat(frMedium1Input.value);
const frMedium2 = parseFloat(frMedium2Input.value);
const frMedium3 = parseFloat(frMedium3Input.value);

const frHigh1 = parseFloat(frHigh1Input.value);
const frHigh2 = parseFloat(frHigh2Input.value);
const frHigh3 = parseFloat(frHigh3Input.value);

const data = {
  x: [],
  y: [],
};

const utils = {
  sum: (arr) => arr.reduce((total, amount) => total + amount),
  avg: (arr) => utils.sum(arr) / arr.length,
};

const LinearRegression = (data) => {
  let x_avg, // average of independent variable x
    y_avg, // average of dependent variable y
    num, // numerator : Sum of (xi - x)(yi - y)
    den, // denominator : (xi - x)**2
    m, // slope
    b, // intercept
    sse; // the sum of squared error: sum of (y - (mx + b))

  x_avg = utils.avg(data.x);

  y_avg = utils.avg(data.y);
  num = utils.sum(data.x.map((x, i) => (x - x_avg) * (data.y[i] - y_avg)));
  den = utils.sum(data.x.map((x) => (x - x_avg) ** 2));

  if (num === 0 && den === 0) {
    m = 0;
    // b = data.x[0];
    b = 0;
  } else {
    m = num / den;
    // b = y_avg - m * x_avg;
    b = 0;
  }

  sse = utils.sum(data.y.map((y, i) => (y - (m * data.x[i] + b)) * 2));

  return {
    slope: m,
    intercept: b,
    y: `${m}x + ${b}`,
    SSE: `${sse}`,
  };
};

function rSquared(x, y, coefficients) {
  // y = coeffcients[0] + coeffcients[1] * x;
  let regressionSquaredError = 0;
  let totalSquaredError = 0;

  function yPrediction(x, coefficients) {
    return coefficients[0] + coefficients[1] * x;
  }

  let yMean = y.reduce((a, b) => a + b) / y.length;

  for (let i = 0; i < x.length; i++) {
    regressionSquaredError += Math.pow(
      y[i] - yPrediction(x[i], coefficients),
      2
    );
    totalSquaredError += Math.pow(y[i] - yMean, 2);
  }

  return 1 - regressionSquaredError / totalSquaredError;
}

tmpY = [
  frLow1,
  frMedium1,
  frHigh1,
  frLow2,
  frMedium2,
  frHigh2,
  frLow3,
  frMedium3,
  frHigh3,
];

let tmpX = [rpmLow, rpmMedium, rpmHigh];
tmpX = tmpX.concat(tmpX, tmpX);

for (let i = 0; i < tmpY.length; i++) {
  if (!isNaN(tmpY[i])) {
    data.x = [...data.x, tmpX[i]];
    data.y = [...data.y, tmpY[i]];
  }
}

console.log(data.x);
console.log(data.y);

console.log(LinearRegression(data));
console.log(
  rSquared(data.x, data.y, [
    LinearRegression(data).intercept,
    LinearRegression(data).slope,
  ])
);

result = LinearRegression(data);

const axes = document.querySelector("#axes");

const trace1 = {
  x: data.x,
  y: data.y,
  mode: "markers",
  type: "scatter",
};

const trace2 = {
  x: data.x,
  y: data.x.map((x) => x * result.slope + result.intercept),
  mode: "lines+markers",
  type: "scatter",
};

Plotly.newPlot(axes, [trace1, trace2]);
