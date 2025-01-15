import axios from 'axios';

const API_URL = 'https://lol.fandom.com/api.php';

export async function fetchApiImage(filename: string): Promise<any> {
  console.time("fetchApiImage");
  // Construct the CargoQuery API request
  const params = {
    action: 'query',
    format: 'json',
    origin: '*',
    titles: `File:${filename}`,
    prop: 'imageinfo',
    iiprop: "url",
  };

  try {
    // Perform the API request
    const response = await axios.get(API_URL, { params });

    // Parse and map the results to the Tournament interface
    //console.log('API Response:', response.data);
    const pages = response.data.query.pages;
    const firstPageKey = Object.keys(pages)[0];
    const resultImageURL = pages[firstPageKey]?.imageinfo?.[0].url;
    //console.log('Image URL:', resultImageURL);
    let result = new URL(resultImageURL);
    result.search = "";
    return result.href.split(".png")[0].concat(".png");
  } catch (error) {
    console.error('Error fetching tournament data:', error);
    throw error;
  } finally {
    console.timeEnd("fetchApiImage");
  }
}