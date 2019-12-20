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
const StrongAgree = -0.29;
const StrongDisagree = 0.29;
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
//Affirmative -> right wing = -1, affirmative -> left wing = +1 - TRY THIS OUT
var questionBank = [
    //Neutral question
    {
        text: "How would you best classify your political beliefs?",
        C: 1,
        E: 1,
        A: 1,
    },

    //Cultural questions
    {
        text: "Blasphemy laws have no place in modern governance.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Faith-based institutions should have their tax-exempt status revoked.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "The government should not be able to interfere with personal relationships between consenting adults.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Laws regulating sexual practices between consenting adults have no place in modern governance.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Abortion should be legal in all or most cases.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "If there is no victim, then no crime has been committed.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Marijuana should be legalized.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Psychedelic drugs should be legalized.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Heroin should be legalized.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Suicide should be legal.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Euthinasia should be legal.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Just because something is legal, that does not make it morally right.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "A just society cannot allow prisons.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Prisons should be used for rehabilitation rather than punishment.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "The government should be allowed to prosecute parents that abuse their children.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "In order to support my country, it needs to act in a morally righteous way.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Countries are not inherently better or worse than each other, only different.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Races are not inherently better or worse than each other, only different.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Cultures are not inherently better or worse than each other, only different.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Child adoption should prioritize stable couples, regardless of sexual orientation.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Adults should be allowed to consume legal pornography.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Hate speech should not be considered free speech.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "The death penalty should be illegal.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Convicted pedophiles should not be chemically castrated.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Convicted rapists should not be chemically castrated.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "The enemy of my enemy is not necessarily my friend.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Church and state should be separate.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Evolution should be taught over creationism in public schools.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Diversity is our strength.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Immigrants are a net positive for our country.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Marriage is not just between a man and a woman.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Morality is not connected to being religious.",
        C: 1,
        E: 0,
        A: 0,
    },
    {
        text: "Women should be allowed in combat roles in the military.",
        C: 1,
        E: 0,
        A: 0,
    },

    //Econ questions
    {
        text: "The government does a better job than the market at providing internet access.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "The government does a better job than the market of providing emergency services.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "Strict regulations on labor, products, and profits are required to protect the poor from the rich.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "To be preserved, natural resources need to be regulated by the government.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "Corporations will not willingly protect the environment, so they need to be incentivized to do so through government regulation.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "The government should subsidize energy production.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "Government budgets should be balanced by raising taxes rather than by curbing expenditures.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "A central bank is required for a well functioning economy.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "Money is not required for a well functioning economy.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "The means of production should be shared among all workers.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "Businesses should be subsidized or bailed out through government intervention.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "Collective bargaining between employers and employees through a union should be required by law.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "The government should require all workers to join a union to be employed.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "Collective bargaining is necessary to prevent the unethical exploitation of workers.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "The government does a better job than the market of providing education.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "Health insurance companies require government regulation to prevent them from unfairly profiting off of unwell and terminally ill citizens.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "The government does a better job than the market of providing healthcare.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "The government does a better job than the market of providing age pensions.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "Government welfare is preferable to charity to help those who need it.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "Government welfare is necessary to reduce poverty.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "Free trade should not be a goal the government strives for.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "The government should have rules and regulations around trade.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "The government should do more to help the disadvantaged.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "Preserving the environment is worth any costs to the economy.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "Globalization should serve humanity first and corporations second.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "Some government services are worth operating even if they operate at a loss.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "Cryptocurrencies should be regulated to prevent abuse.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "Parents should bear the monetary cost of educating children, not the government.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "Taxation is not theft.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "Drug tests should not be required to receive welfare.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "Jobs that only manipulate money contribute nothing to society.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "Class divides people more than any other characteristic.",
        C: 0,
        E: 1,
        A: 0,
    },
    {
        text: "\"From each according to his ability, to each according to his needs\" is a valid phrase.",
        C: 0,
        E: 1,
        A: 0,
    },

    //Authority questions
    {
        text: "Every individual has natural rights that cannot be violated.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "All individuals have the right to voluntarily ingest or consume whatever they see fit.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "Slavery is not an acceptable punishment for a crime.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "The government should protect freedom of expression for all content and viewpoints.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "Privacy is a necessary obstacle to ensure rights are respected by law enforcement.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "Transparency is a crucial tool to prevent abuses of government power.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "Expanded government surveillance to fight crime is not worth the cost if it violates privacy.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "Requiring the police to get a search warrant is necessary to ensure liberty is not violated.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "The government should only enforce laws regarding the violation of an individual\'s property or personal rights.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "Due process and the presumption of innocence are necessary to ensure true justice is carried out. ",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "The government should exclusively use force to defend individuals\' rights to life, liberty, and property.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "Individuals have the right to self-defense, up to and including lethality.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "Individuals have the right to privately keep and use firearms.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "If individuals exercise their right to self defense they should not be prosecuted.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "Freedom of association is an inalienable right.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "Oversight and transparency are a necessary safeguard to ensure that intelligence agencies carry out proper justice.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "Borders only serve to enable governments that wish to deny individuals freedom from tyranny.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "\"The tree of liberty must be refreshed from time to time, with the blood of patriots and tyrants.\" is a valid statement.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "The government should not make laws regarding any individual\'s right to have children.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "The justice system should be handled by the government.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "Service in the military should not be compulsory.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "The head of state should have not have unilateral control over the military.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "Even during wartime, human rights are inalienable.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "The government has no good reason to monitor communication between its citizens.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "The government should not discriminate in its treatment of different faiths.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "The government should not discriminate on the basis of anything other than merit.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "Liberty is more valuable than security.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "The state existing is the biggest threat to my liberties.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "The only legitimate purpose of the state is to get rid of itself.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "Foreign policy should place diplomacy above military action when trying to resolve issues.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "Military intervention should be a last resort when conducting foreign policy.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "The military budget should be reduced.",
        C: 0,
        E: 0,
        A: 1,
    },
    {
        text: "The military should act in accordance with international law.",
        C: 0,
        E: 0,
        A: 1,
    }
];

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