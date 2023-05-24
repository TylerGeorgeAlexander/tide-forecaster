import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import * as tf from '@tensorflow/tfjs';
import trainModel from '../utils/trainModel';

const PredictionTideGraph = ({ pastData }) => {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    const makePredictions = async () => {
      // Get min and max timestamp for normalization
      const timestamps = pastData.map(prediction => new Date(prediction.t).getTime());
      const minTimestamp = Math.min(...timestamps);
      const maxTimestamp = Math.max(...timestamps);

      // Process the data for training
      const trainingData = pastData.map(prediction => [
        (new Date(prediction.t).getTime() - minTimestamp) / (maxTimestamp - minTimestamp),
        prediction.v,
        // Additional features can be included here
        // For example: prediction.moonPhase, prediction.windSpeed, prediction.temperature
      ]);
      const trainingLabels = trainingData.map(dataPoint => dataPoint[1]);

      // Train the model
      const model = await trainModel(trainingData, trainingLabels);

      // Predict
      const currentTimestamp = new Date().setFullYear(2020);
      const predictionData = [];
      for (let i = 0; i <= 24; i++) {
        const futureTimestamp = currentTimestamp + i * 60 * 60 * 1000; // 1 hour = 60*60*1000 milliseconds
        predictionData.push([
          (futureTimestamp - minTimestamp) / (maxTimestamp - minTimestamp),
          trainingData[trainingData.length - 1][1],
          // Additional features can be included here
          // For example: futureMoonPhase, futureWindSpeed, futureTemperature
        ]);
      }
      const xs = tf.tensor2d(predictionData, [predictionData.length, 2]); // Adjust shape based on the number of features
      const predictionResults = model.predict(xs).arraySync();
      setPredictions(predictionResults.map(prediction => prediction[0]));
    };

    makePredictions();
  }, [pastData]);

  const labels = pastData.map(item => {
    return new Date(item.t).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });

  const chartData = {
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
          text: 'Time (Hours)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Tide Height',
        },
      },
    },
  };

  return (
    <div>
      <h1>Ocean Tide Prediction - Next 24 Hours from 2020</h1>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PredictionTideGraph;
