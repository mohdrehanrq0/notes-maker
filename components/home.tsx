"use client";
import axios from "axios";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import Cards, { IChatData } from "./cards";
import Pdf from "./pdf";

const Home = () => {
  const params = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<IChatData[] | undefined>();
  const [selectedData, setSelectedData] = useState<any>();
  useEffect(() => {
    if (!data && !selectedData) {
      axios
        .get("/api/notes")
        .then((res) => {
          if (res.status === 200 && res.data.success) {
            setData(res.data.data);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return !selectedData ? (
    <>
      <div className=" h-[8vh] bg-slate-600 w-full flex justify-end items-center">
        <button
          className="py-2 w-60 bg-white text-black font-bold font-nunito rounded mr-20"
          onClick={() => router.push("/createNotes")}
        >
          Create a notes
        </button>
      </div>
      <div className="flex justify-around items-center flex-wrap gap-5 m-10">
        {data?.map((e, i) => (
          <React.Fragment key={i}>
            <Cards data={e} setSelectedData={setSelectedData} />
          </React.Fragment>
        ))}
      </div>
    </>
  ) : (
    <Pdf selectedData={selectedData} setSelectedData={setSelectedData} />
  );
};

export default Home;
