let news = [];
let menus = document.querySelectorAll(".menus button");
let url;
let page = 1;
let total_page = 0;

menus.forEach((menu) => menu.addEventListener("click", (event) => getNewsByTopic(event)));

/*for (let i = 1; i < menus.length; i++) {
    menus[i].addEventListener("click", function (event) {
        getNewsByTopic(event);
    });                         //4번째 줄의 다른 버전
}*/

let searchButton = document.getElementById("search-button");
//console.log("버튼 클릭", searchButton);

const getNews = async () => {   //코드 리펙토링
    try {
        let header = new Headers({
            "x-api-key": "mIqCnOE_lz4Q0eYDwK-nbndGIIbip8My5CdgQmaxx3o",
        });
        url.searchParams.set('page', page); //moveToPage(함수)를 하기 위해서 url을 가져오기 전에 url 마지막에 현재 페이지가 적혀지는 코드이다.
        let response = await fetch(url, { headers: header });  //(await은 자료를 가져오는 시간이 걸리니 다음 코드를 넘어가지 않게 해당 코드를 기다리도록 하는 코드이다. /단 반드시 위 코드에 async를 사용해야한다.) 자료를 가져오는데 시간이 걸리니 서버를 기다려 준 다음 자료를 보여주라 순서대로 
        let data = await response.json();                      //response 한 다음(await) JSON이 객체로 자료(articles)를 가져온다. 그러고 어레이에 하나씩 담아준다. 나중에 편하려고
        if (response.status == 200) {   //정상적 결과값 출력된 번호, 200번
            if (data.total_hits == 0) {  //검색에 따른 결과값이 없을때 
                throw new Error("검색된 결과값이 없습니다.");   //에러를 강제를 만들고 catch문으로 넘어간다.
            }
            news = data.articles;
            console.log(news);
            render();
            pagination();
        } else {
            throw new Error(data.message);                    //에러를 강제를 만들고 catch문으로 넘어간다.
        }

    } catch (error) {
        console.log("잡힌 에러는:", error.message);           //try문에서 만든 error을 콘솔에 출력
        errorRender(error.message);                          //화면에 출력(함수)
    }
};


const getLatestNews = async () => {
    url = new URL(
        `https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=business`
    );
    getNews();
};

const getNewsByTopic = async (event) => {                     //카테고리별로 뉴스 나눔
    let topic = event.target.textContent.toLowerCase();     //카테고리 클릭하면 클릭한 토픽이 대문자로 출력된다. 하지만 소문자로 찾을수있기에 소문자로 변한해야한다
    url = new URL(
        `https://api.newscatcherapi.com/v2/latest_headlines?countries=US&topic=${topic}`
    );
    getNews();
};

const getNewsByKeyword = async () => {  //검색창에 쓴 글 찾기
    //1. 검색 키워드 읽어오기
    //2. url에 검색 키워드 부치기
    //3. 헤더준비
    //4. url 불러오기
    //5. 데이터 가져오기
    //6 . 데이터 보여주기  //render
    console.log("click");
    let keyword = document.getElementById("search-input").value;
    console.log(keyword);
    url = new URL(
        `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`
    );
    getNews();
};

const render = () => {   //화면에 출력
    let newsHTML = "";
    newsHTML = news.map((item) => {
        return `<div class="row news">
        <div class="col-lg-4">
            <img class="news-img-size" src="${item.media ||
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
            }"/>
        </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>${item.summary == null || item.summary == ""
                ? "내용없음"  //서머리가 null이거나 ""비어있으면 "내용없음"을 출력하라(':' = ~가 아니면 이라는 뜻, '?' = 출력할 답)
                : item.summary.length > 200
                    ? item.summary.substring(0, 200) + "..."
                    : item.summary
            }</p>
            <div> 
                ${item.rights || "no source"} * ${moment(item.published_date).fromNow()}     
            </div>
        </div>
    </div>`;
    }).join('');   //어레이를 나누면 생기는 ,를 지워주며 string으로 만들어준다.즉 ,가 출력되지 않도록 해준다.

    document.getElementById("news-board").innerHTML = newsHTML;
};

// const render = () => {
//     let resultHTML = news.map((news) => {
//         return `<div class="news row">
//           <div class="col-lg-4">
//               <img class="news-img"
//                   src="${
//                     news.media ||
//                     "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"
//                   }" />
//           </div>
//           <div class="col-lg-8">
//               <a class="title" target="_blank" href="${news.link}">${
//           news.title
//         }</a>
//               <p>${
//                 news.summary == null || news.summary == ""
//                   ? "내용없음"
//                   : news.summary.length > 200
//                   ? news.summary.substring(0, 200) + "..."
//                   : news.summary
//               }</p>
//               <div>${news.rights || "no source"}  ${moment(
//           news.published_date
//         ).fromNow()}</div>
//           </div>
//       </div>`;
//       })
//       .join("");

//     document.getElementById("news-board").innerHTML = resultHTML;
//   };

const openSearchBox = () => {
    let inputArea = document.getElementById("input-area");
    if (inputArea.style.display === "inline") {
        inputArea.style.display = "none";
    } else {
        inputArea.style.display = "inline";
    }
};

const errorRender = (message) => {      //화면에 에러 출력
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">${message}</div>`;

    document.getElementById("news-board").innerHTML = errorHTML;
};

const pagination = () => {    //페이지네이션 하기
    let paginationHTML = "";
    //total_page
    //page

    //page_group
    let pageGroup = Math.ceil(page / 5);

    //last
    let last = pageGroup * 5;

    //first_last
    let first = last - 4;

    paginationHTML = `<li class="page-item">
    <a class="page-link" href="#" aria-label="previous"onclick="moveToPage(${page - 1})>
    <span aria-hidden="true">&lt;</span>
    </a>
  </li>`;

    for (let i = first; i <= last; i++) {   //186줄 active설명 >> page가 i랑 같다면(?) 엑티브라는 현재페이지칸이 색상이 진해지는 것을 말하고, 아니라면(:) "" 즉 색상을 칠하지 말라는 뜻 
        paginationHTML = `<li class="page-item ${page == i ? "active" : ""}">    
            <a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`
    }

    paginationHTML = `<li class="page-item">
    <a class="page-link" href="#" aria-label="previous"onclick="moveToPage(${page - 1})>
    <span aria-hidden="true">&lt;</span>
    </a>
  </li>`;

    document.querySelector("pagination").innerHTML = paginationHTML;

};

const moveToPage = (pageNum) => {
    //1. 이동하고 싶은 페이지를 알아야한다.
    page = pageNum;
    console.log("현재 페이지:", page);
    //2. 이동하고 싶은 페이지를 가지고 api를 다시 호출해라
    getNews();
    page = pageNum;
};

searchButton.addEventListener("click", getNewsByKeyword);
getLatestNews();

// const openNav = () => {
//     document.getElementById("mySidenav").style.width = "250px";
// };

// const closeNav = () => {
//     document.getElementById("mySidenav").style.width = "0";
// };





