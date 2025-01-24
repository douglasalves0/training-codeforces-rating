var currentUrl = window.location.href;
var p = currentUrl.length - 1;
var username = "";

while (currentUrl[p] != "/") {
  username += currentUrl[p];
  p--;
}

var username = username.split("").reverse().join("");
var body = httpGet(
  `${PREFIX_URL}/user.status?handle=` + username + "&from=1&count=1800"
);
var body2 = httpGet(`${PREFIX_URL}/user.info?handles=` + username);

body = JSON.parse(body);
body2 = JSON.parse(body2);

var userRating = body2.result[0].rating;

var lastMonth = new Date();
lastMonth.setDate(lastMonth.getDate() - 30);

var ratingAcum = 0;
var seemProblems = new Set();
body.result.forEach((submission) => {
  var submissionTime = new Date(submission.creationTimeSeconds * 1000);
  if (submissionTime < lastMonth) return;
  if (submission.verdict != "OK") return;
  const pData = submission.problem;
  const pId = { cId: pData.contestId, pIndex: pData.index };
  if (seemProblems.has(pId)) {
    console.log(`already seem ${pId}`);
    return;
  }
  seemProblems.add(pId);
  var problemRating = pData.rating;
  if (!problemRating) problemRating = userRating;
  ratingAcum +=
    sigmoid((problemRating - userRating) / 100) * HARD_PROBLEM_CONSTANT;
});

var rankingIdx = 0;
while (RANKINGS_RATINGS[rankingIdx + 1] <= ratingAcum) {
  rankingIdx++;
}

const uLabel = RANKINGS_LABELS[rankingIdx];
const uNextLabel = RANKINGS_LABELS[rankingIdx + 1];
const uRanking = RANKINGS_NAMES[rankingIdx];
const uNextRanking = RANKINGS_NAMES[rankingIdx + 1];
const uRating = Math.round(ratingAcum);
const uNextRating = RANKINGS_RATINGS[rankingIdx + 1];

ranking = document.querySelector(".user-rank");
ranking.innerHTML += ` / <span class="${uLabel}">${uRanking}</span>`;

info = document.querySelector(".info");

var ul = info.children[1];
var li = document.createElement("li");
var newli = `
    <img style="vertical-align:middle;margin-right:0.5em;" src="//codeforces.com/codeforces.org/s/85512/images/icons/rating-24x24.png" alt="User's training rating in Codeforces community" title="User's training rating in Codeforces community">
    Training rating (Month):
    <span style="font-weight:bold;" class="${uLabel}">${uRating}</span>
    <span class="smaller">(+${
      uNextRating - uRating
    }) to <span style="font-weight:bold;" class="${uNextLabel}">${uNextRanking}</span>) </span>
`;

li.innerHTML = newli;
ul.insertBefore(li, ul.children[1]);
