// utils/fetchTideData.js
const fetchTideData = async (year = 2020) => {
    const now = new Date();
    now.setFullYear(year);
  
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  
    const nowFormatted = now.toISOString().slice(0, 10).replace(/-/g, '');
    const oneDayFromNowFormatted = oneDayFromNow.toISOString().slice(0, 10).replace(/-/g, '');
  
    const response = await fetch(`https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&application=NOS.COOPS.TAC.WL&begin_date=${nowFormatted}&end_date=${oneDayFromNowFormatted}&datum=MLLW&station=9410230&time_zone=lst_ldt&units=english&interval=hilo&format=json`);
  
    const fetchedData = await response.json();
  
    const data = fetchedData.predictions.map(item => ({
      t: new Date(item.t),
      v: parseFloat(item.v)
    }));
  
    return data;
  };
  
  export default fetchTideData;
  