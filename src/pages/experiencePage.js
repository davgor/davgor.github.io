function experiencePage() {
    clearBody();
    jobs.forEach(element => {
        addToBody(jobCard(element));
    })
}
