const input = document.querySelector("input") ;
const btn = document.querySelector("#searchBtn") ;
const profile = document.querySelector("#profile") ;
const loading = document.querySelector("#loading") ;
const error = document.querySelector("#error") ;
const historyDiv = document.querySelector("#history") ;

let history = JSON.parse(localStorage.getItem("history")) || [] ;

function showHistory(){
    historyDiv.innerHTML = "<h3>Recent Searches : </h3>" + 
        history.map(user => 
            `<span onclick="searchUser('${user}')">${user}</span>`).join(" | ");
   
}
showHistory() ;

btn.addEventListener("click",fetchUser) ;

async function fetchUser() {
    const username = input.value.trim() ;
    if(!username) return ;

    loading.classList.remove("hidden") ;
    error.classList.add("hidden") ;
    profile.innerHTML = "" ;

    try{
        const res = await fetch(`https://api.github.com/users/${username}`) ;
        if(!res.ok){
            throw new Error("User Not Found")  ;
        }

        const data = await res.json() ;

        profile.innerHTML = `
        <img src="${data.avatar_url}"/>
        <h2>${data.login}</h2>
        <p>${data.bio || "No Bio"}</p>
        <p>Repos: ${data.public_repos}</p>
        <p>Followers : ${data.followers}</p>
        ` ;

        // save history
        history.unshift(username) ;
        history = [...new Set(history)].slice(0,5) ;
        localStorage.setItem("history",JSON.stringify(history)) ;
        showHistory() ;

    }catch(err){
        error.textContent = err.message ;
        error.classList.remove("hidden") ;

    }finally{
        loading.classList.add("hidden") ;
    }
}