import React from 'react';
import BlogCard from '../components/BlogCard';

const AboutMe: React.FC = () => {
  return (
    <BlogCard
      title="David Gorden - 9+ years experience"
      titleImage="/assets/fun_personal_photo.jpg"
      titleImageObjectPosition="left center"
      content={[
        'My name is David Gorden. I have been an engineer for over 9 years now. During this time I have consistently risen to the challenges presented, and I often naturally find myself adopting a leadership position within each employer.',
        "A bit of background as to who I am and how I got here: I went into the army when I was 20. I didn't know what I wanted to do. While I was in basic training, I was thinking truly about what I wanted to do post-military, and I realized the most fun I had doing work was when I was modding Oblivion as a teen. This motivation is what drove me into the computer science track. After doing some more research as to my career options, I realized programming and development was the specific section of game development I was interested in.",
        "After finishing my associate's degree, I got a job as a developer for a mid-sized insurance company in the Midwest. After developing for a time, I wanted to reduce the time I was spending completing manual tests on the webpages I was working on. After talking with the QA manager, they created and brought me into a pilot program where I learned how to write automated tests and implement them for our teams. That's how I found myself in Quality Engineering, and I love every minute of it.",
        'Outside of my professional story, I am a huge gamer. I play just about everything, on every game system. My most frequent game is currently Elder Scrolls Online, though I think Diablo IV is going to take over here soon. I also spend my quiet time painting miniatures for DND and Warhammer. It is definitely the dorkiest thing about me, but painting is such a relaxing activity, and an excellent way to reset your mind. I also have 3 dogs, Bilbo, Dorian, and Lestat. At the start of the pandemic we moved off to Shallotte, North Carolina to live close to the beach; one of those beaches is where that background photo is taken.',
      ]}
    />
  );
};

export default AboutMe;
