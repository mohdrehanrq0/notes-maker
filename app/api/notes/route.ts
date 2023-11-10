import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
} from "langchain/prompts";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

import { prisma } from "@/lib/db";
import { searchYoutube } from "@/lib/youtube";

const zodParser = z.object({
  topics: z.array(z.string()),
  unitName: z.string(),
  chapterNumber: z.number(),
});
const notes_parser_openai = z.array(
  z.object({
    topic: z.string().describe("topic name that you have explain"),
    explanation: z
      .string()
      .describe("it is the explanation of the given topic"),
    extraPoints: z
      .array(
        z.object({
          name: z
            .string()
            .describe(
              "it is the name of the thing that is explain that means its a feature, characteristics, advantages, disadvantages or types"
            ),
          explanationExtra: z.array(
            z.object({
              topic: z
                .string()
                .describe("name of the topic that you are explaining"),
              description: z
                .string()
                .describe("explanation of the topic in 250 words"),
            })
          ),
        })
      )
      .describe(
        "it is the extra feature, characteristics or types of the given subtopic"
      ),
    youtube_search_query: z
      .string()
      .describe("search query for the youtube api"),
    // image_search_query: z
    //   .string()
    //   .describe("search query for the unsplash api"),
  })
);
const systemPrompt = `I have given you the {topic} which is array of string separated by commas which is a subtopics of {unit}. You have to take every subtopic from an array and  explain each of it in the way that you are explain it to an 10-year-old student. Use simple language, with example and provide a overview of what subtopic is and why it's important or interesting in 250 words. If there's a notable feature, characteristics, advantage, disadvantage and types associated with subtopic than explain that also in brief,for every subtopic you have to give me the four thing that is "topic" name that you have explained, "explanation" for that subtopic, some notable feature, characteristics,advantages, disadvantages or types  explain that in "extraPoints", "extraPoints" is an array of an object in that their is "name" which can be types, characteristic ,advantages, disadvantages or notable feature, their is also "explanationExtra" that is array of object in that you have to describe the feature, characteristic, advantages, disadvantages or types that contain "topic" of that and "description" in 200 words, it is mandatory that that you have to give data in "extraPoints", "youtube_search_query" which I can feed in youtube api for searching the video relevant to that subtopic in hindi language`;

export const createNotesOpenAI = async (topics: string[], unitName: string) => {
  const openAiParser =
    StructuredOutputParser.fromZodSchema(notes_parser_openai);
  const output_format = openAiParser.getFormatInstructions();
  const promptTemplate = new PromptTemplate({
    template: systemPrompt + "\n {output_format}",
    inputVariables: ["topic", "unit"],
    partialVariables: { output_format: output_format },
  });
  const humanMessage = new HumanMessagePromptTemplate({
    prompt: promptTemplate,
  });
  const chatPromptTemplate = ChatPromptTemplate.fromMessages([humanMessage]);

  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    openAIApiKey: process.env.OPENAI_API_KEY,
    temperature: 0.7,
  });
  const chain = new LLMChain({
    prompt: chatPromptTemplate,
    llm: model,
  });

  const response = await chain.call({
    topic: topics,
    unit: unitName,
    formatInstructions: output_format,
  });
  const Response = response.text;
  const Json = await openAiParser.parse(Response);
  return { Json };
};

export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    const data = zodParser.safeParse(body);

    if (!data.success) {
      return NextResponse.json({
        success: false,
        message: "payload is incorrect",
      });
    }

    const { Json } = await createNotesOpenAI(
      data.data.topics,
      data.data.unitName
    );

    let updatedResponse: any = [];

    for (var i of Json) {
      let ytVideosArr = await searchYoutube(i.youtube_search_query);
      ytVideosArr = ytVideosArr.map((e: any) => e.id.videoId);
      updatedResponse.push({ ...i, youtubeIds: ytVideosArr });
    }
    console.log(updatedResponse, Json);

    const dataForChatDatabase = {
      unitName: data.data.unitName,
      topics: JSON.stringify(data.data.topics),
      chapterNumber: data.data.chapterNumber,
    };

    const createChat = await prisma.unitData.create({
      data: dataForChatDatabase,
    });

    for (const data of updatedResponse) {
      const responseData = await prisma.responseModel.create({
        data: {
          explanation: data.explanation,
          topic: data.topic,
          youtube_search_query: data.youtube_search_query,
          youtubeIds: JSON.stringify(data.youtubeIds),
          unitDataId: createChat.Id,
        },
      });

      for (const pointsData of data.extraPoints) {
        const extraPointData = await prisma.extraPointsModel.create({
          data: {
            name: pointsData.name,
            responseModelId: responseData.Id,
          },
        });
        await prisma.explanationExtraModel.createMany({
          data: pointsData.explanationExtra.map((data: any) => {
            return {
              topic: data.topic,
              description: data.description,
              extraPointsId: extraPointData.Id,
            };
          }),
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: createChat,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse("invalid body", { status: 400 });
    }
    console.error(error);
  }
};

export const GET = async (req: Request, res: Response) => {
  const data = await prisma.unitData.findMany({
    include: {
      response: {
        include: {
          extraPoints: {
            include: {
              explanationExtra: true,
            },
          },
        },
      },
    },
  });
  return NextResponse.json({
    success: true,
    data,
  });
};
