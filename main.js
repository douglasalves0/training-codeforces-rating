function sigmoid(x){
    return Math.exp(x) / (Math.exp(x) + 1)
};

const HARD_PROBLEM_CONSTANT = 35;
const RANKINGS_RATINGS = [
    0,
    400,
    800,
    1200,
    1600,
    2000,
    2400,
    2700,
    4000
];
const RANKINGS_NAMES = [
    "Sleepy",
    "Lazy",
    "Awake",
    "Worker",
    "Hard Worker",
    "Tryhard",
    "Insane",
    "Psycho",
    "WTF"
];
const RANKINGS_LABELS = [
    "user-gray",
    "user-green",
    "user-cyan",
    "user-blue",
    "user-violet",
    "user-yellow",
    "user-red",
    "user-legendary"
];

function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open('GET', theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

var currentUrl = window.location.href;
var p = currentUrl.length - 1;
var username = ''

while(currentUrl[p] != '/'){
    username += currentUrl[p];
    p--;
}

var username = username.split("").reverse().join("")
var body = httpGet("https://codeforces.com/api/user.status?handle=" + username + "&from=1&count=1800")
var body2 = httpGet("https://codeforces.com/api/user.info?handles=" + username)

body = JSON.parse(body);
body2 = JSON.parse(body2);

var userRating = body2.result[0].rating;

var lastMonth = new Date();
lastMonth.setDate(lastMonth.getDate() - 30);

var ratingAcum = 0;
body.result.forEach((submission) => {
    var submissionTime = new Date(submission.creationTimeSeconds * 1000);
    if(submissionTime < lastMonth) return;
    if(submission.verdict != "OK") return;
    var problemRating = submission.problem.rating;
    if(!problemRating) problemRating = userRating;
    ratingAcum += sigmoid(
        (problemRating - userRating) / 100
    ) * HARD_PROBLEM_CONSTANT;
});

ratingAcum = Math.round(ratingAcum);

var rankingIdx = 0
while(RANKINGS_RATINGS[rankingIdx+1] <= ratingAcum){
    rankingIdx++;
}

ranking = document.querySelector(".user-rank")
ranking.innerHTML += '/ <span class="' + RANKINGS_LABELS[rankingIdx] + '">' + RANKINGS_NAMES[rankingIdx] + '</span>'

info = document.querySelector(".info");

var ul = info.children[1];
var li = document.createElement("li");
var newli = `
    <img style="vertical-align:middle;margin-right:0.5em;" src="//codeforces.com/codeforces.org/s/85512/images/icons/rating-24x24.png" alt="User's training rating in Codeforces community" title="User's training rating in Codeforces community">
    Training rating (Month):
    <span style="font-weight:bold;" class="` + RANKINGS_LABELS[rankingIdx] + `">` + ratingAcum + `</span>
    <span class="smaller"> (+` + (RANKINGS_RATINGS[rankingIdx+1] - ratingAcum) + ` to <span style="font-weight:bold;" class="` + RANKINGS_LABELS[rankingIdx+1] + `">` + RANKINGS_NAMES[rankingIdx+1] + `</span>) </span>
`;
li.innerHTML = newli;
console.log(newli);
ul.insertBefore(li, ul.children[1]);