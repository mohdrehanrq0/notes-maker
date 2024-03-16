import React, { Fragment, useRef } from "react";

import {
  branch,
  course,
  graduationSemester,
  graduationYear,
} from "@/utils/data";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  queryData: {
    course: string;
    branch: string;
    semester: string;
    year: string;
  };
  setQueryData: React.Dispatch<
    React.SetStateAction<{
      course: string;
      branch: string;
      semester: string;
      year: string;
    }>
  >;
  handleConfirm: () => void;
}
const FilterModal = ({
  open,
  setOpen,
  queryData,
  setQueryData,
  handleConfirm,
}: IProps) => {
  const cancelButtonRef = useRef(null);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10 "
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className=" transform overflow-hidden rounded-lg relative  dark:bg-gray-700 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className=" px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-white"
                    >
                      Add filter to get notes
                    </Dialog.Title>

                    <button
                      type="button"
                      className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                      data-modal-toggle="crud-modal"
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                </div>

                <form className="p-4 md:p-5">
                  <div className="grid gap-4 mb-4 grid-cols-2">
                    <div className="col-span-2">
                      <label
                        htmlFor="countries"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Course
                      </label>
                      <select
                        name="countries"
                        id="countries"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                        value={queryData?.course as string}
                        onChange={(e) =>
                          setQueryData((pre) => ({
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
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="branch"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Branch
                      </label>
                      <select
                        name="branch"
                        id="branch"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                        value={queryData?.branch as string}
                        onChange={(e) =>
                          setQueryData((pre) => ({
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
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="year"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Year
                      </label>
                      <select
                        name="year"
                        id="year"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                        value={queryData?.year as string}
                        onChange={(e) =>
                          setQueryData((pre) => ({
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
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label
                        htmlFor="semester"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Semester
                      </label>
                      <select
                        name="semester"
                        id="semester"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 "
                        value={queryData?.semester as string}
                        onChange={(e) =>
                          setQueryData((pre) => ({
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
                      </select>
                    </div>
                  </div>
                </form>

                <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-white-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-gray-300 hover:bg-white-500 sm:ml-3 sm:w-auto  ring-1 ring-inset"
                    onClick={() => handleConfirm()}
                  >
                    Confirm
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default FilterModal;
