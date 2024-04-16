var mcstats={loader:document.getElementById("loader"),infoBox:document.getElementById("info"),content:document.getElementById("content"),viewTitle:document.getElementById("view-title"),viewSubtitle:document.getElementById("view-subtitle"),viewDesc:document.getElementById("view-desc"),viewIcon:document.getElementById("view-icon"),viewContent:document.getElementById("view-content"),localization:{},info:{},awards:{},events:{},awardKeysByTitle:[],liveEventKeysByDate:[],finishedEventKeysByDate:[],players:{},
cachePlayer:function(a,b){a in mcstats.players?b():(a=a.substring(0,mcstats.info.cacheQ),loadJson("data/playercache/"+a+".json",function(c){c.forEach(function(e){mcstats.players[e.uuid]={name:e.name,skin:e.skin,last:e.last}});b()},!1,!0))},showLoader:function(){mcstats.content.style.display="none";mcstats.loader.style.display=""},showView:function(a,b,c,e){mcstats.viewTitle.innerHTML=a;b?(mcstats.viewSubtitle.innerHTML=b,mcstats.viewSubtitle.style.display=""):mcstats.viewSubtitle.style.display="none";
c?(mcstats.viewDesc.innerHTML=c,mcstats.viewDesc.style.display=""):mcstats.viewDesc.style.display="none";e?(mcstats.viewIcon.setAttribute("src",e),mcstats.viewIcon.style.display=""):mcstats.viewIcon.style.display="none";mcstats.localizePage();mcstats.loader.style.display="none";mcstats.content.style.display="block"}},navbarElement=document.getElementById("navbar-content"),navbar=new bootstrap.Collapse(navbarElement,{toggle:!1});
window.onhashchange=function(){window.scrollTo(0,0);mcstats.showLoader();var a=window.location.hash;if(a.startsWith("#award:"))a=a.substr(7),mcstats.showAward(a);else if(a.startsWith("#player:"))a=a.substr(8),mcstats.showPlayer(a);else if(a.startsWith("#players")){var b=1,c=a.indexOf(":");0<=c&&(b=parseInt(a.substring(c+1)));mcstats.showPlayerList(b,!1)}else a.startsWith("#allplayers")?(b=1,c=a.indexOf(":"),0<=c&&(b=parseInt(a.substring(c+1))),mcstats.showPlayerList(b,!0)):"#hof"==a?mcstats.showHof():
"#events"==a?mcstats.showEventList():a.startsWith("#event:")?(a=a.substr(7),mcstats.showEvent(a)):"#loader"!=a&&mcstats.showAwardsList();navbar.hide();mcstats.updateLangSelect()};mcstats.languages=[{code:"de",display:"Deutsch"},{code:"en",display:"English"},{code:"es",display:"Español"},{code:"fr",display:"Français"},{code:"ja",display:"日本語"},{code:"pl",display:"Polski"},{code:"ru",display:"Русский"},{code:"zh-hans",display:"简体中文"},{code:"zh-hant",display:"繁體中文"}];mcstats.getLangURL=function(a){return`?lang=${a}${window.location.hash}`};
mcstats.fillLangSelect=function(){langSelect="";mcstats.languages.sort(function(c,e){return c.display.localeCompare(e.display)});for(var a in mcstats.languages){var b=mcstats.languages[a];langSelect+=`<li><a id="lang-${b.code}" class="dropdown-item language" href="${mcstats.getLangURL(b.code)}">${b.display}</a></li>`}document.getElementById("lang-select").innerHTML=langSelect};
mcstats.updateLangSelect=function(){for(var a in mcstats.languages){var b=mcstats.languages[a];document.getElementById(`lang-${b.code}`).setAttribute("href",mcstats.getLangURL(b.code))}};mcstats.localizeDefault=function(a,b){if(a in mcstats.localization)return mcstats.localization[a];console.warn("unlocalized key: "+a);return b};
mcstats.localize=function(a,b){if(a in mcstats.localization)return a=mcstats.localization[a],Array.isArray(b)?a.replace(/{(\d+)}/g,function(c,e){return"undefined"!=typeof b[e]?b[e]:c}):a;console.warn("unlocalized key: "+a);return a};mcstats.localizePage=function(){Array.from(document.getElementsByClassName("localize")).forEach(function(a){a.innerHTML=mcstats.localize(a.innerHTML);a.classList.remove("localize")})};intlFormat=null;
formatInt=function(a){null===intlFormat&&(intlFormat=new Intl.NumberFormat(mcstats.localize("locale")));return intlFormat.format(a)};formatFloat=function(a){return a!=parseInt(a)?a.toFixed(1):a};formatDate=function(a){var b=new Date;b.setTime(1E3*a);return b.toLocaleDateString(mcstats.localize("locale"),{day:"numeric",month:"short",year:"numeric"})};
formatTime=function(a){var b=new Date;b.setTime(1E3*a);a=mcstats.localize("locale");return b.toLocaleDateString(a,{day:"numeric",month:"short",year:"numeric"})+" - "+b.toLocaleTimeString(a,{hour:"2-digit",minute:"2-digit",hour12:!1})};
mcstats.formatValue=function(a,b,c=!1){switch(b){case "cm":1E5<=a?(a/=1E5,b=mcstats.localize("stat.unit.distance.kilometers")):100<=a&&(a/=100,b=mcstats.localize("stat.unit.distance.meters"));a=formatFloat(a)+b;break;case "ticks":seconds=a/20;if(c){a="";b=!1;86400<seconds&&(a+=Math.floor(seconds/86400)+mcstats.localize("stat.unit.duration.days")+" ",seconds%=86400,b=!0);if(b||3600<seconds)a+=Math.floor(seconds/3600)+mcstats.localize("stat.unit.duration.hours")+" ",seconds%=3600,b=!0;if(b||60<seconds)a+=
Math.floor(seconds/60)+mcstats.localize("stat.unit.duration.minutes")+" ",seconds%=60;a+=Math.floor(seconds)+mcstats.localize("stat.unit.duration.seconds")}else return a='\x3ctable class\x3d"time-data"\x3e\x3ctbody\x3e\x3ctr\x3e',b=!1,86400<seconds?(a+=`<td class="days">${Math.floor(seconds/86400)}${mcstats.localize("stat.unit.duration.days")}</td>`,seconds%=86400,b=!0):a+='\x3ctd class\x3d"days"\x3e\x3c/td\x3e',b||3600<seconds?(a+=`<td class="hours">${Math.floor(seconds/3600)}${mcstats.localize("stat.unit.duration.hours")}</td>`,
seconds%=3600,b=!0):a+='\x3ctd class\x3d"hours"\x3e\x3c/td\x3e',b||60<seconds?(a+=`<td class="minutes">${Math.floor(seconds/60)}${mcstats.localize("stat.unit.duration.minutes")}</td>`,seconds%=60):a+='\x3ctd class\x3d"minutes"\x3e\x3c/td\x3e',seconds=Math.floor(seconds),a+=`<td class="seconds">${seconds}${mcstats.localize("stat.unit.duration.seconds")}</td>`,a+"\x3c/tbody\x3e\x3c/table\x3e";break;case "tenths_of_heart":a=formatFloat(parseInt(a)/10);break;case "int":a=formatInt(parseInt(a));break;
default:a=""+a+" "+mcstats.localize("stat.unit."+b)}return`<span class="text-data">${a}</span>`};mcstats.awardType={medal:{locPrefix:"stat.rank.medal.",imgPrefix:"fatcow/medal_award_"},crown:{locPrefix:"stat.rank.crown.",imgPrefix:"fatcow/crown_"}};mcstats.rankWidget=function(a,b="medal"){b=mcstats.awardType[b];if(a){var c=`<span class="rank rank-${a}">#${a}</span>`;switch(a){case 1:a="gold";break;case 2:a="silver";break;case 3:a="bronze";break;default:a=!1}a&&(c=`
                <img class="img-textsize-1_5 me-1 align-top" title="${mcstats.localize(b.locPrefix+a)}" src="img/${b.imgPrefix}${a}.png"/>
            `+c)}else c='\x3cspan class\x3d"rank"\x3e-\x3c/span\x3e';return c};mcstats.isActive=function(a){return(mcstats.info.updateTime-a)/86400<=mcstats.info.inactiveDays};mcstats.lastOnlineWidget=function(a){var b=formatTime(a);return mcstats.isActive(a)?`<span class="text-success">${b}</span>`:`
            <span class="text-danger">${b}</span>
        `};mcstats.awardWidget=function(a){var b=mcstats.awards[a];return`
        <img class="img-pixelated img-textsize-1_5 align-baseline" src="img/award-icons/${a}.png" alt="${a}" title="${b.title}"/>
        <a href="#award:${a}">${b.title}</a>
    `};mcstats.eventWidget=function(a){var b=mcstats.events[a];return`
        <img class="img-pixelated img-textsize-1_5 align-baseline" src="img/award-icons/${b.link}.png" alt="${a}" title="${b.title}"/>
        <a href="#event:${a}">${b.title}</a>
    `};function drawFace(a){var b=a.parentNode,c=b.getContext("2d");c.imageSmoothingEnabled=!1;c.drawImage(a,8,8,8,8,0,0,b.width,b.height);c.drawImage(a,40,8,8,8,0,0,b.width,b.height)}mcstats.faceWidget=function(a,b=""){return`
        <canvas width="8" height="8" class="minecraft-face d-inline-block img-pixelated ${b}">
            <img class="d-none" src="${a}" onload="drawFace(this);"/>
        </canvas>`};mcstats.makePlayerWidget=function(a,b,c){p=mcstats.players[a];skin=p.skin?"https://textures.minecraft.net/texture/"+p.skin:"img/skins/"+(parseInt(a[7],16)^parseInt(a[15],16)^parseInt(a[23],16)^parseInt(a[31],16)?"alex":"steve")+".png";return mcstats.faceWidget(skin,b)+(c?`<a href="#player:${a}">${p.name}</a>`:p.name)};
