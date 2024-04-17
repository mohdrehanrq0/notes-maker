import Link from "next/link";
import React from "react";

export interface IChatData {
  Id: number;
  unitName: string;
  chapterNumber: number;
  topics: string;
  response: any;
}

const Cards = ({
  data,
  setSelectedData,
}: {
  data: IChatData;
  setSelectedData: React.Dispatch<React.SetStateAction<any>>;
}) => {
  return (
    <div className="max-w-sm p-6 bg-gray-400 rounded-md bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100">
      <a href="#">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {data.unitName} unit {data.chapterNumber}
        </h5>
      </a>
      <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
        {JSON.parse(JSON.stringify(data?.topics)).toString().slice(0, 100)}
      </p>
      <Link
        href={{
          pathname: "/",
        }}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-black bg-white rounded-lg hover:bg-slate-200"
        onClick={() => setSelectedData(data)}
      >
        Read more
        <svg
          className="w-3.5 h-3.5 ml-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 5h12m0 0L9 1m4 4L9 9"
          />
        </svg>
      </Link>
    </div>
  );
};

export default Cards;
