function contactMePage() {
    clearBody();
    contactMeCard();
}

function contactMeCard() {
    addToBody(`
        <div class="card mb-3 bg-transparent border-0" style="max-width: 100%;">
            <div class="row g-0 cardmargins">
                <div class="col-md-12 cardbackdrop">
                    <div class="card-body">
                        <h5 class="card-title">Contact me!</h5>
                        <p class="card-text">
                            I am always open to hearing about new job opportunities, so if you are reading this page and have any roles
                            that match feel free to reach out.                          
                        </p>
                        <h6><b>Title's I will interview for:</b></h6>
                        <ul>
                            <li>
                                Senior Software Developer In Test (SDET)
                            </li>
                            <li>
                                Senior Automation Engineer
                            </li>
                            <li>
                                Quality Assurance Manager
                            </li>
                            <li>
                                Director of Quality Assurance
                            </li>
                        </ul>
                        <h6><b>Methods of contact</b></h6>
                        <ul>
                            <li>
                                <b>Phone:</b>515-864-6382 (preferred)
                            </li>
                            <li>
                                <b>Email:</b>davgor4@gmail.com
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/in/davgor4/">LinkedIn</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `);
}