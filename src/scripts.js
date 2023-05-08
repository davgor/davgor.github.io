$( document ).ready(function() {
    console.log( "ready!" );
});

function clearBody() {
    $('#Content_Body').empty();
}

function aboutMePage() {
    clearBody();
    $('#Content_Body').append(`
        <div class="card mb-3 bg-transparent" style="max-width: 100%;">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="./assets/fun_personal_photo.jpg" class="img-fluid rounded-start" alt="Personal Photo">
                </div>
                <div class="col-md-8" style="background-color: rgba(255, 255, 255, 0.2);">
                    <div class="card-body">
                        <h5 class="card-title">David Gorden - 7+ years experience</h5>
                        <p class="card-text">
                            My name is David Gorden, I have been an engineer for over 7 years now, during this time I have consistently rose to the challenges presented, and often naturally find myself adopting a leadership position within each employer. 
                        </p>
                        <p class="card-text">
                            A bit of a background as too who I am and how I got here, I went into army when I was 20, I didn't know what I wanted to do, while I was in basic training, I was thinking truly on what I wanted to do post-military, and I realized the most fun I had doing work, was when I was modding oblivion while I was a teen. This motivation is what drove me into the computer science track. After doing some more research as to my career options, I realized programming, and development was the specific section of game development I was interested in.
                        </p>
                        <p class="card-text">
                            After finishing my associates degree, I got a job as a developer for a mid-sized insurance company in the Midwest, after developing for a time, I wanted to reduce the time I was spending completing manual tests on the webpages I was working on, after talking with the QA manager, they created, and brought me into a pilot program where I learned how to write automated tests, and implement them for our teams. That's how I found myself in Quality Engineering, and I love every minute of it.
                        </p>
                        <p class="card-text">
                            Outside of my professional story, I am a huge gamer, I play just about everything, on every game system, my most frequent game is currently Elder Scrolls Online, though I think Diablo IV is going to take over here soon. I also spend my quiet time painting miniatures for DND, and Warhammer. It is definitely the dorkiest thing about me, but painting is such a relaxing activity, and an excellent way to reset your mind. I also have 3 dogs, Bilbo, Dorian, and Lestat, at the start of the pandemic we moved off to Shallotte, North Carolina to live close to the beach, one of those beaches is where that background photo is taken.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `);
}
function experiencePage() {
    clearBody();
    $('#Content_Body').append(`
        <div class="card">
            <div class="card-body">
                experience will go here
                <p class="card-text">
                I have 7+ years experience as a Software Engineer in Test, I spent the first 4 years of my career as a 
                Developer, during this time I was charged with up-skilling my team to prepare them to transition from 
                a legacy language, over to ASP.Net, I was also the first Developer, SDET hybrid that EMC Insurance had 
                where I trained assisted other legacy developers in transitioning from legacy development, over to 
                Java/Selenium.
            </p>
            <p class="card-text">
                I eventually transitioned over to Quality Assurance Engineer in Test at EMC, where I took over the Forms 
                team, and expanded and maintained a automated API testing framework, that tested each and every form EMC had,
                I also lead a small team of QA's from overseas, which involved managing the number of offshore engineers 
                required to run the team, and the work they were tasked with. After only a few short months under my leadership 
                the teams efficency increased 3 fold, allowing us to roll 2 QA's out of the forms team, and back into the 
                organization. I accomplished this by providing detailed documentation on processes, and a re-organization 
                of the workflow. This drasticlly improved their productivity during their working hours. 
            </p>
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