mcstats.playerWidget=function(a,b="textw-1_5 texth-1_5 align-baseline me-1",c=!0){if(a){if(a in mcstats.players)return mcstats.makePlayerWidget(a,b,c);mcstats.cachePlayer(a,function(){document.getElementById(a).innerHTML=mcstats.makePlayerWidget(a,b,c)});return`<span id=${a}>${a}</span>`}return`<span class="text-muted">${mcstats.localize("nobody")}</span>`};mcstats.removeColorCodes=function(a){nofmt="";for(i=0;i<a.length;i++)167==a.charCodeAt(i)?++i:nofmt+=a[i];return nofmt};
mcstats.formatColorCode=function(a){html="";color=!1;for(i=level=0;i<a.length;i++)167==a.charCodeAt(i)?(code=a[i+1],"r"==code?(html+="\x3c/span\x3e".repeat(level),level=0):(html+=`<span class="mc-text-${code}">`,++level),++i):html+=a[i];return html+="\x3c/span\x3e".repeat(level)};
mcstats.showAwardsList=function(){viewHTML="";var a=0,b="";mcstats.awardKeysByTitle.forEach(function(e){var d=mcstats.awards[e];if(d.best){var f=mcstats.playerWidget(d.best.uuid);var g=d.desc+": "+mcstats.formatValue(d.best.value,d.unit,!0)}else f=mcstats.playerWidget(!1),g=`<span class="text-muted">(${d.desc})</span>`;b+=`
            <div class="col-sm">
                <div class="container p-1 mb-3 mcstats-entry">
                    <div class="h4 p-1 mb-1 round-box text-center align-middle">
                        <img class="img-pixelated img-textsize align-baseline" src="img/award-icons/${e}.png" alt="${e}" title="${d.title}"/>
                        <a href="#award:${e}">${d.title}</a>
                    </div>
                    <div class="p-1 round-box text-center">
                        ${f}
                        <br/>
                        ${g}
                    </div>
                </div>
            </div>
        `;3<=++a&&(viewHTML+=`<div class="row">${b}</div>`,b="",a=0)});if(0<a){for(var c=a;3>c;c++)b+='\x3cdiv class\x3d"col-sm"\x3e\x3c/div\x3e';viewHTML+=`<div class="row">${b}</div>`}mcstats.viewContent.innerHTML=viewHTML;mcstats.showView(mcstats.localize("page.awardList.title"),!1,!1,!1)};
