//TO-DO
//Fine-tune ideology labels - make them more accurate/in-depth
//THEN show them people/authors related to their ideology, link to books of their relavant works
//Test out alternate question strat (-1 for right wing Q)
//SMOOTH CIRCLES (AXES AND POINT LABEL) - the axis circle is particularly gritty
//
//GETTING SOME DUPLICATES FROM PICKNEWQUESTIONS() !!!!!!!!!!!
//GOING OFF EDGE AT TIMES - fix values
//shrink restart + previous buttons
//axes circles in different spot as dot
//Make axes images?
//-----------------------------------------------------------------------------------------------

//Politicube Quiz
//33 questions per axis - each question relates to one category, answer pushes the user's score left or right for that axis

//                 Axis Label Info
// X: Cultural / -X = Progressive, +X = Traditionalist
// Y: Economic / -Y = Socialist, +Y = Capitalist
// Z: Authority / -Z = Anarchist, +Z = Authoritarian

//Possible responses and their associated weights
const StrongAgree = -0.2941;
const StrongDisagree = 0.2941;
const Agree = -0.14705;
const Disagree = 0.14705;

//Grab HTML elements
const start = document.getElementById("start");
const quiz = document.getElementById("quiz");
const previous = document.getElementById("previous");
const restart = document.getElementById("restart");
const question = document.getElementById("question");
const choiceSA = document.getElementById("SA");
const choiceSD = document.getElementById("SD");
const choiceA = document.getElementById("A");
const choiceD = document.getElementById("D");
const resultsBtn = document.getElementById("results");

//Initialize the question bank (100 total -> 33 in each category + 1 neutral)
var questionBank = questionList;

var sessionQuestions = []; //Questions given to user
var current = 0; //Current question number
var numQs = questionBank.length - 1; //Number of total questions
start.addEventListener("click", startQuiz);

//Track user's score
var score = {
    cultural: 0.0,
    economic: 0.0,
    authoritarian: 0.0
};

//Selects a new, random set of questions for this quiz session
function pickNewQuestions() {
    console.log("Picking new questions");

    sessionQuestions = []; //Reset the current session
    var index;

    //Select questions in a random order, avoiding repeats
    for (let i = 0; i <= numQs; i++) {
        index = getRandomIndex();

        for (let j = 0; j < sessionQuestions.length; j++) {
            if (sessionQuestions[j] === questionBank[index]) {
                console.log("Index " + index + " unsuccessful. Trying again.");
                index = getRandomIndex();
            }
        }
        console.log("Selected question " + index + " - placing in position " + i);
        sessionQuestions[i] = questionBank[index];
        sessionQuestions[i].userVal = 0.0; //Add a value to each object which keeps track of the question's score
    }
    console.log("Session questions selected!");
}

//Show the next question
function renderQuestion(qIndex) {
    //Stop the user from trying to access questions below zero
    if (qIndex < 0) qIndex = 0;

    //Grab and display a question
    current = qIndex;
    console.log("Showing question " + (current + 1));
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

//Change the score once a question is answered
function adjust(answer) {
    console.log("Answered question #" + (current + 1) + " with value " + answer);
    sessionQuestions[current].userVal = answer;

    //Render the next question
    if (current < numQs) {
        nextQuestion();
    }
    else {
        calculateScore(); //Get the final score for the user
        resultsBtn.style.display = "block"; //Show the 'view results' button
    }
}

//Go to the previous question
function previousQuestion() {
    renderQuestion(--current);
}

//Go to the next question
function nextQuestion() {
    renderQuestion(++current);
}

//Return random index number between 0 and 99 (100 questions)
function getRandomIndex() {
    return Math.floor((Math.random() * 99));
}

//Run the quiz from the start with new questions
function startQuiz() {
    //Display quiz
    start.style.display = "none";
    restart.style.display = "none";
    quiz.style.display = "block";
    previous.style.display = "block";

    //Select first question, reset question counter
    pickNewQuestions();
    current = 0;
    renderQuestion(0);
}

//Add up the scores for each question to get the user score
function calculateScore() {
    var q;
    for (let i = 0; i < numQs; i++) {
        q = sessionQuestions[i];
        //Adjust each axis based on response, round to two decimal places
        score.cultural = (Math.round((score.cultural + (q.C * q.userVal)) * 100) / 100);
        score.economic = (Math.round((score.economic + (q.E * q.userVal)) * 100) / 100);
        score.authoritarian = (Math.round((score.authoritarian + (q.A * q.userVal)) * 100) / 100);
    }
}

//Send the user to the results page
function seeResults() {
    window.location = 'http://127.0.0.1:3000/results?c=' + score.cultural + '&e=' + score.economic + '&a=' + score.authoritarian;
}

//End it all (For testing and to minimize headaches)
function skipToEnd() {
    start.style.display = "none";
    console.log("Generating random values");

    score.cultural = ((Math.random() * 20) - 10);
    score.economic = ((Math.random() * 20) - 10);
    score.authoritarian = ((Math.random() * 20) - 10);

    seeResults();
}
