// components/TideGraphs.js
import { useEffect, useState } from 'react';
import PastTideGraph from './PastTideGraph';
import CurrentTideGraph from './CurrentTideGraph';

const TideGraphs = () => {
  const [pastData, setPastData] = useState(null);

  useEffect(() => {
    const fetchPastTideData = async () => {
      try {
        // Existing code to fetch past tide data ...

        const fetchedData = await response.json();

        const graphData = fetchedData.predictions.map(item => ({
          t: new Date(item.t),
          v: parseFloat(item.v)
        }));

        setPastData(graphData);
      } catch (error) {
        console.error('Error fetching past tide data:', error);
      }
    };

    fetchPastTideData();
  }, []);

  return (
    <div>
      {pastData ? (
        <>
          <PastTideGraph data={pastData} />
          <CurrentTideGraph pastData={pastData} />
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default TideGraphs;
