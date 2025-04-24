let isQuizFinished = false; // 初始化測驗狀態
let table; // 儲存題目資料的表格
let currentQuestion = 0; // 初始化當前題目索引
let correctCount = 0; // 初始化答對題數
let wrongCount = 0; // 初始化答錯題數

function preload() {
  // 載入題目資料（請確保 'questions.csv' 檔案存在）
  table = loadTable('questions.csv', 'csv', 'header');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background("#ccd5ae");

  // 設定開始測驗按鈕
  startButton = createButton('開始測驗');
  startButton.position(windowWidth / 2 - 100, windowHeight / 2 - 40);
  startButton.style('font-size', '30px');
  startButton.style('background', 'linear-gradient(135deg, #f9c6c9, #f6a5c0)');
  startButton.style('border', 'none');
  startButton.style('border-radius', '50px');
  startButton.style('padding', '20px 40px');
  startButton.style('color', '#fff');
  startButton.style('box-shadow', '0px 8px 12px rgba(0, 0, 0, 0.3)');
  startButton.style('cursor', 'pointer');
  startButton.mousePressed(startQuiz);

  // 隱藏其他元素，直到按下開始按鈕
  radio = createRadio();
  radio.style('color', '#003049');
  radio.style('font-size', '20px');
  radio.position(windowWidth / 2 - 50, windowHeight / 2 + 20);
  radio.hide();

  inputBox = createInput('');
  inputBox.position(windowWidth / 2 - 100, windowHeight / 2 + 20);
  inputBox.size(200);
  inputBox.hide();

  submitButton = createButton('下一題');
  submitButton.position(windowWidth / 2 - 50, windowHeight / 2 + 100);
  submitButton.style('font-size', '20px');
  submitButton.style('background', 'linear-gradient(135deg, #a8dadc, #457b9d)');
  submitButton.style('border', 'none');
  submitButton.style('border-radius', '25px');
  submitButton.style('padding', '10px 20px');
  submitButton.style('color', '#fff');
  submitButton.style('box-shadow', '0px 4px 6px rgba(0, 0, 0, 0.2)');
  submitButton.style('cursor', 'pointer');
  submitButton.mousePressed(handleButtonClick);
  submitButton.hide();
}

function draw() {
  background("#e9edc9");

  fill("#fefae0");
  noStroke();

  let rectWidth = windowWidth / 2;
  let rectHeight = windowHeight / 2;
  let rectX = (windowWidth - rectWidth) / 2;
  let rectY = (windowHeight - rectHeight) / 2;

  // 繪製背景矩形
  rect(rectX, rectY, rectWidth, rectHeight);

  // 修改文字顏色為 #606c38
  fill("#606c38");
  textSize(35);
  textAlign(CENTER, CENTER);

  if (!isQuizFinished) {
    // 顯示當前題目
    text(table.getString(currentQuestion, 'question'), windowWidth / 2, windowHeight / 2 - 100);
  } else {
    // 測驗結束畫面
    textSize(40);
    text(`測驗結束！`, windowWidth / 2, windowHeight / 2 - 150);

    textSize(30);
    text(`結果總結：`, windowWidth / 2, windowHeight / 2 - 90);

    textSize(25);
    // 顯示答對題數和答錯題數在同一行，並增加間距
    textAlign(CENTER, CENTER);
    text(`答對題數: ${correctCount}   答錯題數: ${wrongCount}`, windowWidth / 2, windowHeight / 2 - 50);

    textSize(20);
    fill("#457b9d");
    // 將藍色文字移到中間
    text(`點擊「再試一次」重新開始測驗`, windowWidth / 2, windowHeight / 2 + 50);
  }

  textSize(25);
  fill("#606c38");
}

function startQuiz() {
  startButton.hide();
  radio.show();
  inputBox.hide();
  submitButton.show();
  currentQuestion = 0;
  loadQuestion(currentQuestion);
}

function handleButtonClick() {
  if (!isQuizFinished) {
    checkAnswer();

    if (currentQuestion < table.getRowCount() - 1) {
      currentQuestion++;
      loadQuestion(currentQuestion);
    } else {
      isQuizFinished = true;
      submitButton.html('再試一次');

      // 隱藏答案框
      radio.hide();
      inputBox.hide();

      // 清空最後一題的回饋文字
      resultText = "";
    }
  } else {
    resetQuiz();
  }
}

