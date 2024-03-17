"use client";
import axios from "axios";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import React, { Fragment, useEffect, useRef, useState } from "react";

import {
  branch,
  course,
  graduationSemester,
  graduationYear,
} from "@/utils/data";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import Cards, { IChatData } from "./cards";
import FilterModal from "./filterModal";
import Pdf from "./pdf";

const Home = () => {
  const params = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<IChatData[] | undefined>();
  const [selectedData, setSelectedData] = useState<any>();
  const [open, setOpen] = useState(false);
  const [queryData, setQueryData] = useState({
    course: "btech",
    branch: "cse",
    semester: "8",
    year: "4",
  });
  const fetchData = () =>
    axios
      .get(
        `/api/notes?course=${queryData.course}&semester=${queryData.semester}&year=${queryData.year}&branch=${queryData.branch}`
      )
      .then((res) => {
        if (res.status === 200 && res.data.success) {
          setData(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  useEffect(() => {
    if (!selectedData) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedData]);

  const handleConfirm = () => {
    fetchData();
    setOpen(false);
  };
  return !selectedData ? (
    <>
      <div className=" h-[8vh] bg-slate-600 w-full flex justify-between items-center">
        <div className="flex ml-4 gap-5">
          <div className="flex items-center">
            <h4>Course: </h4> &nbsp;{" "}
            {course.filter((e) => e.value === queryData.course)[0].name}
          </div>
          <div className="flex items-center">
            <h4>Branch: </h4> &nbsp;{" "}
            {branch.filter((e) => e.value === queryData.branch)[0].name}
          </div>
          <div className="flex items-center">
            <h4>Year: </h4> &nbsp;{" "}
            {
              graduationYear.filter(
                (e) => e.value === Number(queryData.year)
              )[0].name
            }
          </div>
          <div className="flex items-center">
            <h4>Semester: </h4> &nbsp;{" "}
            {
              graduationSemester.filter(
                (e) => e.value === Number(queryData.semester)
              )[0].name
            }
          </div>
        </div>
        <div className="flex items-center">
          <button
            data-modal-target="crud-modal"
            data-modal-toggle="crud-modal"
            className="block  bg-white hover:bg-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center dark:bg-white dark:hover:bg-white dark:focus:ring-white text-black mr-4 font-nunito rounded"
            type="button"
            onClick={() => setOpen(true)}
          >
            Change filter
          </button>
          <button
            className="py-2 w-60 bg-white text-black font-bold font-nunito rounded mr-20"
            onClick={() => router.push("/createNotes")}
          >
            Create a notes
          </button>
        </div>
      </div>

      <div className="flex justify-around items-center flex-wrap gap-5 m-10">
        {data?.map((e, i) => (
          <React.Fragment key={i}>
            <Cards data={e} setSelectedData={setSelectedData} />
          </React.Fragment>
        ))}
      </div>

      <FilterModal
        open={open}
        setOpen={setOpen}
        queryData={queryData}
        setQueryData={setQueryData}
        handleConfirm={handleConfirm}
      />
    </>
  ) : (
    <Pdf selectedData={selectedData} setSelectedData={setSelectedData} />
  );
};

export default Home;
