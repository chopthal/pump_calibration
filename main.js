const calculateButton = document.querySelector(".calc-btn");
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

const targetFr1Input = document.querySelector("#target-fr1");
const targetFr2Input = document.querySelector("#target-fr2");
const targetFr3Input = document.querySelector("#target-fr3");
const targetFr4Input = document.querySelector("#target-fr4");
const targetFr5Input = document.querySelector("#target-fr5");

const resultRpm1Input = document.querySelector("#result-rpm1");
const resultRpm2Input = document.querySelector("#result-rpm2");
const resultRpm3Input = document.querySelector("#result-rpm3");
const resultRpm4Input = document.querySelector("#result-rpm4");
const resultRpm5Input = document.querySelector("#result-rpm5");

const resultEquationInput = document.querySelector(".result-eq");
const resultRsquareInput = document.querySelector(".result-rsq");

const includingCheckbox = document.querySelector("#including-checkbox");

const utils = {
  sum: (arr) => arr.reduce((total, amount) => total + amount),
  avg: (arr) => utils.sum(arr) / arr.length,
};

const linearRegression = (data) => {
  let xAvg, // Avg of independent variable x
    yAvg, // Avg of dependent variable y
    num, // numerator : Sum of (xi - x)(yi - y)
    den, // denominator : (xi - x)**2
    m, // slope
    b = 0, // intercept
    ssr, // the sum of squared error: sum of (y - (mx + b))
    sst, // total sum of squares
    rSq; // R-square

  xAvg = utils.avg(data.x);
  yAvg = utils.avg(data.y);
  num = utils.sum(data.x.map((x, i) => (x - xAvg) * (data.y[i] - yAvg)));
  den = utils.sum(data.x.map((x) => (x - xAvg) ** 2));

  if (num === 0 && den === 0) {
    m = 0;
    if (!includingCheckbox.checked) {
      b = data.x[0];
    }
  } else {
    m = num / den;
    if (!includingCheckbox.checked) {
      b = yAvg - m * xAvg;
    }
  }

  ssr = utils.sum(data.y.map((y, i) => Math.pow(y - (m * data.x[i] + b), 2)));
  sst = utils.sum(data.y.map((y) => Math.pow(y - yAvg, 2)));
  rSq = 1 - ssr / sst;

  return {
    slope: m,
    intercept: b,
    y: `${m}x + ${b}`,
    rSq,
  };
};

calculateButton.addEventListener("click", (event) => {
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

  const targetFr1 = parseFloat(
    targetFr1Input.value || targetFr1Input.placeholder
  );
  const targetFr2 = parseFloat(
    targetFr2Input.value || targetFr2Input.placeholder
  );
  const targetFr3 = parseFloat(
    targetFr3Input.value || targetFr3Input.placeholder
  );
  const targetFr4 = parseFloat(
    targetFr4Input.value || targetFr4Input.placeholder
  );
  const targetFr5 = parseFloat(
    targetFr5Input.value || targetFr5Input.placeholder
  );

  const data = {
    x: [],
    y: [],
  };

  const tmpY = [
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

  if (
    (Array.isArray(data.x) && data.x.length == 0) ||
    (Array.isArray(data.y) && data.y.length == 0)
  ) {
    return;
  }

  if (includingCheckbox.checked) {
    data.x = [0, ...data.x];
    data.y = [0, ...data.y];
  }

  result = linearRegression(data);

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

  resultRpm1Input.value = (
    (targetFr1 - result.intercept) /
    result.slope
  ).toFixed(1);
  resultRpm2Input.value = (
    (targetFr2 - result.intercept) /
    result.slope
  ).toFixed(1);
  resultRpm3Input.value = (
    (targetFr3 - result.intercept) /
    result.slope
  ).toFixed(1);
  resultRpm4Input.value = (
    (targetFr4 - result.intercept) /
    result.slope
  ).toFixed(1);
  resultRpm5Input.value = (
    (targetFr5 - result.intercept) /
    result.slope
  ).toFixed(1);

  resultEquationInput.innerHTML = `Y = ${result.slope.toFixed(
    2
  )}X + ${result.intercept.toFixed(2)}`;
  resultRsquareInput.innerHTML = result.rSq.toFixed(2);
});