function checkAnswer() {
  let correctAnswer = table.getString(currentQuestion, 'correct');
  let answer;

  if (isFillInTheBlank) {
    // 如果是填空題，從文字框中取得答案
    answer = inputBox.value().trim();
    inputBox.value(''); // 清空文字框
  } else {
    // 如果是選擇題，從 radio 中取得答案
    answer = radio.value();
  }

  // 判斷答案是否正確
  if (answer === correctAnswer) {
    resultText = "答對了！";
    correctCount++;
  } else {
    resultText = `答錯了！正確答案是：${correctAnswer}`;
    wrongCount++;
  }
}

function resetQuiz() {
  currentQuestion = 0;
  correctCount = 0;
  wrongCount = 0;
  isQuizFinished = false;
  submitButton.html('下一題');
  loadQuestion(currentQuestion);
}

function loadQuestion(index) {
  if (index >= table.getRowCount()) {
    console.error("題目索引超出範圍！");
    return;
  }

  // 清空選項
  radio.html('');
  radio.hide(); // 隱藏選擇題的選項框
  inputBox.hide(); // 預設隱藏文字框
  isFillInTheBlank = table.getString(index, 'type') === 'fill';

  if (isFillInTheBlank) {
    // 如果是填空題，顯示文字框並設計樣式
    inputBox.show();
    inputBox.style('font-size', '20px'); // 增加字體大小
    inputBox.style('background', '#fefae0'); // 背景顏色
    inputBox.style('border', '2px solid #606c38'); // 增加邊框
    inputBox.style('border-radius', '15px'); // 圓角
    inputBox.style('padding', '10px'); // 增加內邊距
    inputBox.style('box-shadow', '0px 4px 6px rgba(0, 0, 0, 0.2)'); // 增加陰影
    inputBox.style('color', '#606c38'); // 修改文字顏色
    inputBox.style('text-align', 'center'); // 文字置中
    inputBox.size(300, 40); // 調整文字框的大小（寬度 300px，高度 40px）

    // 動態調整文字框的位置，讓其位於題目和按鈕之間
    let questionY = windowHeight / 2 - 100; // 題目位置
    let buttonY = windowHeight / 2 + 100; // 按鈕位置
    let inputBoxY = (questionY + buttonY) / 2; // 文字框位置在題目和按鈕之間
    inputBox.position(windowWidth / 2 - 150, inputBoxY);
  } else {
    // 如果是選擇題，顯示選項並設計樣式
    radio.show();
    radio.option('1', table.getString(index, 'option1'));
    radio.option('2', table.getString(index, 'option2'));
    radio.option('3', table.getString(index, 'option3'));
    radio.option('4', table.getString(index, 'option4'));

    // 設定選項樣式
    radio.style('color', '#606c38'); // 修改選項文字顏色
    radio.style('font-size', '24px'); // 增加字體大小
    radio.style('background', '#fefae0'); // 背景顏色
    radio.style('border', '2px solid #606c38'); // 增加邊框
    radio.style('border-radius', '15px'); // 圓角
    radio.style('padding', '15px'); // 增加內邊距
    radio.style('margin', '15px 0'); // 增加選項之間的垂直間距
    radio.style('width', '300px'); // 增加選項寬度
    radio.style('text-align', 'center'); // 文字置中

    // 調整選項框的位置，讓其位於題目和按鈕之間
    let questionY = windowHeight / 2 - 100; // 題目位置
    let buttonY = windowHeight / 2 + 100; // 按鈕位置
    let radioY = (questionY + buttonY) / 2; // 選項框位置在題目和按鈕之間
    radio.position(windowWidth / 2 - 150, radioY);
  }

  resultText = ""; // 清空結果文字
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // 動態調整文字框或選項框的位置
  let questionY = windowHeight / 2 - 100; // 題目位置
  let buttonY = windowHeight / 2 + 100; // 按鈕位置
  let inputBoxY = (questionY + buttonY) / 2; // 文字框位置
  let radioY = (questionY + buttonY) / 2; // 選項框位置

  inputBox.position(windowWidth / 2 - 150, inputBoxY);
  radio.position(windowWidth / 2 - 150, radioY);

  // 調整按鈕位置
  submitButton.position(windowWidth / 2 - 50, windowHeight / 2 + 100);
}
