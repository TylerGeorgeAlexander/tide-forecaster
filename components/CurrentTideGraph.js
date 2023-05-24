// components/CurrentTideGraph.js
import { Line } from 'react-chartjs-2';

const CurrentTideGraph = ({ pastData }) => {
  if (!pastData) {
    return <p>Loading...</p>;
  }

  const labels = pastData.map(item => new Date(item.t).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Tide Height (m)',
        data: pastData.map(item => parseFloat(item.v)), // Assuming similar format to past data
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
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
      <h1>Ocean Tide Data - Next 24 Hours from Current</h1>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default CurrentTideGraph;
