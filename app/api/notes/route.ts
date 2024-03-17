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
      `if topic has some process steps, terms, noteworthy features, applications, characteristics, examples, advantages, disadvantages, or types please outline them. Additionally, mention any notable advantages and disadvantages associated with {topic} in the section if any. Include relevant examples if possible and it not mandatory that you have mention all in this section if its important then only explain otherwise you can skip it and consider the diverse learning styles of the audience and also give the response in proper json format and according to schema`
    ),
};
// const systemPrompt = `I have given you the {topic} in context of {unit}. You have to explain that {topic} in 200 words to a 10 year old student. Use simple language, provide a overview of what {topic} and why it's important and interesting and remember you have to give the response explanation in single paragraph, do not use new line character and double quote. If there's a notable feature ,application, characteristics,example, advantage, disadvantage and types associated with {topic} than explain that also in brief in "extraPoints". Ensure there are no newline characters in the explanation.`;

// const systemPrompt = `Describe {topic} in context of {unit} (around 180 words )  in a way that a  Indian college students understand who may have a limited understanding of English,  can grasp easily. Use simple language and relate {topic} to everyday life experiences. Provide a short overview (around 180 words) on what {topic} is, its importance, why it's interesting and organize the information logically.If {topic} involves any specific process steps, terms, noteworthy features, applications, characteristics, examples, advantages, disadvantages, or types, please outline them. Additionally, mention any notable advantages and disadvantages associated with {topic} in the "extraPoints" section if any. Include relevant examples if possible and it not mandatory that you have mention all in "extraPoints" if its important then only explain otherwise you can skip it and consider the diverse learning styles of the audience.Ensure the explanation is concise, don't use double quote and free of newline characters.`;

// const systemPrompt = `Describe the {topic} in the context of {unit} in around 150 words, ensuring clarity for Indian college students with limited English proficiency and can grasp easily. Use simple language and real-world examples to explain what {topic} is, its importance, and why it's interesting. and organize the information logically.If {topic} involves specific process steps, terms, noteworthy features, applications, characteristics, examples, advantages, disadvantages, or types, briefly outline them. However, keep the main explanation focused and concise. In the "extraPoints" section, provide additional details as needed, but prioritize brevity. Consider the diverse learning styles of the audience.Ensure the explanation is concise,in proper string format without using double quotes in explanation use only single quote, and free of newline characters.`;

const systemPrompt = `Describe the {topic} in the context of {unit} in short around 70-80 words, ensuring clarity for Indian college students with limited English proficiency.Define the {topic} in "explanation" and if the {topic} can be explain with example then explain that in "example". Don't add example in "explanation".Use simple language and real-world examples to explain what {topic} is, its importance, and why it's interesting. Organize the information logically in a single paragraph. If {topic} involves specific process steps, terms, noteworthy features, applications, characteristics, examples, advantages, disadvantages, or types, briefly outline them without using newlines. In the "extraPoints" section, provide additional details as needed. Consider the diverse learning styles of the audience. Ensure the explanation is concise, in proper string format without using double quotes in the explanation (use only single quotes), and free of newline characters.While explaining {topic} don't go more than 70-80 words.`;

// const systemPrompt = `Explain {topic} in {unit} concisely (100-120 words). Use simple language and real-world examples in the 'explanation'. If applicable, provide an 'example'. Focus on clarity and logic. Briefly touch on any process steps, terms, features, applications, etc., without newlines. Prioritize brevity. Consider diverse learning styles. Ensure the explanation is in proper string format (single quotes only) and without newlines. Limit the explanation to 50-80 words`;

export const createNotesOpenAI = async (topics: string[], unitName: string) => {
  try {
    const openAiParser = StructuredOutputParser.fromZodSchema(
      z.object(notes_parser_openai)
    );
    const output_format = openAiParser.getFormatInstructions();
    let updatedResponse: any = [];
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
      temperature: 0.4,
    });
    const chain = new LLMChain({
      prompt: chatPromptTemplate,
      llm: model,
    });
    for (var j = 0; j < topics.length; j++) {
      const response = await chain.call({
        topic: topics[j],
        unit: unitName,
        formatInstructions: output_format,
      });

      let Response = response.text;
      try {
        const Json = await openAiParser.parse(Response);

        if (Json && Json.topic && Json.explanation) {
          let ytVideosArr = await searchYoutube(Json.topic + "in hindi");

          ytVideosArr = ytVideosArr?.map((e: any) => e.id.videoId);
          updatedResponse.push({ ...Json, youtubeIds: ytVideosArr });

          console.log(updatedResponse, j, ytVideosArr);
        } else {
          console.error("Invalid OpenAI response:", Json);
        }
      } catch (error) {
        console.error("Error parsing OpenAI response:", error);
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
    console.log("testing--->", updatedResponse);
    return { updatedResponse };
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

    const { updatedResponse } = (await createNotesOpenAI(
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
    if (updatedResponse?.length > 0) {
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
      return new NextResponse("Problem occur while generating content.", {
        status: 400,
      });
    }

    return NextResponse.json({
      success: true,
      data: updatedResponse,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse("invalid body", { status: 400 });
    }
    console.error("error", error);
    return new NextResponse("internal error: " + error, { status: 500 });
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
