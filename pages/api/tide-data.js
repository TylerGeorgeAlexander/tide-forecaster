// pages/api/tide-data.js
import fetch from 'isomorphic-fetch';

const handler = async (req, res) => {
  try {
    // Get the current date and the date 24 hours ago
    const currentDate = new Date();
    const pastDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);

    // Format the dates for the API request
    const end_date = currentDate.toISOString().split('T')[0].replace(/-/g, '');
    const begin_date = pastDate.toISOString().split('T')[0].replace(/-/g, '');

    const response = await fetch(`https://api.tidesandcurrents.noaa.gov/api/datagetter?product=predictions&application=OpenAI&begin_date=${begin_date}&end_date=${end_date}&datum=MLLW&station=9410230&time_zone=lst_ldt&units=metric&format=json`);
    const { predictions } = await response.json();
    res.status(200).json({ predictions });
  } catch (error) {
    console.error('Error fetching tide data:', error);
    res.status(500).json({ error: 'Failed to fetch tide data' });
  }
};

export default handler;
