//TO-DO
    //Fine-tune ideology labels - make them more accurate/in-depth
    //THEN show them people/authors related to their ideology, link to books of their relevant works
    //Create an example cube which shows a bunch of important figures side by side - put on "The Cube" page
    //Test out alternate question strat (-1 for right wing Q, +1 (affirmative) for left wing)
    //SMOOTH score point on cube
    //
//BUGS
//----------------------------------------------------------------------------------------------------------

//Politicube Quiz
//33 questions per axis - each question relates to one category, answer pushes the user's score left or right for that axis

//                 Axis Label Info
// X: Cultural / -X = Progressive, +X = Traditionalist
// Y: Economic / -Y = Socialist, +Y = Capitalist
// Z: Authority / -Z = Anarchist, +Z = Authoritarian

//Possible responses and their associated weights
const StrongAgree = -0.02941;
const StrongDisagree = 0.02941;
const Agree = -0.014705;
const Disagree = 0.014705;

//Grab HTML elements
const start = document.getElementById("start");
const quiz = document.getElementById("quiz");
const previous = document.getElementById("previous");
const next = document.getElementById("next");
const alert = document.getElementById("alert");
const restart = document.getElementById("restart");
const question = document.getElementById("question");
const choiceSA = document.getElementById("SA");
const choiceSD = document.getElementById("SD");
const choiceA = document.getElementById("A");
const choiceD = document.getElementById("D");
const resultsBtn = document.getElementById("results");

var questionBank = questionList; //Initialize the question bank (100 total -> 33 in each category + 1 neutral)
var sessionQuestions = []; //Unique, randomly ordered set of questions for this session
var current; //Current question index
var numQs = questionBank.length; //Number of total questions
var listRevealed = false;

//Track user's score
var score = {
    cultural: 0.0,
    economic: 0.0,
    authoritarian: 0.0
};

//Run the quiz from the start with new questions
function startQuiz() {
    //Display quiz, hide start button and results button
    quiz.style.display = "inline-block";
    start.style.display = "none";
    resultsBtn.style.display = "none";

    //Start at the beginning
    console.log('Starting Quiz!');
    alert.innerHTML = ' ';
    current = 0;

    //Select new questions
    pickNewQuestions();
    renderQuestion();
}

//Select a new, random set of questions for this quiz session
function pickNewQuestions() {
    //Reset the current session if one exists
    sessionQuestions = [];
    var index;

    //Select questions in a random order, avoiding repeats
    for (let i = 0; i < numQs; i++) {
        index = getRandomIndex();

        while (sessionQuestions.includes(questionBank[index])) {
            index = getRandomIndex();
        }
        sessionQuestions[i] = questionBank[index];
        sessionQuestions[i].userVal = 0.0; //Add a value to each question which keeps track of its score
    }
}

//Display a particular question
function renderQuestion() {
    //Change the question text
    question.innerHTML = "<p>" + (current + 1) + ". " + sessionQuestions[current].text + "</p>";

    //Change text for neutral question (first one in question bank)
    if (sessionQuestions[current].text === questionBank[0].text) {
        choiceSA.innerHTML = "Far-Left";
        choiceSD.innerHTML = "Far-Right";
        choiceA.innerHTML = "Center-Left";
        choiceD.innerHTML = "Center-Right";
    }
    else {
        choiceSA.innerHTML = "Strongly Agree";
        choiceSD.innerHTML = "Strongly Disagree";
        choiceA.innerHTML = "Agree";
        choiceD.innerHTML = "Disagree";
    }
}

//Change a question's score once it's answered
function adjust(answer) {
    sessionQuestions[current].userVal = answer;
    if (listRevealed) {
        getRemaining();
    }
    nextQuestion();
}

//Go to the next question
function nextQuestion() {
    //If questions remain, go the next one
    if (current < (numQs - 1)) {
        current++;
        renderQuestion();
    }
    //Once the last question is reached, see if any are unanswered
    else {
        getRemaining();
        listRevealed = true;
    }
}

//Find all incomplete questions
function getRemaining() {
    var remaining = [];
    var msg = '';
    var val;

    //See which are unfinished
    for (let i = 0; i < numQs; i++) {
        if (sessionQuestions[i].userVal === 0.0) {
            remaining.push(i);
        }
    }
    var len = remaining.length;
    var plural = (len < 2) ? ' ' : 's ';

    //If all questions are completed, show the 'view results' button
    if (len === 0) {
        console.log('Quiz Complete!');
        alert.innerHTML = 'Quiz Complete!';
        resultsBtn.style.display = 'inline-block';
    }
    //Put the unfinished question numbers in a formatted list
    else {    
        for (let j = 0; j < len; j++) {
            val = (remaining[j] + 1);
            if (j === 0)
                msg += val;
            else if (j < (len - 1))
                msg += ', ' + val;
            else if (len === 2)
                msg += ' and ' + val
            else
                msg += ', and ' + val;
        }
        alert.innerHTML = 'Please answer question' + plural + msg; //Change the alert text
    }
}

//Go to the previous question
function previousQuestion() {
    if (current > 0) {
        current--;
        renderQuestion();
    }
}

//Return random index number between 0 and 99 (100 questions)
function getRandomIndex() {
    return Math.floor(Math.random() * numQs);
}

//Add up the scores for each question
function calculateScore() {
    var q;
    for (let i = 0; i < numQs; i++) {
        q = sessionQuestions[i];
        //Adjust each axis based on response
        score.cultural = roundScore(score.cultural + (q.C * q.userVal));
        score.economic = roundScore(score.economic + (q.E * q.userVal));
        score.authoritarian = roundScore(score.authoritarian + (q.A * q.userVal));
    }
}

//Round the score to 3 digits
function roundScore(val) {
    var precision = 3;
    return Number((val).toFixed(precision));
}

//Send the user to the results page
function seeResults() {
    window.location = 'http://127.0.0.1:3000/results?c=' + score.cultural + '&e=' + score.economic + '&a=' + score.authoritarian;
}

//End it all (For testing and to minimize headaches)
function skipToEnd() {
    
    function randomScore() {
        return roundScore((Math.random() * 2.0) - 1.0); //Between -1 and 1
    }

    console.log("Generating random values");
    score.cultural = randomScore();
    score.economic = randomScore();
    score.authoritarian = randomScore();
    seeResults();
}
