function hobbiesPage() {
    clearBody();
    gamingCard();
    dndCard();
    miniaturePaintingCard();
}

function gamingCard() {
    addToBody(`
        <div class="card mb-3 bg-transparent border-0" style="max-width: 100%;">
            <div class="row g-0 cardmargins">
                <div class="col-md-12 cardbackdrop">
                    <div class="card-body">
                        <h5 class="card-title">Gaming</h5>
                        <p class="card-text">
                            I've been a huge nerd my whole life, and video games are what initially drove me into development many years ago while I was in 
                            basic training. I remembered how easily I could loose time over modding in oblivion, even arguablly I spent more time tinkering 
                            with the creation kit then I ever did playing the game. Outside of small personal mods I never published anything too crazy, 
                            and post military I realized that game development and learning all the different tech stacks wasn't my cup of tea, but coding was
                            so I started my engineering program at my local community college to become a software developer. 
                        </p>
                        <p class="card-text">
                            I still play video games quite frequently, and most of the time find myself drawn to 2 types of games, the chaotic multiplayer games
                            with friends like lethal company, or helldivers, or fantasy RPG's like Dragon Age, Dragons Dogma, Skyrim, and even a few MMO's like World of Warcraft
                            (which I spent the bulk of my teenage years playing inbetween magic the gathering), or more recently Elder Scrolls Online.  
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function dndCard() {
    addToBody(`
        <div class="card mb-3 bg-transparent border-0" style="max-width: 100%;">
            <div class="row g-0 cardmargins">
                <div class="col-md-12 cardbackdrop">
                    <div class="card-body">
                        <h5 class="card-title">Dungeons and Dragons</h5>
                        <p class="card-text">
                            I've been playing DND for about 10 years now, I've tinkered with just about every class, and character type. I pretty recently have
                            started playing again as my wife found a really good online DND group that we have gotten close with. I've found that I tend to play a
                            paladin most frequently, though I very rarely focus on the more "crusadery" oaths. I mostly like to play them since they make 
                            such good tanks for protecting my friends in the game. Infer what you will from that. 
                        </p>
                        <p class="card-text">
                            I do occasionally act as a game master for some games though I have found my playstyle as a DM to be extremely
                            chaotic, and often times prefer to run the session off the top of my head instead of prepping. Running with a general
                            outline of where I think the session will go, and make everything else on the spot. So far my players have enjoyed it 
                            quite a lot. 
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function miniaturePaintingCard() {
    addToBody(`
        <div class="card mb-3 bg-transparent border-0" style="max-width: 100%;">
            <div class="row g-0 cardmargins">
                <div class="col-md-12 cardbackdrop">
                    <div class="card-body">
                        <h5 class="card-title">Warhammer, and miniature painting</h5>
                        <p class="card-text">
                            I've been painting warhammer miniatures for the better part of 5 years now. I've done a quite a lot
                            of Warhammer 40k, and Age Of Sigmar. I don't play the actual game all that often, but I have found it extremely
                            relaxing and helps me focus my mind when I am feeling scattered as you can just zero in and turn off your brain.
                            <a href="https://www.instagram.com/gordenminiatures/">Here is my instagram link</a> where I sometimes post the stuff I paint.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    `);
}