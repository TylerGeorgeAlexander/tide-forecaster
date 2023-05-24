// pages/index.js
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import * as tf from '@tensorflow/tfjs';
import trainModel from '../utils/trainModel';
import TideGraph from '../components/TideGraph'

const IndexPage = () => {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const fetchTideData = async () => {
      const response = await fetch('https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?date=today&station=9410230&product=predictions&datum=mllw&time_zone=lst_ldt&units=english&interval=hilo&format=json');
      const data = await response.json();

      // Get min and max timestamp for normalization
      const timestamps = data.predictions.map(prediction => new Date(prediction.t).getTime());
      const minTimestamp = Math.min(...timestamps);
      const maxTimestamp = Math.max(...timestamps);

      // Process the data for training
      const trainingData = data.predictions.map(prediction => [
        (new Date(prediction.t).getTime() - minTimestamp) / (maxTimestamp - minTimestamp),
        parseFloat(prediction.v)
      ]);
      const trainingLabels = trainingData.map(dataPoint => dataPoint[1]);

      // Train the model
      const model = await trainModel(trainingData, trainingLabels);

      // Predict
      const currentTimestamp = new Date().getTime();
      const predictionData = [];
      for (let i = 0; i <= 24; i++) {
        const futureTimestamp = currentTimestamp + (i * 60 * 60 * 1000);  // 1 hour = 60*60*1000 milliseconds
        predictionData.push([(futureTimestamp - minTimestamp) / (maxTimestamp - minTimestamp), trainingData[trainingData.length - 1][1]]);
      }
      const xs = tf.tensor2d(predictionData, [predictionData.length, 2]); // Adjust shape to [2]
      const predictionResults = model.predict(xs).arraySync();
      setPredictions(predictionResults.map(prediction => prediction[0]));
    };

    fetchTideData();
  }, []);

  const currentTimestamp = new Date().getTime();
  const labels = Array.from({ length: 25 }, (_, i) => {
    const futureTimestamp = new Date(currentTimestamp + (i * 60 * 60 * 1000));
    return futureTimestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Tide Prediction',
        data: predictions,
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time (Hours)'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Tide Height'
        }
      }
    }
  };

  return (
    <div>
      <h1>Ocean Tide Prediction</h1>
      <Line data={data} options={options} />
      <TideGraph />
    </div>
  );
};

export default IndexPage;
