"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

import {
  branch,
  course,
  graduationSemester,
  graduationYear,
} from "@/utils/data";

const CreateNotes = () => {
  const [data, setData] = useState<{
    chapterNumber: number | null;
    unitName: string | null;
    topics: string[] | null;
    course: string | null;
    branch: string | null;
    year: string | null;
    semester: string | null;
  }>({
    chapterNumber: null,
    unitName: null,
    topics: null,
    course: null,
    branch: null,
    year: null,
    semester: null,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = () => {
    setLoading(true);
    if (
      data.chapterNumber === null ||
      data.topics === null ||
      data.unitName === null
    ) {
      alert("Please fill all input fields...");
      setLoading(false);
      return;
    }
    axios
      .post("/api/notes", data, { timeout: 1000 * 60 * 60 })
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          alert("Whoa! Notes created successfully.");
          router.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data);
        setLoading(false);
      });
  };

  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-center ">
      <div className="w-[50vw] py-5  bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100 flex flex-col justify-center items-center">
        <div className="font-medium text-center text-3xl text-white font-nunito mb-5">
          Create a Notes
        </div>
        <div className="w-full flex justify-center items-center gap-4 flex-col">
          <input
            className="block w-3/5  rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 font-nunito tracking-wide text-3xl  font-bold focus:ring-2 focus:ring-inherit focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none"
            placeholder="Enter the unit number..."
            type="number"
            value={data?.chapterNumber as number}
            onChange={(e) =>
              setData((pre) => ({
                ...pre,
                chapterNumber: Number(e.target.value),
              }))
            }
          />
          <input
            className="block w-3/5  rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 font-nunito tracking-wide text-3xl  font-bold focus:ring-2 focus:ring-inherit focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none"
            placeholder="Enter the unit name..."
            value={data?.unitName as string}
            onChange={(e) =>
              setData((pre) => ({
                ...pre,
                unitName: e.target.value,
              }))
            }
          />
          <textarea
            className="block w-3/5 h-48 rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 font-nunito tracking-wide text-3xl  font-bold focus:ring-2 focus:ring-inherit focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none"
            placeholder="Add the sub topic of the units separated by commas..."
            value={data?.topics as string[]}
            onChange={(e) =>
              setData((pre) => ({
                ...pre,
                topics: e.target.value.split(","),
              }))
            }
          />

          <select
            id="countries"
            className="w-3/5 rounded-md  border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 focus:outline-none "
            value={data?.course as string}
            onChange={(e) =>
              setData((pre) => ({
                ...pre,
                course: e.target.value,
              }))
            }
          >
            <option selected>Choose a course</option>
            {course.map((e, i) => (
              <option value={e.value} key={i}>
                {e.name}
              </option>
            ))}
          </select>
          <select
            id="countries"
            className="w-3/5 rounded-md  border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 focus:outline-none "
            value={data?.branch as string}
            onChange={(e) =>
              setData((pre) => ({
                ...pre,
                branch: e.target.value,
              }))
            }
          >
            <option selected>Choose a branch</option>
            {branch.map((e, i) => (
              <option value={e.value} key={i}>
                {e.name}
              </option>
            ))}
            {/* <option value="cse">Computer Science Engg.</option>
            <option value="it">Information Technology Engg.</option>
            <option value="exe">Electrical & Electronics Engg.</option>
            <option value="ece">Electronics and Communication Engg. </option>
            <option value="civil">Civil Engg.</option>
            <option value="mechanical">Mechanical Engg.</option> */}
          </select>
          <select
            id="countries"
            className="w-3/5 rounded-md  border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 focus:outline-none "
            value={data?.year as string}
            onChange={(e) =>
              setData((pre) => ({
                ...pre,
                year: e.target.value,
              }))
            }
          >
            <option selected>Choose a year</option>
            {graduationYear.map((e, i) => (
              <option value={e.value} key={i}>
                {e.name}
              </option>
            ))}
            {/* <option value="1">1 Year</option>
            <option value="2">2 Year</option>
            <option value="3">3 Year</option>
            <option value="4">4 Year</option> */}
          </select>
          <select
            id="countries"
            className="w-3/5 rounded-md  border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 focus:outline-none "
            value={data?.semester as string}
            onChange={(e) =>
              setData((pre) => ({
                ...pre,
                semester: e.target.value,
              }))
            }
          >
            <option selected>Choose a semester</option>
            {graduationSemester.map((e, i) => (
              <option value={e.value} key={i}>
                {e.name}
              </option>
            ))}
            {/* <option value="1">1 Semester</option>
            <option value="2">2 Semester</option>
            <option value="3">3 Semester</option>
            <option value="4">4 Semester</option>
            <option value="5">5 Semester</option>
            <option value="6">6 Semester</option>
            <option value="7">7 Semester</option>
            <option value="8">8 Semester</option> */}
          </select>
        </div>
        <div className="w-full ">
          <button
            className="h-10 block mt-5 w-2/5 text-center font-semibold rounded-md bg-white text-black mx-auto"
            onClick={() => !loading && handleSubmit()}
          >
            {loading ? (
              <svg
                aria-hidden="true"
                className="w-8 h-8 mx-auto  text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            ) : (
              "Generate"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNotes;
