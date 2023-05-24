import fetch from 'isomorphic-fetch';

const handler = async (req, res) => {
  try {
    const response = await fetch('https://api.tidesandcurrents.noaa.gov/api/datagetter?product=predictions&application=OpenAI&begin_date=20230523&end_date=20230524&datum=MLLW&station=9410230&time_zone=lst_ldt&units=metric&format=json');
    const { predictions } = await response.json();
    res.status(200).json({ predictions });
  } catch (error) {
    console.error('Error fetching tide data:', error);
    res.status(500).json({ error: 'Failed to fetch tide data' });
  }
};

export default handler;
