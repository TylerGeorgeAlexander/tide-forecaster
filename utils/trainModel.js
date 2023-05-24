// utils/trainModel.js
import * as tf from '@tensorflow/tfjs';

const trainModel = async (data, labels) => {
  // Define the TensorFlow.js model
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [2] }));
  model.add(tf.layers.dense({ units: 1 }));

  const optimizer = tf.train.adam(0.01); // lower learning rate
  model.compile({ loss: 'meanSquaredError', optimizer });

  // Convert data to tensors
  const xs = tf.tensor2d(data, [data.length, 2]);
  const ys = tf.tensor2d(labels, [labels.length, 1]);

  // Train the model
  await model.fit(xs, ys, { epochs: 10 });

  return model;
};

export default trainModel;