mcstats.showAward=function(a){loadJson("data/rankings/"+a+".json",function(b){var c=mcstats.awards[a],e="",d=1;b.forEach(function(f){var g=mcstats.rankWidget(d++),h=mcstats.playerWidget(f.uuid);f=mcstats.formatValue(f.value,c.unit);e+=`
                <tr>
                    <td class="text-end">${g}</th>
                    <td>${h}</td>
                    <td class="text-data text-end">${f}</td>
                </tr>
            `});mcstats.viewContent.innerHTML=`
            <div class="mcstats-entry p-1">
            <div class="round-box p-1">
                <table class="table table-responsive-xs table-hover table-sm">
                <thead>
                    <th scope="col" class="text-end text-shadow">${mcstats.localize("stat.rank")}</th>
                    <th scope="col" class="text-shadow">${mcstats.localize("stat.player")}</th>
                    <th scope="col" class="text-end text-shadow">${c.desc}</th>
                </thead>
                <tbody>${e}</tbody>
                </table>
            </div>
            </div>
        `;mcstats.showView(c.title,mcstats.localize("page.awardView.subtitle"),!1,"img/award-icons/"+a+".png")})};
mcstats.showEventList=function(){var a=function(b){var c="";b.forEach(function(e){var d=mcstats.events[e],f=mcstats.awards[d.link];mcstats.eventWidget(e);d.active&&mcstats.localize("page.eventList.live");if(d.best){var g=mcstats.playerWidget(d.best.uuid);f=f.desc+": "+mcstats.formatValue(d.best.value,f.unit,!0)}else g=mcstats.playerWidget(!1),f=`<span class="text-muted">(${f.desc})</span>`;var h=d.active?`${mcstats.localize("page.eventList.ongoingSince")} ${formatDate(d.startTime)}! <br /> ${mcstats.localize("page.eventList.endsAt")} ${formatDate(d.stopTime)}.`:
`${formatDate(d.startTime)} - ${formatDate(d.stopTime)}`;formatTime(d.startTime);var n=d.active?`<span class="ps-2 text-success">[${mcstats.localize("page.eventList.live")}]</span>`:`<span class="ps-2 text-danger">[${mcstats.localize("page.eventList.finished")}]</span>`;c+=`
                <div class="row">
                <div class="col-sm">
                    <div class="container p-1 mb-3 mcstats-entry">
                        <div class="p-1 mb-1 round-box text-center align-middle">
                            <div class="h4">
                                <img class="img-pixelated img-textsize align-baseline" src="img/award-icons/${d.link}.png" alt="${e}" title="${d.title}"/>
                                <a href="#event:${e}">${d.title}</a>
                                ${n}
                            </div>
                            <div class="text-muted">
                                ${h}
                            </div>
                        </div>
                        <div class="p-1 round-box text-center">
                            <span class="rank-1">${mcstats.localize(d.active?"page.eventList.leading":"page.eventList.winner")}:</span>
                            ${g}
                            <br/>
                            ${f}
                        </div>
                    </div>
                </div>
                </div>
            `});return c};mcstats.viewContent.innerHTML="";0<mcstats.liveEventKeysByDate.length&&(mcstats.viewContent.innerHTML+=`
            <div class="text-center mb-2">
                <div class="h5 text-shadow">${mcstats.localize("page.eventList.ongoingEvents")}</div>
            </div>
            ${a(mcstats.liveEventKeysByDate)}
        `);0<mcstats.finishedEventKeysByDate.length&&(mcstats.viewContent.innerHTML+=`
            <div class="text-center mb-2 mt-4">
                <div class="h5 text-shadow">${mcstats.localize("page.eventList.finishedEvents")}</div>
            </div>
            ${a(mcstats.finishedEventKeysByDate)}
        `);mcstats.showView(mcstats.localize("page.eventList.title"),!1,!1,!1)};mcstats.showEvent=function(a){loadJson("data/events/"+a+".json",function(b){var c=mcstats.events[a],e=c.link,d=mcstats.awards[e],f="",g=1;b.ranking.forEach(function(h){var n=mcstats.rankWidget(g++),l=mcstats.playerWidget(h.uuid);h=mcstats.formatValue(h.value,d.unit);f+=`
                <tr>
                    <td class="text-end">${n}</th>
                    <td>${l}</td>
                    <td class="text-data text-end">${h}</td>
                </tr>
            `});b=c.active?`${mcstats.localize("page.eventView.eventStatus.live",[formatTime(c.startTime)])} <br/> ${mcstats.localize("page.eventList.endsAt")} ${formatDate(c.stopTime)}`:mcstats.localize("page.eventView.eventStatus.finished",[formatTime(c.startTime),formatTime(c.stopTime)]);mcstats.viewContent.innerHTML=`
            <div class="mcstats-entry p-1">
            <div class="round-box p-1">
                <table class="table table-responsive-xs table-hover table-sm">
                <thead>
                    <th scope="col" class="text-end text-shadow">${mcstats.localize("stat.rank")}</th>
                    <th scope="col" class="text-shadow">${mcstats.localize("stat.player")}</th>
                    <th scope="col" class="text-end text-shadow">${d.desc}</th>
                </thead>
                <tbody>${f}</tbody>
                </table>
            </div>
            </div>
        `;mcstats.showView(c.title,mcstats.localize(c.active?"page.eventView.title.active":"page.eventView.title.inactive"),b,"img/award-icons/"+e+".png")})};
