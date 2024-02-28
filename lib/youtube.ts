import axios from 'axios';

export const searchYoutube = async (searchString: string) => {
  const searchQuery = encodeURIComponent(searchString);
  const { data } = await axios.get(
    `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=2`
  );
  if (!data) {
    console.log("youtube fail");
    return null;
  }
  if (data.items[0] == undefined) {
    console.log("youtube fail");
    return null;
  }
  console.log("yt data ====================", data.items);
  return data.items;
};
