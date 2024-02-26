function experiencePage() {
    clearBody();
    blackPointCyberCard();
    lyftCard();
    atreoCard();
    emcCard();
    geekSquadCard();
}

function blackPointCyberCard() {
    addToBody(`
        <div class="card mb-3 bg-transparent border-0" style="max-width: 100%;">
            <div class="row g-0 cardmargins">
                <div class="col-md-2 cardbackdrop">
                    <a href="https://blackpointcyber.com/">
                        <img src="./assets/blackpointlogo.png" class="img-fluid rounded-start" style="padding: 10px;" alt="Atreo Logo">
                    </a>
                </div>
                <div class="col-md-10 cardbackdrop">
                    <div class="card-body">
                        <h5 class="card-title">Blackpoint Cyber - QA Manager - 05/21/2023 - Current </h5>
                        <p class="card-text">
                            Placeholder
                        </p>
                        <h6><b>Achievements</b></h6>
                        <ul>
                            <li>
                                Placeholder
                            </li>
                        <ul>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function lyftCard() {
    addToBody(`
        <div class="card mb-3 bg-transparent border-0" style="max-width: 100%;">
            <div class="row g-0 cardmargins">
                <div class="col-md-2 cardbackdrop">
                    <a href="https://www.lyft.com/">
                        <img src="./assets/lyft-logo-transparent.png" style="padding: 10px;" class="img-fluid rounded-start" alt="Lyft Logo">
                    </a>
                </div>
                <div class="col-md-10 cardbackdrop">
                    <div class="card-body">
                        <h5 class="card-title">Lyft - Software Engineer in Test - 09/15/2022 - 04/28/2023</h5>
                        <p class="card-text">
                            Lyft was my first breakthrough into a big tech organization, here I was hired to be a Software developer in test, with the core tech stack being Kotlin/Espresso for android testing, and Swift/XCUITest for mobile testing. As SDET's for Lyft we were not only charged with building and expanding upon the mobile testing frameworks, but also leading the charge for quality assurance on an individual project level. We would be assigned to a specific project, and then we would create a comprehensive test plan to be manually tested through the project's development.
                        </p>
                        <p class="card-text">
                            This iterative approach is known as <a href="https://www.testim.io/blog/shift-left-testing-guide/">Shift Left Testing </a> allowed us create an extensive test plan, and keep the projects quality high through the whole development cycle. Once a project was completed, we would assess the project for regression tests, and add them to our weekly release testing cycle. From there we would begin to automate our tests.
                        </p>
                        <p class="card-text">
                            Once we assess the automatable test scenarioes we would divide the test cases into several different test applications.
                        </p>
                        <ul>
                            <li>
                                UI Testing (Espresso/XCUITest) - We leveraged these tools for UI tests that required navigation to other screens.
                            </li>
                            <li>
                                <a href="https://eng.lyft.com/shift-left-ios-testing-with-focus-flows-c9e050bd2095">Focus Flow Testing</a> - This was used for testing 1 single screen quickly with a drastically reduced build time
                            </li>
                            <li>
                                Acceptance Testing - was an in house framework for API flow testing, allowing us to test more expansive test flows that could involve multiple apps, or users
                            </li>
                        </ul>
                        <p class="card-text">
                            Once we had our tests automated, we would set up our jobs in Buildkite to automatically run (normally daily), and give the developers the ability to run the suites through their PR's on github directly.
                        </p>
                        <h6><b>Achievements</b></h6>
                        <ul>
                            <li>
                                Boosted manual test efficiency by 20x by formulating a testing process for multi-phone test cases, allowing any employee to test a complex feature individually.
                            </li>
                            <li>
                                Reduced manual efforts required to test driver bonuses from 2 hours to 2 minutes by collaborating with SDETs to develop a new process, allowing for instant bonus creation via <b>Python</b>
                            </li>
                            <li>
                                Lowered manual testing efforts through automation from 16 hours to 2 hours by prioritizing high-value tests for automation, and optimizing testing coverage.
                            </li>
                            <li>
                                Minimized regression testing time by 75% from 16 hours to 4 hours through strategic automation development, improving testing efficiency and effectiveness.
                            </li>
                            <li>
                                Implemented a new testing tool and mentored execution of use cases, resulting in a 25% reduction in test execution time and an overall enhancement of the testing suites.
                            </li>
                            <li>
                                Created and pushed new automation best practices to follow to reduce weekly maintaince load on test engineers, while expanding test suite to focus on the highest value items.                            </li>
                        <ul>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function atreoCard() {
    addToBody(`
        <div class="card mb-3 bg-transparent border-0" style="max-width: 100%;">
            <div class="row g-0 cardmargins">
                <div class="col-md-2 cardbackdrop">
                    <a href="https://www.atreo.io/">
                        <img src="./assets/Atreo_logo_transparent.png" style="padding: 10px;" class="img-fluid rounded-start" alt="Atreo Logo">
                    </a>
                </div>
                <div class="col-md-10 cardbackdrop">
                    <div class="card-body">
                        <h5 class="card-title">Atreo.io - Software Automation Engineer - 07/23/2021 - 09/15/2022</h5>
                        <p class="card-text">
                            I was hired around the initial development of atreo's software, initially I helped expand out a <b>.net</b> 
                            API that existed to help translate test results from unit, integrations, and UI tests. Then convert them 
                            into <b>SpiraTeam</b> test cases and executions. After creating that initial support infastructure I 
                            began to create <b>Playwright</b> UI tests, where I would develop extensive, and versitile new test suites for 
                            each feature they developed.
                        </p>
                        <p class="card-text">
                            Once the tests were created we needed a reliable way to execute the tests directly on the developers PR's 
                            While still being efficent enough to not block further development, which is quite a challenge when you 
                            are executing 2500 UI test cases. We did this by leveraging a feature in Github actions called matrix, and a 
                            playwright feature called sharding. With this we were able to divide the test suite into small sections divided 
                            by the number of shards, each of the browsers that Playwright supports, and pass them into the github matrix. This
                            would then create hundreds of small jobs, only downloading and installing the right browsers, and completing the 
                            entire test sutie in around 5 minutes.
                        </p>
                        <p class="card-text">
                            Coupling this with a listener on <b>AWS</b> that would track incoming requests for a service on Github actions, then 
                            spin up a new server that contained a pre-built image for our QA build. Then be assigned the jobs outside of the matrix. 
                            Once they were no longer needed they would be collapsed and removed. By doing this we were able to drastically reduce 
                            execution time, without sacraficing the test suites value.
                        </p>
                        <p class="card-text">
                            Once the infrastructure to handle massive test suites was completed, we began to expand the automation engineer team, adding 2 
                            additional automation engineers, who I then mentored on automation practices, <b>Typescript</b> development, 
                            <b>Data Driven Testing</b>, and then managed their resourcing to different products within Atreo.io. I also helped design and 
                            implement the hiring test to assess the skill levels of new incoming automation engineers, this allowed us to gauge an 
                            individual's speed in learning a new automation framework, and got them more familiar with the company by having them crawl 
                            on our corporate website. 
                        </p>
                        <h6><b>Achievements</b></h6>
                        <ul>
                            <li>
                                Reduced testing time, from 2 weeks to 2 hours, in a highly standardized industry, enabling organizations to meet tight project timelines.
                            </li>
                            <li>
                                Decreased AWS expenses by 70% by improving test efficiency and optimizing backend testing leading to significant cost savings for the organization.
                            </li>
                            <li>
                                Minimized testing timeline from 2 weeks to 2 hours by revolutionizing RTSM industry's standard testing process through creating an automated test approach involving data driving test cases.
                            </li>
                            <li>
                                Improved testing process proficiency by creating a comprehensive test suite consisting of over 5000 test cases within a year while designing test cases to be applied for each client, developing test suites of over 2500 test cases in minutes.
                            </li>
                            <li>
                                Lead a small team of Automation Engineers, and up-skilled manual quality assurance engineers to quality automation engineers.
                            </li>
                        <ul>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function emcCard() {
    addToBody(`
        <div class="card mb-3 bg-transparent border-0" style="max-width: 100%;">
            <div class="row g-0 cardmargins">
                <div class="col-md-2 cardbackdrop">
                    <a href="https://www.emcins.com/">
                        <img src="./assets/emc_insurance.png" style="padding: 10px;" class="img-fluid rounded-start" alt="Atreo Logo">
                    </a>
                </div>
                <div class="col-md-10 cardbackdrop">
                    <div class="card-body">
                        <h5 class="card-title">EMC Insurance - QA Engineer 3 - 02/01/2021 - 07/23/2021</h5>
                        <p class="card-text">
                            After working with the QA team for several years at this point, I transitioned over to the QA department as a fully fledged
                            QA. I was assigned to the forms team, and was given a small team of contractors to help write up automated tests, and improve the
                            QA coverage on the forms team. During this time, I helped train my QA's on how to use ReadyAPI to create automated API tests, that would
                            request a form, and do a pixel-by-pixel comparison with the template to ensure that the forms generated matched with the requested design.
                            After working with the team for a few months I built out a series of documents that helped standardize our workflow, and dramatically improved 
                            the efficiency of the team. To such an extent that I no longer needed to request 5 contractors for the forms team, eventually rolling off 2 forms QA's
                            and by the time I left the role, I was able to leave without the role needing backfilled, and was taken over by one of the contractors I trained.
                        </p>
                        <h6><b>Achievements</b></h6>
                        <ul>
                            <li>
                                Built out standards and practices as well as training the QA contractors on those new standards, and guided them to adoption.
                            </li>
                            <li>
                                Over the course of 5 months, I was able to improve the teams efficiency to the point to where we could roll off 2 contractors, allowing
                                them to transition to more in need sections of the organization.
                            </li>
                        <ul>
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">EMC Insurance - Application Developer 2 - 08/15/2017 - 02/01/2021</h5>
                        <p class="card-text">
                            This was my first job after college, I was hired as a developer for the EMC bonds team, where I would work with a small scrum team 
                            to write and maintain the bonds software that EMC utilized. We were the first team to transition to a scrum team, and helped spearhead
                            the company wide adoption of the SCRUM framework. During this time, we transition from mostly writing mapper applications to creating web-based
                            applications. During this transition I helped train the team on how to code in JavaScript, and got everyone comfortable with web development. We eventually
                            brought in a new forms process that allowed us to imbed form fillable pdfs into our legacy website, and retrieve information from the form, and leverage the data
                            in a later process. 
                        </p>
                        <p class="card-text">
                            After we transitioned to writing most of our code in JavaScript, I went to the QA team to begin writing automated tests. At this point all of 
                            our testing was done by developers, and none of it was automated. After going to the the QA manager at the time started a pilot program to begin
                            training developers on how to write automated tests for the web applications. This served 2 purposes, to allow developers to streamline their
                            current QA process, and helped transition legacy developers over to more modern languages other than mapper. In our case we used Java, and Selenium. 
                            Before too long I was helping train other developers, while completing my work for the Bonds team. 
                        </p>
                        <p class="card-text">
                            After I had helped spin up the transition project for the QA team, the company began transitioning away from mapper, and began training the
                            entire development department on more modern languages then mapper such as C#. I worked with my team to show them the in's and out's of Visual Studio
                            and C#. After teaching them the principals of Object Orientated Programming, we began a transition to C#.
                        </p>
                        <h6><b>Achievements</b></h6>
                        <ul>
                            <li>
                                With the team, we were the first SCRUM team at EMC insurance, and spearheaded the company wide adoption of SCRUM.
                            </li>
                            <li>
                                Designed and architected the adoption of the vendor that allowed us to utilize the innumerable forms that are within bonds,
                                Then trained the team on JavaScript, while developing the new feature.
                            </li>
                            <li>
                                Worked with the QA team to be the first legacy dev team to begin developing automated tests with Selenium.
                            </li>
                            <li>
                                Helped the QA team develop the hybrid QA/Developer role, then began training other hybrid developers on how to write and 
                                maintain automated tests, and how to leverage their routine automation within Jenkins.
                            </li>
                            <li>
                                Trained and worked with the rest of my bonds team to prepare them to transition from mapper to C# as the company transitioned to a modern language.
                            </li>
                        <ul>
                    </div>
                </div>
            </div>
        </div>
    `);
}

function geekSquadCard() {
    addToBody(`
        <div class="card mb-3 bg-transparent border-0" style="max-width: 100%;">
            <div class="row g-0 cardmargins">
                <div class="col-md-2 cardbackdrop">
                    <a href="https://geeksquad.com/">
                        <img src="./assets/geek_squad.png" style="padding: 10px;" class="img-fluid rounded-start" alt="Atreo Logo">
                    </a>
                </div>
                <div class="col-md-10 cardbackdrop">
                    <div class="card-body">
                        <h5 class="card-title">Geek Squad - Consultation Agent - 07/01/2015 - 08/15/2017</h5>
                        <p class="card-text">
                            I was a consultation agent for Geek Squad while I was attending Des Moines Area Community College. During this time, I
                            became adept at interacting with customers, and prospective clients. We would routinely help people through all manner of
                            issues and would frequently work to free customer devices from different malware. Not only this but I also leveraged my skills
                            in programming to recreate certain scams in a controlled environment, then educate the customer on how to get themselves out.
                        </p>
                        <h6><b>Achievements</b></h6>
                        <ul>
                            <li>
                                Created the scam simulator website, that would act as some malicious ads were at the time, for example requiring customers 
                                to call a number to remove a pop up that would lock down their browser by throwing an alert in a loop. 
                            </li>
                        <ul>
                    </div>
                </div>
            </div>
        </div>
    `);
}