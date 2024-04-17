import axios from "axios";

export const searchYoutube = async (
  searchString: string
  // youtubeAPIKeys: string[]
) => {
  // const searchQuery = encodeURIComponent(searchString);
  // const { data } = await axios.get(
  //   `https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_API_KEY}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=2`
  // );
  // if (!data) {
  //   console.log("youtube fail");
  //   return null;
  // }
  // if (data.items[0] == undefined) {
  //   console.log("youtube fail");
  //   return null;
  // }
  // // console.log("yt data ====================", data.items);
  // return data.items;
  const youtubeAPIKeys = [
    process.env.YOUTUBE_API_KEY1,
    process.env.YOUTUBE_API_KEY2,
    process.env.YOUTUBE_API_KEY3,
    process.env.YOUTUBE_API_KEY4,
    process.env.YOUTUBE_API_KEY5,
    process.env.YOUTUBE_API_KEY6,
    process.env.YOUTUBE_API_KEY7,
    process.env.YOUTUBE_API_KEY8,
    process.env.YOUTUBE_API_KEY9,
    process.env.YOUTUBE_API_KEY10,
    process.env.YOUTUBE_API_KEY11,
    process.env.YOUTUBE_API_KEY12,
    process.env.YOUTUBE_API_KEY13,
    process.env.YOUTUBE_API_KEY14,
    process.env.YOUTUBE_API_KEY15,
    process.env.YOUTUBE_API_KEY16,
    process.env.YOUTUBE_API_KEY17,
    process.env.YOUTUBE_API_KEY18,
    process.env.YOUTUBE_API_KEY19,
    process.env.YOUTUBE_API_KEY20,
    process.env.YOUTUBE_API_KEY21,
    process.env.YOUTUBE_API_KEY22,
  ];
  for (const apiKey of youtubeAPIKeys) {
    try {
      const searchQuery = encodeURIComponent(searchString);
      const { data } = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${searchQuery}&videoDuration=medium&videoEmbeddable=true&type=video&maxResults=2`
      );
      if (data && data.items && data.items.length > 0) {
        return data.items;
      }
    } catch (error) {
      console.error("YouTube API request failed with API key:", apiKey);
    }
  }
  console.log("All YouTube API requests failed");
  return null;
};

// const systemPrompt = `I have given you the {topic} in context of {unit}. You have to explain that {topic} in 200 words to a 10 year old student. Use simple language, provide a overview of what {topic} and why it's important and interesting and remember you have to give the response explanation in single paragraph, do not use new line character and double quote. If there's a notable feature ,application, characteristics,example, advantage, disadvantage and types associated with {topic} than explain that also in brief in "extraPoints". Ensure there are no newline characters in the explanation.`;

// const systemPrompt = `Describe {topic} in context of {unit} (around 180 words )  in a way that a  Indian college students understand who may have a limited understanding of English,  can grasp easily. Use simple language and relate {topic} to everyday life experiences. Provide a short overview (around 180 words) on what {topic} is, its importance, why it's interesting and organize the information logically.If {topic} involves any specific process steps, terms, noteworthy features, applications, characteristics, examples, advantages, disadvantages, or types, please outline them. Additionally, mention any notable advantages and disadvantages associated with {topic} in the "extraPoints" section if any. Include relevant examples if possible and it not mandatory that you have mention all in "extraPoints" if its important then only explain otherwise you can skip it and consider the diverse learning styles of the audience.Ensure the explanation is concise, don't use double quote and free of newline characters.`;

// const systemPrompt = `Describe the {topic} in the context of {unit} in around 150 words, ensuring clarity for Indian college students with limited English proficiency and can grasp easily. Use simple language and real-world examples to explain what {topic} is, its importance, and why it's interesting. and organize the information logically.If {topic} involves specific process steps, terms, noteworthy features, applications, characteristics, examples, advantages, disadvantages, or types, briefly outline them. However, keep the main explanation focused and concise. In the "extraPoints" section, provide additional details as needed, but prioritize brevity. Consider the diverse learning styles of the audience.Ensure the explanation is concise,in proper string format without using double quotes in explanation use only single quote, and free of newline characters.`;

// const systemPrompt = `Explain {topic} in {unit} concisely (100-120 words). Use simple language and real-world examples in the 'explanation'. If applicable, provide an 'example'. Focus on clarity and logic. Briefly touch on any process steps, terms, features, applications, etc., without newlines. Prioritize brevity. Consider diverse learning styles. Ensure the explanation is in proper string format (single quotes only) and without newlines. Limit the explanation to 50-80 words`;
