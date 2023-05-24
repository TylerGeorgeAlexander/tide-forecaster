// pages/index.js
import { useState, useEffect } from 'react';
import PastTideGraph from '../components/PastTideGraph';
import CurrentTideGraph from '../components/CurrentTideGraph';
import PredictionTideGraph from '../components/PredictionTideGraph';
import fetchTideData from '../utils/fetchTideData';

const IndexPage = () => {
  const [pastData, setPastData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTideData(2020);
        setPastData(data);
      } catch (error) {
        console.error('Error fetching tide data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {pastData ? (
        <>
          <PastTideGraph data={pastData} />
          <CurrentTideGraph pastData={pastData} />
          <PredictionTideGraph pastData={pastData} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default IndexPage;
