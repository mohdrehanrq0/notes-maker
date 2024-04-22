import { LLMChain } from "langchain/chains";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { StructuredOutputParser } from "langchain/output_parsers";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  PromptTemplate,
} from "langchain/prompts";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

import { prisma } from "@/lib/db";
import { searchYoutube } from "@/lib/youtube";

const zodParser = z.object({
  topics: z.array(z.string()),
  unitName: z.string(),
  chapterNumber: z.number(),
  course: z.string(),
  semester: z.string(),
  year: z.string(),
  branch: z.string(),
});

const getRequest = z.object({
  course: z.string().optional(),
  semester: z.string().optional(),
  year: z.string().optional(),
  branch: z.string().optional(),
});
const notes_parser_openai = {
  topic: z.string().describe(`topic name that you are explaining `),
  explanation: z
    .string()
    .describe(
      `explanation of the given topic in proper string format in 100 words and don't use double quote and new line character `
    ),
  example: z
    .string()
    .describe(
      `example of the given topic in proper string format in 150 words and don't use double quote and new line character `
    ),
  extraPoints: z
    .array(
      z.object({
        name: z
          .string()
          .describe(`it is the name of the thing that is explaining`),
        explanationExtra: z.array(
          z.object({
            topic: z
              .string()
              .describe(`name of the topic that you are explaining `),
            description: z
              .string()
              .describe(`explanation of the topic in 250 words `),
          })
        ),
      })
    )
    .optional()
    .describe(
      `When explaining a topic, consider including relevant details such as process steps, terms, noteworthy features, applications, characteristics, examples, advantages, disadvantages, or types if applicable. These elements provide a comprehensive understanding and context for the topic being discussed. Additionally, highlight any notable advantages and disadvantages associated with the topic to offer a balanced perspective. While it's essential to cover these aspects for clarity and depth, it's not mandatory to include all of them in every response. Instead, prioritize the information based on its importance and relevance to the audience. Ensure that the response is in proper JSON format and aligns with the specified schema. Consider the diverse learning styles and needs of the audience when crafting the content to ensure maximum comprehension and engagement`
    ),
};

// const systemPrompt = `Describe the {topic} in the context of {unit} in short around 70-80 words, ensuring clarity for Indian college students with limited English proficiency.Define the {topic} in "explanation" and if the {topic} can be explain with example then explain that in "example". Don't add example in "explanation".Use simple language and real-world examples to explain what {topic} is, its importance, and why it's interesting. Organize the information logically in a single paragraph. If {topic} involves specific process steps, terms, noteworthy features, applications, characteristics, examples, advantages, disadvantages, or types, briefly outline them without using newlines. In the "extraPoints" section, provide additional details as needed. Consider the diverse learning styles of the audience. Ensure the explanation is concise, in proper string format without using double quotes in the explanation (use only single quotes), and free of newline characters.While explaining {topic} don't go more than 70-80 words.`;

const systemPrompt = `When describing a {topic} in the context of a {unit} and {allTopics} don't use unit and allTopics constant in topics name just remember while generating the content, aim for a concise explanation of around 70-80 words, tailored to Indian college students with limited English proficiency. Define the topic in the "explanation" section, focusing on its significance, relevance, and real-world applications. If applicable, provide an example in the "example" section to further illustrate the concept. Ensure that the explanation is logical, organized, and free of newline characters. If the topic involves specific process steps, terms, features, applications, examples, advantages, disadvantages, or types, briefly mention them without using newlines. In the "extraPoints" section, offer additional details as needed to enhance understanding. Keep the explanation concise, use single quotes instead of double quotes, and avoid exceeding 70-80 words to maintain clarity and engagement. Consider the diverse learning styles of the audience to ensure maximum comprehension.`;

