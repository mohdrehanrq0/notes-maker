import JsPDF from "jspdf";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import ReactToPrint from "react-to-print";

import { getUnsplashImage } from "@/lib/unsplash";
import { searchYoutube } from "@/lib/youtube";
import Logo from "@/public/logo.png";

import { IChatData } from "./cards";
import styles from "./pdf.module.scss";

const Pdf = ({
  selectedData,
  setSelectedData,
}: {
  selectedData: IChatData;
  setSelectedData: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const router = useRouter();
  const componentRef = useRef<any>();
  console.log(selectedData.response);

  const getPageMargins = () => {
    return `@page { 
      margin: 30px !important;
      size: A4 portrait;
      
      @bottom-left {
        content: "Readreuse. All right reserved";
        
      }
      
    }`;
  };

  return (
    <>
      <div
        className={` h-[8vh] bg-slate-600 w-full flex justify-between items-center ${styles.main}`}
      >
        <button
          className="py-2 w-40 bg-white text-black font-bold font-nunito rounded ml-12 "
          onClick={() => setSelectedData(undefined)}
        >
          Back
        </button>
        <ReactToPrint
          content={() => componentRef.current}
          trigger={() => (
            <button className="py-2 w-60 bg-white text-black font-bold font-nunito rounded mr-12">
              Export to PDF
            </button>
          )}
          pageStyle={getPageMargins()}
          documentTitle={`${selectedData.unitName}_unit_${selectedData.chapterNumber}`}
        />
      </div>
      <div
        className=" bg-white py-10 px-10 relative z-10"
        id="pdfArea"
        ref={componentRef}
        style={{}}
      >
        <div className="text-black text-center font-nunito font-bold text-xl mb-5 ">
          <div className=" mb-2">{selectedData.unitName}</div>
          Unit - {selectedData.chapterNumber}
        </div>
        <div
          className=" absolute opacity-5 h-full w-full top-0 left-0 "
          style={{
            zIndex: "-1",
            // height: 100,
            // width: 100,
            backgroundImage: `url(${Logo.src})`,
            backgroundPosition: "center",
            backgroundSize: "150px 150px",
            backgroundRepeat: "repeat",
          }}
        >
          {/* <Image src={Logo} alt="ff" className=" object-fill bg-repeat" /> */}
        </div>
        {selectedData.response.map((e: any, i: number) => (
          <React.Fragment key={i}>
            <div className="text-black text-xl font-bold tracking-wide mb-2 font-nunito">
              {e.topic}
            </div>
            <div className="text-black tracking-wide font-nunito whitespace-pre-line">
              {e.explanation}
            </div>
            <div className="flex text-black mb-5">
              <div className=" ">
                {e.extraPoints.map((data: any, i: number) => (
                  <div key={i}>
                    <div className="text-black font-semibold font-nunito text-lg mb-2 mt-5">
                      {data.name}
                    </div>
                    <div>
                      <ol className=" list-decimal pl-5">
                        {data.explanationExtra.map((res: any, i: number) => (
                          <li key={i} className="mb-2">
                            <div className="text-black font-semibold font-nunito text-base mb-1">
                              {res.topic}
                            </div>
                            <div className=" font-nunito">
                              <span className=" no-underline">
                                {res.description}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-8  text-black">
              <div className="font-semibold mb-5">Youtube links</div>
              <div className="flex flex-row gap-14 w-max">
                {JSON.parse(e.youtubeIds)?.map((e: string, i: number) => (
                  <a
                    href={`https://www.youtube.com/watch?v=${e}`}
                    className="flex gap-2 items-center font-nunito underline"
                    key={i}
                    style={{ color: "#0000EE" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="30px"
                      width="30px"
                      version="1.1"
                      id="Layer_1"
                      viewBox="0 0 461.001 461.001"
                    >
                      <g>
                        <path
                          style={{ fill: "#F61C0D" }}
                          d="M365.257,67.393H95.744C42.866,67.393,0,110.259,0,163.137v134.728   c0,52.878,42.866,95.744,95.744,95.744h269.513c52.878,0,95.744-42.866,95.744-95.744V163.137   C461.001,110.259,418.135,67.393,365.257,67.393z M300.506,237.056l-126.06,60.123c-3.359,1.602-7.239-0.847-7.239-4.568V168.607   c0-3.774,3.982-6.22,7.348-4.514l126.06,63.881C304.363,229.873,304.298,235.248,300.506,237.056z"
                        />
                      </g>
                    </svg>{" "}
                    {`https://www.youtube.com/watch?v=${e}`}
                  </a>
                ))}
              </div>
            </div>
          </React.Fragment>
        ))}

        <div className="text-center text-black my-4 mt-20 font-bold">
          <span className="underline">Disclaimer</span>: AI-generated content;
          YouTube video links may not be topic-specific. Verify information
          independently for exam preparation.
        </div>
      </div>
    </>
  );
};

export default Pdf;
