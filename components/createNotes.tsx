"use client";
import axios from "axios";
import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import aiLottie from "@/public/aiLoading.json";
import rightLottie from "@/public/rightLottie.json";
import wrongLottie from "@/public/wrongLottie.json";
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
    topics: string[][];
    course: string | null;
    branch: string | null;
    year: string | null;
    semester: string | null;
  }>({
    chapterNumber: null,
    unitName: null,
    topics: [[]],
    course: null,
    branch: null,
    year: null,
    semester: null,
  });
  const [loading, setLoading] = useState(false);
  const [unitLoading, setUnitLoading] = useState<
    { loading: boolean; completed: boolean; error: boolean }[]
  >([
    {
      loading: false,
      completed: false,
      error: false,
    },
  ]);
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = () => {
    let unitLoadingState = unitLoading;
    setLoading(true);

    if (
      data.unitName === null &&
      data.course === null &&
      data.branch === null &&
      data.year === null &&
      data.semester === null
    ) {
      alert("Please fill all input fields...");
      setLoading(false);
      return;
    }
    if (error) {
      data.topics.forEach((e, i) => {
        if (
          unitLoadingState[i].error &&
          !unitLoadingState[i].loading &&
          !unitLoadingState[i].completed
        ) {
          setUnitLoading((pre) => {
            return pre.map((e, index) => {
              if (index === i) {
                e = {
                  loading: true,
                  completed: false,
                  error: false,
                };
              }
              return e;
            });
          });
          unitLoadingState[i] = {
            loading: true,
            completed: false,
            error: false,
          };
          const payload = {
            chapterNumber: i + 1,
            unitName: data.unitName,
            topics: data.topics[i],
            course: data.course,
            branch: data.branch,
            year: data.year,
            semester: data.semester,
          };
          axios
            .post("/api/notes", payload, { timeout: 1000 * 60 * 60 })
            .then((res) => {
              // alert(`Whoa! Notes for unit ${i + 1} created successfully.`);
              if (res.status === 200) {
                setUnitLoading((pre) => {
                  return pre.map((e, index) => {
                    if (index === i) {
                      e = {
                        loading: false,
                        completed: true,
                        error: false,
                      };
                    }
                    return e;
                  });
                });
                unitLoadingState[i] = {
                  loading: false,
                  completed: true,
                  error: false,
                };
                const containFalseLoading = unitLoadingState.every(
                  (el) => el.loading === false
                );
                const conditionForErrorAndSuccess = unitLoadingState.every(
                  (el) =>
                    (el.error === false && el.completed === true) ||
                    (el.error === true && el.completed === false)
                );

                if (containFalseLoading && conditionForErrorAndSuccess) {
                  setLoading(false);
                  const confirm = window.confirm(
                    "Whoa! Notes generated for all the units🥳🎉. Do you want to go back?"
                  );
                  if (confirm) {
                    router.push("/");
                  }
                }

                //
              }
            })
            .catch((err) => {
              console.log(err);
              alert(err.response.data);
              setUnitLoading((pre) => {
                return pre.map((e, index) => {
                  if (index === i) {
                    e = {
                      loading: false,
                      completed: false,
                      error: true,
                    };
                  }
                  return e;
                });
              });
              unitLoadingState[i] = {
                loading: false,
                completed: false,
                error: true,
              };
              const containFalseLoading = unitLoadingState.every(
                (el) => el.loading === false
              );
              const conditionForErrorAndSuccess = unitLoadingState.every(
                (el) =>
                  (el.error === false && el.completed === true) ||
                  (el.error === true && el.completed === false)
              );
              if (containFalseLoading && conditionForErrorAndSuccess) {
                setLoading(false);
              }
              setError(true);
            });
        }
      });
    } else {
      data.topics.forEach((topics, i) => {
        setUnitLoading((pre) => {
          return pre.map((e, index) => {
            if (index === i) {
              e = {
                loading: true,
                completed: false,
                error: false,
              };
            }
            return e;
          });
        });
        unitLoadingState[i] = {
          loading: true,
          completed: false,
          error: false,
        };

        console.log("333333", unitLoadingState);
        const payload = {
          chapterNumber: i + 1,
          unitName: data.unitName,
          topics: topics,
          course: data.course,
          branch: data.branch,
          year: data.year,
          semester: data.semester,
        };
        axios
          .post("/api/notes", payload, { timeout: 1000 * 60 * 60 })
          .then((res) => {
            // alert(`Whoa! Notes for unit ${i + 1} created successfully.`);
            if (res.status === 200) {
              setUnitLoading((pre) => {
                return pre.map((e, index) => {
                  if (index === i) {
                    e = {
                      loading: false,
                      completed: true,
                      error: false,
                    };
                  }
                  return e;
                });
              });
              unitLoadingState[i] = {
                loading: false,
                completed: true,
                error: false,
              };

              const containFalseLoading = unitLoadingState.every(
                (el) => el.loading === false
              );
              const conditionForErrorAndSuccess = unitLoadingState.every(
                (el) =>
                  (el.error === false && el.completed === true) ||
                  (el.error === true && el.completed === false)
              );
              if (containFalseLoading && conditionForErrorAndSuccess) {
                setLoading(false);
                const confirm = window.confirm(
                  "Whoa! Notes generated for all the units🥳🎉. Do you want to go back?"
                );
                if (confirm) {
                  router.push("/");
                }
              }
              console.log(
                "2222222",
                unitLoadingState,
                containFalseLoading,
                conditionForErrorAndSuccess
              );

              //
            }
          })
          .catch((err) => {
            console.log(err);
            // prompt(err.response.data);
            setUnitLoading((pre) => {
              return pre.map((e, index) => {
                if (index === i) {
                  e = {
                    loading: false,
                    completed: false,
                    error: true,
                  };
                }
                return e;
              });
            });
            unitLoadingState[i] = {
              loading: false,
              completed: false,
              error: true,
            };
            console.log("11111", unitLoadingState);
            const containFalseLoading = unitLoadingState.every(
              (el) => el.loading === false
            );
            const conditionForErrorAndSuccess = unitLoadingState.every(
              (el) =>
                (el.error === false && el.completed === true) ||
                (el.error === true && el.completed === false)
            );
            if (containFalseLoading && conditionForErrorAndSuccess) {
              setLoading(false);
            }
            setError(true);
          });
      });
    }
  };

  console.log(unitLoading, "unitLoading =========++++++++");

  return (
    <div className="h-[100vh] w-[100vw] flex justify-center items-start  overflow-y-auto">
      <div className="w-[60vw] py-5  bg-gray-400 rounded-md bg-clip-padding overflow-hidden backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100 flex flex-col justify-center items-center my-10  ">
        <div className="font-medium text-center text-3xl text-white font-nunito mb-5">
          Create a Notes
        </div>
        <div className="w-full flex justify-center items-center gap-4 flex-col">
          {/* <input
            className="block w-4/5  rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 font-nunito tracking-wide text-3xl  font-bold focus:ring-2 focus:ring-inherit focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none"
            placeholder="Enter the unit number..."
            type="number"
            value={data?.chapterNumber as number}
            onChange={(e) =>
              setData((pre) => ({
                ...pre,
                chapterNumber: Number(e.target.value),
              }))
            }
          /> */}
          <input
            className="block w-4/5  rounded-md border-0 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 font-nunito tracking-wide text-3xl  font-bold focus:ring-2 focus:ring-inherit focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none"
            placeholder="Enter the unit name..."
            value={data?.unitName as string}
            disabled={loading}
            onChange={(e) =>
              setData((pre) => ({
                ...pre,
                unitName: e.target.value,
              }))
            }
          />

          <select
            id="countries"
            className="w-4/5 rounded-md  border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 focus:outline-none "
            value={data?.course as string}
            onChange={(e) =>
              setData((pre) => ({
                ...pre,
                course: e.target.value,
              }))
            }
            disabled={loading}
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
            className="w-4/5 rounded-md  border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 focus:outline-none "
            value={data?.branch as string}
            onChange={(e) =>
              setData((pre) => ({
                ...pre,
                branch: e.target.value,
              }))
            }
            disabled={loading}
          >
            <option selected>Choose a branch</option>
            {branch.map((e, i) => (
              <option value={e.value} key={i}>
                {e.name}
              </option>
            ))}
          </select>
          <select
            id="countries"
            className="w-4/5 rounded-md  border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 focus:outline-none "
            value={data?.year as string}
            onChange={(e) =>
              setData((pre) => ({
                ...pre,
                year: e.target.value,
              }))
            }
            disabled={loading}
          >
            <option selected>Choose a year</option>
            {graduationYear.map((e, i) => (
              <option value={e.value} key={i}>
                {e.name}
              </option>
            ))}
          </select>
          <select
            id="countries"
            className="w-4/5 rounded-md  border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 focus:outline-none mb-5 "
            value={data?.semester as string}
            onChange={(e) =>
              setData((pre) => ({
                ...pre,
                semester: e.target.value,
              }))
            }
            disabled={loading}
          >
            <option selected>Choose a semester</option>
            {graduationSemester.map((e, i) => (
              <option value={e.value} key={i}>
                {e.name}
              </option>
            ))}
          </select>
        </div>

        {unitLoading?.map((e, i) => (
          <div
            className="w-full flex justify-center items-center flex-col relative"
            key={i + 1}
          >
            <textarea
              className="block w-4/5 h-48 rounded-md  py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 font-nunito tracking-wide text-3xl  font-bold focus:ring-2 focus:ring-inherit focus:ring-indigo-600 sm:text-sm sm:leading-6 focus:outline-none mb-5 border-gray-600"
              placeholder="Add the sub topic of the units separated by commas..."
              value={data?.topics[i] as string[]}
              disabled={loading}
              onChange={(e) => {
                const topics = data.topics;
                topics[i] = e.target.value.split(",");
                setData((pre) => ({
                  ...pre,
                  topics: topics,
                }));
              }}
            />
            <div className="absolute z-10 text-gray-600 top-0 left-[6.7%] h-10 w-10 bg-white flex justify-center items-center rounded-l font-nunito text-xl font-semibold">
              {i + 1}
            </div>
            {e.loading ? (
              <div className="absolute z-10 text-gray-600 top-0 right-4 h-20 w-20 bg-white flex justify-center items-center rounded-r font-nunito text-xl font-semibold">
                <Lottie
                  loop={true}
                  animationData={aiLottie}
                  rendererSettings={{
                    preserveAspectRatio: "xMidYMid slice",
                  }}
                />
              </div>
            ) : e.completed ? (
              <div className="absolute z-10 text-gray-600 top-0 right-4 h-20 w-20 bg-white flex justify-center items-center rounded-r font-nunito text-xl font-semibold">
                <Lottie
                  loop={true}
                  animationData={rightLottie}
                  rendererSettings={{
                    preserveAspectRatio: "xMidYMid slice",
                  }}
                />
              </div>
            ) : e.error ? (
              <div className="absolute z-10 text-gray-600 top-0 right-4 h-20 w-20 bg-white flex justify-center items-center rounded-r font-nunito text-xl font-semibold">
                <Lottie
                  loop={true}
                  animationData={wrongLottie}
                  rendererSettings={{
                    preserveAspectRatio: "xMidYMid slice",
                  }}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        ))}
        {!loading && !error ? (
          <button
            className="h-10 block mb-5 w-1/5 text-center font-semibold rounded-md bg-white text-black mx-auto"
            onClick={() => {
              setData((pre) => ({
                ...pre,
                topics: [...pre.topics, []],
              }));
              setUnitLoading((pre) => [
                ...pre,
                {
                  loading: false,
                  completed: false,
                  error: false,
                },
              ]);
            }}
          >
            Add Unit
          </button>
        ) : (
          ""
        )}

        <div className="w-full ">
          <button
            className="h-12 block mt-5 w-4/5 text-center font-semibold rounded-md bg-white text-black mx-auto"
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
            ) : unitLoading.some((el) => el.error === true) ? (
              "Generate Units Again"
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
