export const jobs = [
    {
        website: "https://blackpointcyber.com/",
        logo: "./assets/blackpointlogo.png",
        roles: [{
            title: "Blackpoint Cyber - QA Manager - 05/21/2023 - Current",
            paragraphs:[
                    {
                        title: "Why I was hired",
                        text : "I was hired as the QA manager to help build out Blackpoint Cyber's QA department, which at the time consisted of only 3 QA, who had all started less then a year before me. Blackpoint Cyber was also begining the pursuit of automated testing with playwright so I was brought on to help train a small group of manual QA's to use playwright test, as well as hire multiple new manual QA's to also train."
                    },
                    {
                        title: "Playwright Training",
                        text : "I started by creating an extensively documented, and recorded course on playwright stored within the teams confluence page. Allowing my team to progress on the training as they had time, so this way we could progress on company projects while improving their skills. The training course consisteted of not only utilizing playwright but also teaching them how to code with typescript."
                    },
                    {
                        title: "Team Expansion",
                        text : "After the training course was finished I brought in 2 new QA testers to the team, and started training them utilizing the course that I had created. Initially we followed an embedded approach to the team, however engineering had an influx of projects to complete, during this time. I helped more directly manage my team to help keep them going during the context switching of multiple teams and projects, as well as helping to manage releases."
                    },
                    {
                        title: "Swarm of projects, and bug squashing",
                        text : "During this breakneck pace of development, bugs started to get into production, so I worked with the other leaders in engineering to come up with a solution to dramatically reduce high impact production bugs (90%) without cutting velocity. This breakneck pace continued from Q3, to Q4, where I had to more directly lead my team to keep the pace without sacraficing quality. Once completed we had managed to convince the organization to move away from chaotically throwing developers to different teams to maintain an unsustainable velocity, and got static product teams re-established."
                    },
                    {
                        title: "Shift Left",
                        text : "With formal product teams formed again I was able to directly imbed by QA team into those teams, and begin working on a few new different processes. First was an implementation of shift left, by working with the project managers, and other engineering teams I created formalized deliverables at each stage of the project lifecycle, and got QA brought into the project meetings. The organizations embrace of shift left that I pushed once again dramatically reduced the number of bugs found during development, and the number of bugs released into production. Development bugs went from 300-400 in the first projects we tested, down to about 20. With production bugs being down to 2-3, each had no revenue impact, and were counted as low impact bugs for rare edge cases."
                    },
                    {
                        title: "Embedded QA's",
                        text : "With the switches to shift left, and fully embedded QA's I had started getting more requests on increasing transparency on QA processes that were followed. So I developed an extensive test plan template and worked with the rest of the engineering leaders to ensure we were covering all our bases. Then trained the team on these new expectations, and helped mentor them in the templates utilization for the first few projects."
                    },
                    {
                        title: "Test Case Review",
                        text : "Now with the team operating as a well oiled machine, fully integrated into the development teams. As well as dramatically improving the quality of releases going to production. I began implementing a test case review process. Since each test case created for each project had to be hand crafted and detailed in Jira I began reviewing the older test cases in the company to make sure they are kept up to our standards, while my team was chipping away at reviewing the test cases that they were creating in their day to day work."
                    },
                    {
                        title: "Automation First",
                        text : "Now with the team operating as a well oiled machine, fully integrated into the development teams. As well as dramatically improving the quality of releases going to production. I began implementing a test case review process. Since each test case created for each project had to be hand crafted and detailed in Jira I began reviewing the older test cases in the company to make sure they are kept up to our standards, while my team was chipping away at reviewing the test cases that they were creating in their day to day work."
                    },
                    {
                        title: "Endpoint Automation",
                        text : "We have some very complex software at Blackpoint Cyber, and much of the complexity centers around our agents (think an antivirus, that acts as a hacker defense tool as well). This complexity makes testing the agent extremely arduous and complex, as well as risky, as we all found out with the Crowdstrike incident. We needed a testing framework that could perform end to end tests on our headless agent, this way we never have our own global incident. This tool performs actions on a machine designed to trigger events, and then validates that the agent performs as expected, but most importantly it does this on newly created devices for any version of windows that is supported, allowing us to have a clean test each time, and it performs the tests within about 10 minutes. Not only did this shave off 3 days of manual testing from 1 test, but this means we can test our agent for critical failures like the Crowdstrike issue in the developers CI, preventing the breaking code from ever leaving the PR stage."
                    },
                    {
                        title: "Team change",
                        text : "With the teams’ earlier shift left the business decided it was time to fully move the embedded QA engineers over to the engineering managers in charge of the dev teams, during this time I took over as the engineering manager for the QA automation team. In which I left my embedded QA’s a few small projects to help grow them into senior QAs and began assessing my new team’s position within the company. As we helped cover off quality gaps in a few big migrations across the board, we worked to improve the end-to-end regression suite, reducing the run time from 1 hour for 175 test cases down to 10 minutes. This time hack even persisted once we added 50 more test cases."
                    },
                    {
                        title: "Shift Right",
                        text : "Now that we had a well-oiled QA machine embedded within the developer teams, we started to look at other areas for quality improvement, now in most organizations, there are interdependencies between services that are hard to map, and even harder to test. Leaving a gap in testing where bugs can slip through shift left can help to counter this, but shift right is one of the best approaches you can take to counter act these issues especially if a shift left approach is already implemented and able to catch 90% of the bugs. This is where my new team comes in, we review test plans, and act as agents of the customer, while primarily writing end to end tests that focus on full complex flows designed to expose interdependencies. We do this with new layers of end-to-end testing within the regression test, as well as implementing production test cases that serve as canaries in the coal mine. Alerting us to issues ideally before customers are even impacted. Since adding shift right to our overall QA strategy my team has prevented dozens of bugs from going into production, and caught gaps within existing test plans. "
                    }
                ],
            achievements: {
                title: "Achievements",
                list: [
                    "Reduced bug ticket count from 300-400 from the initial project down to 20.",
                    "Trained a manual QA team to use Typescript, and Playwright and begin writing automated tests",
                    "Managed the quality of 10 projects in 8 months",
                    "Implemented the test case review process and brought up our test suite to 200 automated tests",
                    "Successfully transitioned QA organization from a reactive testing group to a well oiled shift left org",
                    "Brought down regression test time from 1 hour for 175 tests to 10 minutes, regardless of test volume"
                ]
            }
        }]
    },
    {
        website: "https://www.lyft.com/",
        logo: "./assets/lyft-logo-transparent.png",
        roles: [{
            title: "Lyft - Software Engineer in Test - 09/15/2022 - 04/28/2023",
            paragraphs:[
                    {
                        title: "",
                        text : "Lyft was my first breakthrough into a big tech organization, here I was hired to be a Software developer in test, with the core tech stack being Kotlin/Espresso for android testing, and Swift/XCUITest for mobile testing. As SDET's for Lyft we were not only charged with building and expanding upon the mobile testing frameworks, but also leading the charge for quality assurance on an individual project level. We would be assigned to a specific project, and then we would create a comprehensive test plan to be manually tested through the project's development."
                    },
                    {
                        title: "",
                        text : "This iterative approach is known as <a href=\"https://www.testim.io/blog/shift-left-testing-guide/\">Shift Left Testing </a> allowed us create an extensive test plan, and keep the projects quality high through the whole development cycle. Once a project was completed, we would assess the project for regression tests, and add them to our weekly release testing cycle. From there we would begin to automate our tests."
                    },
                    {
                        title: "",
                        text : "Once we assess the automatable test scenarioes we would divide the test cases into several different test applications."
                    },
                    {
                        title: "",
                        text : "<ul><li>UI Testing (Espresso/XCUITest) - We leveraged these tools for UI tests that required navigation to other screens.</li><li><a href=\"https://eng.lyft.com/shift-left-ios-testing-with-focus-flows-c9e050bd2095\">Focus Flow Testing</a> - This was used for testing 1 single screen quickly with a drastically reduced build time</li><li>Acceptance Testing - was an in house framework for API flow testing, allowing us to test more expansive test flows that could involve multiple apps, or users</li></ul>"
                    },
                    {
                        title: "",
                        text : "Once we had our tests automated, we would set up our jobs in Buildkite to automatically run (normally daily), and give the developers the ability to run the suites through their PR's on github directly."
                    }
                ],
            achievements: {
                title: "Achievements",
                list: [
                    'Boosted manual test efficiency by 20x by formulating a testing process for multi-phone test cases, allowing any employee to test a complex feature individually.',
                    'Reduced manual efforts required to test driver bonuses from 2 hours to 2 minutes by collaborating with SDETs to develop a new process, allowing for instant bonus creation via <b>Python</b>',
                    'Lowered manual testing efforts through automation from 16 hours to 2 hours by prioritizing high-value tests for automation, and optimizing testing coverage.',
                    'Minimized regression testing time by 75% from 16 hours to 4 hours through strategic automation development, improving testing efficiency and effectiveness.',
                    'Implemented a new testing tool and mentored execution of use cases, resulting in a 25% reduction in test execution time and an overall enhancement of the testing suites.',
                    'Created and pushed new automation best practices to follow to reduce weekly maintaince load on test engineers, while expanding test suite to focus on the highest value items.'
                ]
            }
        }]
    },
    {
        website: "https://www.atreo.io/",
        logo: "./assets/Atreo_logo_transparent.png",
        roles: [{
            title: "Atreo.io - Software Automation Engineer - 07/23/2021 - 09/15/2022",
            paragraphs:[
                    {
                        title: "",
                        text : "I was hired around the initial development of atreo's software, initially I helped expand out a <b>.net</b> API that existed to help translate test results from unit, integrations, and UI tests. Then convert them into <b>SpiraTeam</b> test cases and executions. After creating that initial support infastructure I began to create <b>Playwright</b> UI tests, where I would develop extensive, and versitile new test suites for each feature they developed."
                    },
                    {
                        title: "",
                        text : "Once the tests were created we needed a reliable way to execute the tests directly on the developers PR's While still being efficent enough to not block further development, which is quite a challenge when you are executing 2500 UI test cases. We did this by leveraging a feature in Github actions called matrix, and a playwright feature called sharding. With this we were able to divide the test suite into small sections divided by the number of shards, each of the browsers that Playwright supports, and pass them into the github matrix. This would then create hundreds of small jobs, only downloading and installing the right browsers, and completing the entire test sutie in around 5 minutes."
                    },
                    {
                        title: "",
                        text : "Coupling this with a listener on <b>AWS</b> that would track incoming requests for a service on Github actions, then spin up a new server that contained a pre-built image for our QA build. Then be assigned the jobs outside of the matrix. Once they were no longer needed they would be collapsed and removed. By doing this we were able to drastically reduce execution time, without sacraficing the test suites value."
                    },
                    {
                        title: "",
                        text : "Once the infrastructure to handle massive test suites was completed, we began to expand the automation engineer team, adding 2 additional automation engineers, who I then mentored on automation practices, <b>Typescript</b> development, <b>Data Driven Testing</b>, and then managed their resourcing to different products within Atreo.io. I also helped design and implement the hiring test to assess the skill levels of new incoming automation engineers, this allowed us to gauge an individual's speed in learning a new automation framework, and got them more familiar with the company by having them crawl on our corporate website."
                    }
                ],
            achievements: {
                title: "Achievements",
                list: [
                    'Reduced testing time, from 2 weeks to 2 hours, in a highly standardized industry, enabling organizations to meet tight project timelines.',
                    'Decreased AWS expenses by 70% by improving test efficiency and optimizing backend testing leading to significant cost savings for the organization.',
                    'Minimized testing timeline from 2 weeks to 2 hours by revolutionizing RTSM industry\'s standard testing process through creating an automated test approach involving data driving test cases.',
                    'Improved testing process proficiency by creating a comprehensive test suite consisting of over 5000 test cases within a year while designing test cases to be applied for each client, developing test suites of over 2500 test cases in minutes.',
                    'Lead a small team of Automation Engineers, and up-skilled manual quality assurance engineers to quality automation engineers.'
                ]
            }
        }]
    },
    {
        website: "https://www.emcins.com/",
        logo: "./assets/emc_insurance.png",
        roles: [{
            title: "EMC Insurance - QA Engineer 3 - 02/01/2021 - 07/23/2021",
            paragraphs:[
                    {
                        title: "",
                        text : "After working with the QA team for several years at this point, I transitioned over to the QA department as a fully fledged QA. I was assigned to the forms team, and was given a small team of contractors to help write up automated tests, and improve the QA coverage on the forms team. During this time, I helped train my QA's on how to use ReadyAPI to create automated API tests, that would request a form, and do a pixel-by-pixel comparison with the template to ensure that the forms generated matched with the requested design. After working with the team for a few months I built out a series of documents that helped standardize our workflow, and dramatically improved the efficiency of the team. To such an extent that I no longer needed to request 5 contractors for the forms team, eventually rolling off 2 forms QA's and by the time I left the role, I was able to leave without the role needing backfilled, and was taken over by one of the contractors I trained."
                    }
                ],
            achievements: {
                title: "Achievements",
                list: [
                    'Built out standards and practices as well as training the QA contractors on those new standards, and guided them to adoption.',
                    'Over the course of 5 months, I was able to improve the teams efficiency to the point to where we could roll off 2 contractors, allowing them to transition to more in need sections of the organization.'
                ]
            }
        },
        {
            title: "EMC Insurance - Application Developer 2 - 08/15/2017 - 02/01/2021",
            paragraphs:[
                    {
                        title: "",
                        text : "This was my first job after college, I was hired as a developer for the EMC bonds team, where I would work with a small scrum team to write and maintain the bonds software that EMC utilized. We were the first team to transition to a scrum team, and helped spearhead the company wide adoption of the SCRUM framework. During this time, we transition from mostly writing mapper applications to creating web-based applications. During this transition I helped train the team on how to code in JavaScript, and got everyone comfortable with web development. We eventually brought in a new forms process that allowed us to imbed form fillable pdfs into our legacy website, and retrieve information from the form, and leverage the data in a later process."
                    },
                    {
                        title: "",
                        text : "After we transitioned to writing most of our code in JavaScript, I went to the QA team to begin writing automated tests. At this point all of our testing was done by developers, and none of it was automated. After going to the the QA manager at the time started a pilot program to begin training developers on how to write automated tests for the web applications. This served 2 purposes, to allow developers to streamline their current QA process, and helped transition legacy developers over to more modern languages other than mapper. In our case we used Java, and Selenium. Before too long I was helping train other developers, while completing my work for the Bonds team."
                    },
                    {
                        title: "",
                        text : "After I had helped spin up the transition project for the QA team, the company began transitioning away from mapper, and began training the entire development department on more modern languages then mapper such as C#. I worked with my team to show them the in's and out's of Visual Studio and C#. After teaching them the principals of Object Orientated Programming, we began a transition to C#."
                    }
                ],
            achievements: {
                title: "Achievements",
                list: [
                    'With the team, we were the first SCRUM team at EMC insurance, and spearheaded the company wide adoption of SCRUM.',
                    'Designed and architected the adoption of the vendor that allowed us to utilize the innumerable forms that are within bonds, Then trained the team on JavaScript, while developing the new feature.',
                    'Worked with the QA team to be the first legacy dev team to begin developing automated tests with Selenium.',
                    'Helped the QA team develop the hybrid QA/Developer role, then began training other hybrid developers on how to write and maintain automated tests, and how to leverage their routine automation within Jenkins.',
                    'Trained and worked with the rest of my bonds team to prepare them to transition from mapper to C# as the company transitioned to a modern language.'
                ]
            }
        }]
    },
    {
        website: "https://geeksquad.com/",
        logo: "./assets/geek_squad.png",
        roles: [{
            title: "Geek Squad - Consultation Agent - 07/01/2015 - 08/15/2017",
            paragraphs:[
                    {
                        title: "",
                        text : "I was a consultation agent for Geek Squad while I was attending Des Moines Area Community College. During this time, I became adept at interacting with customers, and prospective clients. We would routinely help people through all manner of issues and would frequently work to free customer devices from different malware. Not only this but I also leveraged my skills in programming to recreate certain scams in a controlled environment, then educate the customer on how to get themselves out."
                    }
                ],
            achievements: {
                title: "Achievements",
                list: [
                    'Created the scam simulator website, that would act as some malicious ads were at the time, for example requiring customers to call a number to remove a pop up that would lock down their browser by throwing an alert in a loop.'
                ]
            }
        }]
    }
]