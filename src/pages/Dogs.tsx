import React from 'react';
import BlogCard from '../components/BlogCard';

const Dogs: React.FC = () => {
  return (
    <>
      <BlogCard
        title="My Dogs"
        content={[
          "I've got 3 dogs, each one of them is a unique bundle of chaos and love. If you work with me you will likely see or hear them on some occasion, 2 of them we rescued from a no kill shelter in Iowa, and one from the pound in north carolina. If you want to read more about them, keep scrolling!"
        ]}
      />
      <BlogCard
        title="Lestat, our little old man. Born in 2014"
        titleImage="./assets/lestat.jpg"
        content={[
          "German Shepard, terrier mix"
        ]}
      />
      <BlogCard
        title="Bilbo, our middle pup man. Born in 2019"
        titleImage="./assets/bilbo.jpg"
        content={[
          "Greyhound, Beagle mix"
        ]}
      />
      <BlogCard
        title="Dorian, our youngest pup. Born in 2020"
        titleImage="./assets/dorian.jpg"
        content={[
          "Malenois, Pit mix"
        ]}
      />
    </>
  );
};

export default Dogs;