mcstats.showPlayerList=function(a=1,b=!1){loadJson("data/playerlist/"+(b?"all":"active")+a+".json.gz",function(c){c.forEach(function(k){mcstats.players[k.uuid]={name:k.name,skin:k.skin,last:k.last}});var e="",d=b?"allplayers":"players",f=mcstats.info.numPlayers,g=mcstats.info.numActive,h=f-g,n=mcstats.info.playersPerPage,l=Math.ceil((b?f:g)/n);c.forEach(function(k){var q=mcstats.playerWidget(k.uuid);k=mcstats.info.showLastOnline?`<td class="text-end">${mcstats.lastOnlineWidget(k.last)}</td>`:"";e+=
`
                <tr>
                    <td>${q}</td>
                    ${k}
                </tr>
            `});var r=function(k,q=null,u=!0){null===q&&(q=k.toString());return u?`
                    <li class="page-item">
                        <a class="page-link" href="#${d}:${k}">${q}</a>
                    </li>`:`
                <li class="page-item disabled">
                    <div class="page-link">${q}</div>
                </li>`},t=function(){return'\x3cli class\x3d"page-dots"\x3e...\x3c/li\x3e'};c=""+r(a-1,"\x26lt",1<a);1<a&&(c+=r(1));3<a-2&&(c+=t());for(var m=Math.max(2,a-3);m<a;m++)c+=r(m);c+=`
                <li class="page-item active">
                    <div class="page-link">${a}</div>
                </li>`;for(m=a+1;m<=Math.min(a+3,l-1);m++)c+=r(m);3<l-a-1&&(c+=t());a<l&&(c+=r(l));c+=r(a+1,"\x26gt",a<l);l=mcstats.info.showLastOnline?`<th scope="col" class="text-end text-shadow">${mcstats.localize("page.playerList.lastOnline")}</th>`:"";mcstats.viewContent.innerHTML=`
            <div class="text-center mt-3">
                <input id="show-inactive" type="checkbox" ${b?"checked":""}/>
                <label for="show-inactive">${mcstats.localize("page.playerList.showInactive")}</label>
            </div>
            <div class="text-center mt-3">
                <ul class="pagination justify-content-center">${c}</ul>
            </div>
            <div class="mcstats-entry p-1">
            <div class="round-box p-1">
                <table class="table table-responsive-xs table-hover table-sm">
                <thead>
                    <th scope="col" class="text-shadow">${mcstats.localize("stat.player")}</th>
                    ${l}
                </thead>
                <tbody>${e}</tbody>
                </table>
            </div>
            </div>
            <div class="mt-2 text-muted text-center text-shadow">
                ${mcstats.localize("page.playerList.activityInfo",[mcstats.info.minPlayTime,mcstats.info.inactiveDays])}
            </div>
            <div class="text-center mt-3">
                <ul class="pagination justify-content-center">${c}</ul>
            </div>
        `;document.getElementById("show-inactive").onclick=function(){window.location.hash=b?"#players":"#allplayers"};mcstats.showView(mcstats.localize("page.playerList.title"),mcstats.localize("page.playerList.count",[f,g,h]),mcstats.localize("page.playerList.paginationInfo",[n])+"\x3cbr/\x3e",!1)},!0)};
