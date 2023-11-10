import axios from 'axios';

export const getUnsplashImage = async (query: string) => {
  let searchQuery = encodeURIComponent(query);
  const { data } = await axios.get(`
    https://api.unsplash.com/search/photos?per_page=1&query=${searchQuery}&client_id=MkFmjG38_2trxQ2okPRRLcZvefYsVosFVX6FvccF00s
    `);

  console.log(
    "image data",
    data.results.urls,
    data.results.links,
    data.results.topic_submissions,
    data.results.user,
    data.results.tags
  );
  return data.results;
};