export const createNotesOpenAI = async (topics: string[], unitName: string) => {
  try {
    const openAiParser = StructuredOutputParser.fromZodSchema(
      z.object(notes_parser_openai)
    );
    const output_format = openAiParser.getFormatInstructions();
    let updatedResponse: any = [];
    const promptTemplate = new PromptTemplate({
      template: systemPrompt + "\n {output_format}",
      inputVariables: ["topic", "unit", "allTopics"],
      partialVariables: { output_format: output_format },
    });
    const humanMessage = new HumanMessagePromptTemplate({
      prompt: promptTemplate,
    });
    const chatPromptTemplate = ChatPromptTemplate.fromMessages([humanMessage]);

    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0.1,
    });
    const chain = new LLMChain({
      prompt: chatPromptTemplate,
      llm: model,
    });
    for (var j = 0; j < topics.length; j++) {
      const response = await chain.call({
        topic: topics[j],
        unit: unitName,
        allTopics: topics,
        formatInstructions: output_format,
      });

      let Response = response.text;
      try {
        const Json = await openAiParser.parse(Response);

        if (Json && Json.topic && Json.explanation) {
          let ytVideosArr = await searchYoutube(Json.topic + "in hindi");

          if (ytVideosArr === null) {
            return {
              success: false,
              message:
                "All YouTube API requests failed or check you api limit .",
            };
          }
          ytVideosArr = ytVideosArr?.map((e: any) => e.id.videoId);
          updatedResponse.push({ ...Json, youtubeIds: ytVideosArr });

          console.log(updatedResponse, j);
        } else {
          console.error("Invalid OpenAI response:", Json);
          return {
            success: false,
            message: "Invalid OpenAI response .",
          };
        }
      } catch (error) {
        console.error("Error parsing OpenAI response:", error);
        return {
          success: false,
          message: "Error parsing OpenAI response",
        };
      }
      // const Json = await openAiParser.parse(Response);

      // // updatedResponse.push(Json[0]);
      // if (Json) {
      //   let ytVideosArr = await searchYoutube(Json.topic + "in hindi");
      //   ytVideosArr = ytVideosArr?.map((e: any) => e.id.videoId);
      //   updatedResponse.push({ ...Json, youtubeIds: ytVideosArr });

      //   console.log(updatedResponse, j);
      // }
    }
    return { success: true, updatedResponse };
  } catch (error) {
    if (error instanceof ZodError) {
      // Handle validation errors
      console.error("Validation Error:", error.errors);
    } else {
      // Handle other errors
      console.error("Error:", error);
    }
  }
};

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const body = await req.json();
    const data = zodParser.safeParse(body);
    if (!data.success) {
      return NextResponse.json(
        {
          success: false,
          message: "payload is incorrect",
        },
        { status: 400 }
      );
    }

    const { updatedResponse, success, message } = (await createNotesOpenAI(
      data.data.topics,
      data.data.unitName
    )) as any;

    const dataForChatDatabase = {
      unitName: data.data.unitName,
      topics: JSON.stringify(data.data.topics),
      chapterNumber: data.data.chapterNumber,
      course: data.data.course,
      semester: data.data.semester,
      year: data.data.year,
      branch: data.data.branch,
    };
    if (success && updatedResponse?.length > 0) {
      const createChat = await prisma.unitData.create({
        data: dataForChatDatabase,
      });
      for (const data of updatedResponse) {
        const responseData = await prisma.responseModel.create({
          data: {
            explanation: data.explanation,
            topic: data.topic,
            example: data.example,
            youtube_search_query: data.topic + "in hindi",
            youtubeIds: JSON.stringify(data.youtubeIds ? data.youtubeIds : []),
            unitDataId: createChat.Id,
          },
        });

        if (data?.extraPoints) {
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
      }
    } else {
      return new NextResponse(message, {
        status: 400,
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedResponse,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse("Invalid body", { status: 400 });
    }
    console.error("error", error);
    return new NextResponse("Internal error: " + error, { status: 500 });
  }
};

export const GET = async (req: NextRequest, res: NextResponse) => {
  const course = req.nextUrl.searchParams.get("course");
  const semester = req.nextUrl.searchParams.get("semester");
  const year = req.nextUrl.searchParams.get("year");
  const branch = req.nextUrl.searchParams.get("branch");

  if (!(course && semester && year && branch)) {
    return NextResponse.json(
      {
        success: false,
        message: "please add query param",
      },
      { status: 400 }
    );
  }

  const data = await prisma.unitData.findMany({
    where: {
      course,
      semester,
      year,
      branch,
    },
    orderBy: [
      {
        unitName: "asc",
      },
      {
        chapterNumber: "asc",
      },
    ],
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

export const DELETE = async (req: NextRequest, res: NextResponse) => {
  const id = req.nextUrl.searchParams.get("Id");

  if (!id) {
    return NextResponse.json(
      {
        success: false,
        message: "please add query param",
      },
      { status: 400 }
    );
  }

  const data = await prisma.unitData.delete({
    where: {
      Id: Number(id),
    },
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
