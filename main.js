ranking = document.querySelector(".user-rank")
console.log(ranking.innerHTML)
ranking.innerHTML += '/ <span class="user-green">opa meuamigoooo!</span>'
console.log(ranking.innerHTML)

function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}