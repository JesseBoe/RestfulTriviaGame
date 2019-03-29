var queryUrl = 'https://opentdb.com/api.php?amount=3&category=';
var triviaArray;
var timerId;
var currentQuestion = 0;

var correctAnswer;
var chosenAnswer;
var timeRemaining;

var right = 0;
var wrong = 0;
var timeouts = 0;
var wasRight;
var timedOut;

$('.result').hide();
$('.main').hide();

function newQuestion() {
	
	$('.main').show();
	$('.result').hide();
	$('#resetButton').hide();

	timeRemaining = 30;
	clearTimeout(timerId);
	timerId = setInterval(countDown, 1000);
	wasRight = false;
	timedOut = false;

	
    $('#questionText').text(htmlDecode(triviaArray[currentQuestion].question));
    if (triviaArray[currentQuestion].type == 'multiple') 
    {
		$('#bottomAnswers').show();
		var randPlace = Math.floor(Math.random() * 4);
		var count = 1;
        for (let i = 0; i < 4; i++) 
        {
			if (randPlace == i) {
				$('#' + count).text(htmlDecode(triviaArray[currentQuestion].correct_answer));
				correctAnswer = count;
			} else {
				$('#' + count).text(htmlDecode(triviaArray[currentQuestion].incorrect_answers.pop()));
			}
			count++;
		}
    }
    if (triviaArray[currentQuestion].type == 'boolean') 
    {
        $('#1').text('True');
		$('#2').text('False');
		if(triviaArray[currentQuestion].correct_answer == "True"){
			correctAnswer = 1;
		}
		else {
			correctAnswer = 2;
		} 
		$('#3').text('');
		$('#4').text('');
		$('#bottomAnswers').hide();		
    }
}

$('.answers').on('click', function() {
	var chosenAnswer = $(this);
	if ( chosenAnswer[0].id == correctAnswer ) {
		//Correct
		right++;
		wasRight = true;
		showResult();
	}
	else {
		//Wrong
		wrong ++;
		wasRight = false;
		showResult();
	}
});

$('.chooseSubject').on('click', function(){
	queryUrl += $(this).attr("value");

	$.ajax({
		url: queryUrl,
		method: 'GET'
	}).then(function(response) {
		triviaArray = response.results;
		$('.start').hide();
		newQuestion();
		//Cheat sheet
		// console.log(triviaArray);
	});
})

$('#resetButton').on('click', function(){
	$('#resetButton').hide();
	reset();
})

function countDown(){
	timeRemaining--;
	$('#timeRemaining').text("Time Remaining: " + timeRemaining);
	if ( timeRemaining == 0 ) {
		clearInterval(timerId);
		timeouts++;
		timedOut = true;
		showResult();
	}
}

function reset(){
	clearTimeout(timerId);
	$('.result').hide();
	$('.main').hide();
	$('.start').show();

	queryUrl = 'https://opentdb.com/api.php?amount=3&category=';
	currentQuestion = 0;
	right = 0;
	wrong = 0;
	timeouts = 0;
	triviaArray = [];
	$('#correct').text("Correct: " + right);
	$('#incorrect').text("Incorrect: " + wrong);
	$('#noGuess').text("Time outs: " + timeouts);
	$('#correctAnswer').text("");
	$('#questionText').text("");
}

function showResult() {
	$('.main').hide();
	$('.result').show();

	clearInterval(timerId);
	$('#timeRemaining').text('Time Remaining: 30');

	if (timedOut) {
		$('#wasCorrect').text("Timed Out!");
		$('#correctAnswer').text("");
	}
	else if (wasRight) {
		$('#wasCorrect').text("Correct!");
		$('#correctAnswer').text("");
	}
	else {
		$('#wasCorrect').text("Incorrect");
		$('#correctAnswer').text('The correct answer was: ' + htmlDecode(triviaArray[currentQuestion].correct_answer));
	}

	$('#correct').text("Correct: " + right);
	$('#incorrect').text("Incorrect: " + wrong);
	$('#noGuess').text("Time outs: " + timeouts);

	currentQuestion++;
	if (currentQuestion >= triviaArray.length) {
		//Game ends.
		$('#resetButton').show();
	}
	else {
		//Next question
		timerId = setTimeout(newQuestion, 3000);
	}
}

// From what I read this is the cleanest way to do this.
function htmlDecode(value) {
	return $("<textarea/>").html(value).text();
  }
