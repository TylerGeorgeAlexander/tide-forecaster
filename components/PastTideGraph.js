// components/PastTideGraph.js
import { Line } from 'react-chartjs-2';

const PastTideGraph = ({ data }) => {
  if (!data) {
    return <p>Loading...</p>;
  }

  const labels = data.map(item => new Date(item.t).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Tide Height (m)',
        data: data.map(item => parseFloat(item.v)),
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
      <h1>Ocean Tide Data - Next 24 Hours from 2020</h1>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PastTideGraph;
