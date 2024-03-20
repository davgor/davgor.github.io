$( document ).ready(function() {
    console.log( "ready!" );
});

function clearBody() {
    $('#Content_Body').empty();
}
function addToBody(content) {
    $('#Content_Body').append(content);
}
function reposPage() {
    clearBody();
    addToBody(`
        <div class="card">
            <div class="card-body">
                Here is where I will discuss the different repositories I have made recently
            </div>
        </div>
    `);
}

function dogPage() {
    clearBody();
    $('#Content_Body').append(`
        <div class="card">
            <div class="card-body">
                My dog page will be here
            </div>
        </div>
    `);
}

function listGenerator(content) {
    let finalList = '';
    if (content.title) {
        finalList += `${titleGenerator(content.title)}<ul>`
        if (content.list) {
            content.list.forEach(element => {
                finalList += `<li>${element}</li>`;
            });
        }
        finalList += '</ul>';
    }
    return finalList;
}

function titleGenerator(title) {
    if (title) {
        return `<h6><b>${title}</b></h6>`;
    } else {
        return '';
    }
}

function paragraghGenerator(content) {
    let finalList = '';
    content.roles.forEach(role => {
        finalList += `<div class="card-body"><h5 class="card-title">${role.title}</h5><p class="card-text">`
        role.paragraphs.forEach(element => {
            if (element.title != "") {
                finalList += `<h6><b>${element.title}</b></h5>`;
            }
            finalList += `<p>${element.text}</p>`
        });
        finalList += '</p>';
        if (role.achievements) {
            finalList += listGenerator(role.achievements);
        }
        finalList += '</div>';
    });
    return finalList;
}

function jobCard(content) {
    let card = `
        <div class="card mb-3 bg-transparent border-0" style="max-width: 100%;">
            <div class="row g-0 cardmargins">
                <div class="col-md-2 cardbackdrop">
                    <a href="${content.website}">
                        <img src="${content.logo}" class="img-fluid rounded-start" style="padding-top: 10px;">
                    </a>
                </div>
                <div class="col-md-10 cardbackdrop">
                    ${paragraghGenerator(content)}
                </div>
            </div>
        </div>
    `
    return card;
}
