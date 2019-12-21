//TO-DO
//Fine-tune ideology labels - make them more accurate/in-depth
//THEN show them people/authors related to their ideology, link to books of their relavant works
//Test out alternate question strat (-1 for right wing Q)
//SMOOTH CIRCLES (AXES AND POINT LABEL) - the axis circle is particularly gritty
//FIGURE OUT WHY AXES WON'T MOVE ON SITE
//
//GETTING SOME DUPLICATES FROM PICKNEWQUESTIONS()
//GOING OFF EDGE AT TIMES
//shrink restart + previous buttons
//axes circles in different spot as dot
//uniformMatrix4fv error - reset gl canvas each time???
//----------------------------------------------------------------------------------------------------------------------

//Politicube Quiz
//33 questions per axis - each question relates to one category, answer pushes the user's score left or right for that axis

//                  Axis Label Info
// X: Cultural / -X = Progressive, +X = Traditionalist
// Y: Economic / -Y = Socialist, +Y = Capitalist
// Z: Authority / -Z = Anarchist, +Z = Authoritarian

//Possible responses and their associated weights
const StrongAgree = -0.294;
const StrongDisagree = 0.294;
const Agree = -0.15;
const Disagree = 0.15;

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
const canvas = document.getElementById('animation');
const xCanvas = document.getElementById("xAxis");
const yCanvas = document.getElementById("yAxis");
const zCanvas = document.getElementById("zAxis");
const xCaption = document.getElementById("xCaption");
const yCaption = document.getElementById("yCaption");
const zCaption = document.getElementById("zCaption");
const ideology = document.getElementById("ideology");

//Initialize the question bank (100 total -> 33 in each category + 1 neutral)
var questionBank = questions;

var sessionQuestions = []; //Questions given to user
var qNum = 0; //current question number
var numQs = questionBank.length - 1; //Number of total questions

var score = { //Track user's score
    cultural: 0.0,
    economic: 0.0,
    authoritarian: 0.0
};

start.addEventListener("click", startQuiz);
xCanvas.getContext("2d").translate(0.5, 0.5); //Adjust axes to straighten lines
yCanvas.getContext("2d").translate(0.5, 0.5);
zCanvas.getContext("2d").translate(0.5, 0.5);

//Selects a new, random set of questions for this quiz session
function pickNewQuestions() {
    console.log("Picking New Questions");

    var chosenQs = [];
    sessionQuestions = []; //reset the current session
    var index;

    //Select questions in a random order, avoiding repeats
    for (i = 0; i <= numQs; i++) {
        index = getRandomIndex();

        for (j = 0; j < sessionQuestions.length; j++) {
            if (sessionQuestions[j] === questionBank[index]) {
                console.log("Index " + index + " unsuccessful. Trying again.");
                index = getRandomIndex();
            }
        }
        console.log("Selected question " + index + " - placing in position " + i);
        sessionQuestions[i] = questionBank[index];
        sessionQuestions[i].userVal = 0; //Add a value to each object which keeps track of the question's score
    }
    console.log("Session questions selected!");
}

//Show the next question
function renderQuestion(qIndex) {
    //Stop the user from trying to access questions below zero
    if (qIndex < 0) qIndex = 0;

    //Grab and display a question
    qNum = qIndex;
    console.log("Showing question " + (qNum + 1));
    question.innerHTML = "<p>" + (qNum + 1) + ". " + sessionQuestions[qNum].text + "</p>";

    //Change text for neutral question (first one in question bank)
    if (sessionQuestions[qNum].text == questionBank[0].text) {
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

//Change the score once a question is answered - Ex: adjust(questionBank[3], Disagree)
function adjust(q, answer) {
    console.log("Answered question #" + (qNum + 1) + " with value " + answer);
    sessionQuestions[qNum].userVal = answer;

    //Render the next question
    if (qNum < numQs) {
        qNum++;
        renderQuestion(qNum);
    }
    else {
        calculateScore(); //Get the final score for the user
        showResults(); //Reveal the cube at long last
    }
}

//Return random index number between 0 and 99 (100 questions)
function getRandomIndex() {
    return Math.floor((Math.random() * 99));
}

//Run the quiz from the start with new questions
function startQuiz() {
    //Display quiz, hide cube
    start.style.display = "none";
    quiz.style.display = "block";
    restart.style.display = "none";
    previous.style.display = "block";
    cube.style.display = "none";

    //Select first question, reset question counter
    pickNewQuestions();
    qNum = 0;
    renderQuestion(0);
}

//Add up the scores for each question to get the user score
function calculateScore() {
    for (i = 0; i < numQs; i++) {
        q = sessionQuestions[i];
        //Adjust each axis based on response, round to two decimal places
        score.cultural = (Math.round((score.cultural + (q.C * q.userVal)) * 100) / 100);
        score.economic = (Math.round((score.economic + (q.E * q.userVal)) * 100) / 100);
        score.authoritarian = (Math.round((score.authoritarian + (q.A * q.userVal)) * 100) / 100);
    }
}

//End it all (For testing and to minimize headaches)
function skipToEnd() {
    start.style.display = "none";
    console.log("Generating random values");

    score.cultural = ((Math.random() * 20) - 10);
    score.economic = ((Math.random() * 20) - 10);
    score.authoritarian = ((Math.random() * 20) - 10);

    showResults();
    showAxes(score.cultural / 10, score.economic / 10, score.authoritarian / 10);
}

//Calculate the user's closest ideology (in the most convoluted, unintuitive way possible)
function getIdeology() {
    let C = score.cultural;
    let E = score.economic;
    let A = score.authoritarian;

    //Determine closest ideology, pick point color based on quadrant
    if (C < 0 && E < 0 && A < 0) { return "Progressive Communist"; } //bottom back left   = Progressive Anarchist Socialist
    if (C > 0 && E < 0 && A < 0) { return "Traditional Communist"; } //bottom back right  = Traditionalist Anarchist Socialist
    if (C < 0 && E > 0 && A < 0) { return "Progressive Anarcho-Capitalist"; } //top back left      = Progressive Anarchist Capitalist
    if (C > 0 && E > 0 && A < 0) { return "Traditional Anarcho-Capitalist"; } //top back right     = Traditionalist Anarchist Capitalist
    if (C < 0 && E < 0 && A > 0) { return "Progressive Authoritarian Socialist"; } //bottom front left  = Progressive Authoritarian Socialist
    if (C > 0 && E < 0 && A > 0) { return "Traditional Authoritarian Socialist"; } //bottom front right = Traditionalist Authoritarian Socialist
    if (C < 0 && E > 0 && A > 0) { return "Progressive Authoritarian Capitalist"; } //top front left     = Progressive Authoritarian Capitalist
    if (C > 0 && E > 0 && A > 0) { return "Traditional Authoritarian Capitalist"; } //top front right    = Traditionalist Authoritarian Capitalist
}