mcstats.showPlayer=function(a){mcstats.cachePlayer(a,function(){loadJson("data/playerdata/"+a+".json",function(b){var c=mcstats.players[a],e="";mcstats.awardKeysByTitle.forEach(function(d){var f=b[d],g=mcstats.awards[d];d=mcstats.awardWidget(d);var h=mcstats.formatValue(f?f.value:0,g.unit,!0);f=f?mcstats.rankWidget(f.rank):"";e+=`
                    <tr>
                        <td class="text-end">${f}</td>
                        <td>${d}</td>
                        <td>
                            <span class="text-muted">${g.desc}:</span>&nbsp;
                            <span class="text-data">${h}</span>
                        </td>
                    </tr>
                `});mcstats.viewContent.innerHTML=`
                <div class="mcstats-entry p-1">
                <div class="round-box p-1">
                    <table class="table table-responsive-xs table-hover table-sm">
                    <thead>
                        <th scope="col" class="text-end text-shadow">${mcstats.localize("stat.rank")}</th>
                        <th scope="col" class="text-shadow">${mcstats.localize("stat.award")}</th>
                        <th scope="col" class="text-shadow">${mcstats.localize("stat.score")}</th>
                    </thead>
                    <tbody>${e}</tbody>
                    </table>
                </div>
                </div>
            `;mcstats.showView(mcstats.playerWidget(a,"textw texth align-baseline me-2",!1),mcstats.localize("page.playerView.subtitle"),mcstats.info.showLastOnline?mcstats.localize("page.playerView.lastPlayed")+": "+mcstats.lastOnlineWidget(c.last):"",!1)})})};mcstats.showHof=function(){var a="",b=1;mcstats.hof.forEach(function(d){var f=mcstats.rankWidget(b++,"crown"),g=mcstats.playerWidget(d.uuid);d=d.value;a+=`
            <tr>
                <td class="text-end">${f}</th>
                <td>${g}</td>
                <td class="text-data text-center">${d[1]}</td>
                <td class="text-data text-center">${d[2]}</td>
                <td class="text-data text-center">${d[3]}</td>
                <td class="text-data text-end">${d[0]}</td>
            </tr>
        `});mcstats.viewContent.innerHTML=`
        <div class="mcstats-entry p-1">
        <div class="round-box p-1">
            <table class="table table-responsive-xs table-hover table-sm">
            <thead>
                <th scope="col" class="text-end text-shadow">${mcstats.localize("stat.rank")}</th>
                <th scope="col" class="text-shadow">${mcstats.localize("stat.player")}</th>
                <th scope="col" class="text-center"><img class="img-textsize-2" title="${mcstats.localize("stat.unit.medals.gold")}" src="img/fatcow/medal_award_gold.png"/></th>
                <th scope="col" class="text-center"><img class="img-textsize-2" title="${mcstats.localize("stat.unit.medals.silver")}" src="img/fatcow/medal_award_silver.png"/></th>
                <th scope="col" class="text-center"><img class="img-textsize-2" title="${mcstats.localize("stat.unit.medals.bronze")}" src="img/fatcow/medal_award_bronze.png"/></th>
                <th scope="col" class="text-end text-shadow">${mcstats.localize("stat.score")}</th>
            </thead>
            <tbody>${a}</tbody>
            </table>
        </div>
        </div>
    `;var c=mcstats.info.crown,e=function(d){return d+" "+mcstats.localize(1<d?"stat.unit.points":"stat.unit.point")};mcstats.showView(mcstats.localize("page.hof.title"),mcstats.localize("page.hof.subtitle"),mcstats.localize("page.hof.description",[e(c[0]),e(c[1]),e(c[2])]),!1)};
