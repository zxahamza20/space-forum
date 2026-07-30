import axios from 'axios';

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';
const APOD_URL = 'https://api.nasa.gov/planetary/apod';
const SEARCH_URL = 'https://images-api.nasa.gov/search';

export const fetchAstronomyPictureOfDay = async () => {
  try {
    const response = await axios.get(`${APOD_URL}?api_key=${NASA_API_KEY}`);
    return {
      title: response.data.title,
      url: response.data.url,
      mediaType: response.data.media_type,
      description: response.data.explanation,
    };
  } catch (error) {
    console.error('Error fetching APOD:', error);
    throw error;
  }
};

export const searchNasaLibrary = async (query) => {
  try {
    const response = await axios.get(`${SEARCH_URL}?q=${encodeURIComponent(query)}&media_type=image`);
    const items = response.data.collection.items.slice(0, 6); 
    return items.map((item) => ({
      id: item.data[0].nasa_id,
      title: item.data[0].title,
      url: item.links ? item.links[0].href : '',
      description: item.data[0].description || '',
    }));
  } catch (error) {
    console.error('Error searching NASA library:', error);
    throw error;
  }
};