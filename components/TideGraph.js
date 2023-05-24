import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

const TideGraph = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchTideData = async () => {
      try {
        const response = await fetch('/api/tide-data');
        const { predictions } = await response.json();
        setData(predictions);
      } catch (error) {
        console.error('Error fetching tide data:', error);
      }
    };

    fetchTideData();
  }, []);

  if (!data) {
    return <p>Loading...</p>;
  }

  const chartData = {
    labels: data.map(prediction => new Date(prediction.t)),
    datasets: [
      {
        label: 'Tide Height (m)',
        data: data.map(prediction => parseFloat(prediction.v)),
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'hour',
          displayFormats: {
            hour: 'HH:mm',
          },
        },
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Tide Height (m)',
        },
      },
    },
  };

  return (
    <div>
      <h1>Ocean Tide Data - Previous 24 Hours</h1>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TideGraph;
