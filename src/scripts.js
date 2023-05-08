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
function hobbiesPage() {
    clearBody();
    $('#Content_Body').append(`
        <div class="card ">
            <div class="card-body">
                Hobbies page will be here
            </div>
        </div>
    `);
}

function contactMePage() {
    clearBody();
    $('#Content_Body').append(`
        <div class="card">
            <div class="card-body">
                Contact me page will be here
            </div>
        </div>
    `);
}