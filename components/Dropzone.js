import React from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = ({ onDrop, accept, file_name }) => {
  // Initializing useDropzone hooks with options
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
  });

  /* 
    useDropzone hooks exposes two functions called getRootProps and getInputProps
    and also exposes isDragActive boolean
  */

  return (    
    <div className="max-w-xl mx-auto" {...getRootProps()} >
      <input type="file" name="file_upload" className="hidden" accept="image/png, image/gif, image/jpeg" {...getInputProps()} />
      <label
        className={`flex justify-center w-full h-24 px-4 transition bg-white border-2 ${isDragActive ? "border-purple-500" : "border-gray-300"} border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none`}>
        <div className="my-auto">
          <span className="text-center flex items-center space-x-2 space-y-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span className="font-medium text-gray-600">
              Drop an image here, or &nbsp;
              <span className="text-purple-600 underline">browse</span>
            </span>
          </span>
          <p className="text-center text-sm text-slate-400">{file_name}</p>
        </div>
      </label>
    </div>
  );

  //   return (
  //     <div className="mx-auto w-8/12 h-64 mt-10 p-2 border-dashed border-2 border-purple-400 " {...getRootProps()}>
  //       <input {...getInputProps()} />
  //       <div className="text-center bg-blue-200">
  //         {isDragActive ? (
  //           <p className="">Release to drop the files here</p>
  //         ) : (
  //           <p className="my-auto">
  //             Drag & drop an image here, or click to select files
  //           </p>
  //         )}
  //       </div>
  //     </div>
  //   );
};

export default Dropzone;