loadJson=function(a,b,c=!1,e=!1){var d=new XMLHttpRequest;d.open("GET",a,!0);e||d.setRequestHeader("Cache-Control","no-cache, no-store, must-revalidate");c&&(d.responseType="arraybuffer");d.onload=function(f){c?(f=new Uint8Array(d.response),f=JSON.parse(pako.inflate(f,{to:"string"}))):f=JSON.parse(d.response);b(f)};d.send()};
class Loader{constructor(a){this.oncomplete=a;this.requests=[];this.numLoaded=0}addRequest(a,b,c=!1){this.requests.push({url:a,successFunc:b,compressed:c})}start(){var a=this;this.requests.forEach(function(b){loadJson(b.url,function(c){b.successFunc(c);++a.numLoaded;if(a.numLoaded>=a.requests.length)a.oncomplete()},b.compressed)})}}params={lang:null};
if(window.location.search.startsWith("?")){paramDefs=window.location.search.substr(1).split("\x26");for(var i in paramDefs)kv=paramDefs[i].split("\x3d",2),2==kv.length&&(params[kv[0]]=kv[1])}
mcstats.start=function(){null==params.lang&&(console.log(summary),params.lang=mcstats.defaultLanguage);for(var a in mcstats.awards){var b=mcstats.awards[a];b.title=mcstats.localizeDefault("award."+a+".title",a);b.desc=mcstats.localizeDefault("award."+a+".desc",a)}serverName=JSON.parse('"'+mcstats.info.serverName+'"');serverNameNoFmt=mcstats.removeColorCodes(serverName).replace("\x3cbr\x3e"," / ");document.title=`${serverNameNoFmt} \u2013 Stats`;document.getElementById("navigation").style.display=
"";document.getElementById("server-name").innerHTML=mcstats.formatColorCode(serverName);document.getElementById("update-time").textContent=formatTime(mcstats.info.updateTime);b=document.getElementById("server-icon");mcstats.info.hasIcon?b.setAttribute("title",serverNameNoFmt):b.style.display="none";for(a in mcstats.awards)mcstats.awardKeysByTitle.push(a);mcstats.awardKeysByTitle.sort(function(c,e){return mcstats.awards[c].title.localeCompare(mcstats.awards[e].title)});b=0;for(a in mcstats.events)mcstats.events[a].active?
mcstats.liveEventKeysByDate.push(a):mcstats.finishedEventKeysByDate.push(a),++b;0<b&&(mcstats.liveEventKeysByDate.sort(function(c,e){return mcstats.events[e].startTime-mcstats.events[c].startTime}),mcstats.finishedEventKeysByDate.sort(function(c,e){return mcstats.events[e].startTime-mcstats.events[c].startTime}),document.getElementById("tab-events").style.display="");mcstats.infoBox.style.display="block";mcstats.content.style.display="block";window.onhashchange()};var localizationLoader=new Loader(function(){mcstats.start()});
summaryLoader=new Loader(function(){localizationLoader.addRequest("localization/"+params.lang+".json",function(a){mcstats.localization=a;document.getElementById("loading-text").innerHTML=mcstats.localize("loading");mcstats.fillLangSelect()});localizationLoader.start()});
summaryLoader.addRequest("data/summary.json.gz",function(a){mcstats.info=a.info;mcstats.players=a.players;mcstats.awards=a.awards;mcstats.events=a.events;mcstats.hof=a.hof;null==params.lang&&(params.lang=mcstats.info.defaultLanguage);void 0===params.lang&&(params.lang="en")},!0);mcstats.showLoader();summaryLoader.start();
//# sourceMappingURL=mcstats.min.js.map