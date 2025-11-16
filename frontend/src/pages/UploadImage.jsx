import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UploadImage = () => {
  const navigate = useNavigate();

  // 🔹 State: Nailfold, ECG, PPG
  const [nailfoldImages, setNailfoldImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔹 ECG (3 Lead)
  const [ecg, setEcg] = useState({
    leadI: "",
    leadII: "",
    leadIII: "",
  });

  // 🔹 PPG (Oxygen %)
  const [ppg, setPpg] = useState("");

  // อัปโหลดภาพ
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setNailfoldImages((prev) => [...prev, ...newImgs]);
    if (!selectedImage && newImgs.length > 0) {
      setSelectedImage(newImgs[0].url);
    }
  };

  const handleSelectImage = (url) => {
    setSelectedImage(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // สร้าง form data สำหรับส่งไป backend
    const formData = new FormData();
    nailfoldImages.forEach((img) => {
      formData.append("nailfold_images", img.file);
    });
    formData.append("leadI", ecg.leadI);
    formData.append("leadII", ecg.leadII);
    formData.append("leadIII", ecg.leadIII);
    formData.append("ppg", ppg);

    // TODO: ส่งไป backend ด้วย fetch/axios
    // await fetch("/api/upload", { method: "POST", body: formData });

    setTimeout(() => {
      navigate("/results");
    }, 1500);
  };

  return (
    <div className="flex  bg-gray-100">
      {/*LEFT: Nailfold Upload */}
      <div className="w-1/5 bg-white border-r overflow-y-auto p-2">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-semibold text-lg">Nailfold Images</h2>
          <label className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer hover:bg-blue-700 text-sm">
            + Add
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </label>
        </div>

        <div className="space-y-2">
          {nailfoldImages.length === 0 ? (
            <p className="text-sm text-gray-400 text-center mt-10">
              No images uploaded yet
            </p>
          ) : (
            nailfoldImages.map((img, index) => (
              <div
                key={index}
                className={`cursor-pointer border rounded-md overflow-hidden ${
                  selectedImage === img.url
                    ? "border-blue-500 shadow-md"
                    : "border-gray-300"
                }`}
                onClick={() => handleSelectImage(img.url)}
              > 
                <img
                  src={img.url}
                  alt={`Nailfold ${index}`}
                  className="w-full h-24 object-cover"
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/*CENTER: Image Preview */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {selectedImage ? (
          <img
            src={selectedImage}
            alt="Selected"
            className="max-h-[75vh] max-w-full border-4 border-gray-300 rounded-lg shadow-lg"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <p className="text-lg mb-4">No image selected</p>
          </div>
        )}

        {selectedImage && (
          <div className="mt-6">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        )}
      </div>

      {/*RIGHT: ECG + PPG Input */}
      <div className="w-1/5 bg-white border-l overflow-y-auto p-4 space-y-6">
        {/* ECG Section */}
        <div>
          <h2 className="font-semibold text-lg mb-3">3-Lead ECG</h2>
          <p className="text-sm text-gray-500 mb-2">
            กรอกค่าความต่างศักย์ไฟฟ้าหัวใจแต่ละ lead (mV)
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lead I
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full border rounded p-2 text-sm"
                placeholder="เช่น 0.85"
                value={ecg.leadI}
                onChange={(e) => setEcg({ ...ecg, leadI: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lead II
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full border rounded p-2 text-sm"
                placeholder="เช่น 1.20"
                value={ecg.leadII}
                onChange={(e) => setEcg({ ...ecg, leadII: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Lead III
              </label>
              <input
                type="number"
                step="0.01"
                className="w-full border rounded p-2 text-sm"
                placeholder="เช่น 0.95"
                value={ecg.leadIII}
                onChange={(e) => setEcg({ ...ecg, leadIII: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* PPG Section */}
        <div>
          <h2 className="font-semibold text-lg mb-3">PPG (Oxygen Saturation)</h2>
          <p className="text-sm text-gray-500 mb-2">
            กรอกค่าเปอร์เซ็นต์ออกซิเจนในเลือด (SpO₂ %)
          </p>
          <input
            type="number"
            className="w-full border rounded p-2 text-sm"
            placeholder="เช่น 97"
            value={ppg}
            onChange={(e) => setPpg(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadImage;











// import React, { useState, useContext, useRef } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { AuthContext } from "../context/AuthContext";
// import { getApiURL } from "../lib/route";
// import { useNavigate } from "react-router-dom";

// const UploadImage = () => {
//   axios.defaults.withCredentials = true;

//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const fingerLabels = [
//     "Right Thumb", "Right Index", "Right Middle", "Right Ring", "Right Little",
//     "Left Thumb", "Left Index", "Left Middle", "Left Ring", "Left Little",
//   ];
//   const eyeLabels = ["Left Eye", "Right Eye"];

//   const [fingerFiles, setFingerFiles] = useState({});
//   const [eyeFiles, setEyeFiles] = useState({});
//   const [gender, setGender] = useState("");
//   const [age, setAge] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);

//   const fingerInputRefs = useRef({});
//   const eyeInputRefs = useRef({});

//   const handleFingerChange = (e, finger) => {
//     const file = e.target.files[0];
//     if (file) setFingerFiles((prev) => ({ ...prev, [finger]: file }));
//   };

//   const handleEyeChange = (e, eye) => {
//     const file = e.target.files[0];
//     if (file) setEyeFiles((prev) => ({ ...prev, [eye]: file }));
//   };

//   const openFingerFileDialog = (finger) => {
//     if (fingerInputRefs.current[finger]) {
//       fingerInputRefs.current[finger].click();
//     }
//   };
//   const openEyeFileDialog = (eye) => {
//     if (eyeInputRefs.current[eye]) {
//       eyeInputRefs.current[eye].click();
//     }
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDropFinger = (e, finger) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.dataTransfer.files?.[0]) {
//       setFingerFiles((prev) => ({ ...prev, [finger]: e.dataTransfer.files[0] }));
//     }
//   };

//   const handleDropEye = (e, eye) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.dataTransfer.files?.[0]) {
//       setEyeFiles((prev) => ({ ...prev, [eye]: e.dataTransfer.files[0] }));
//     }
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();

//     if (!user) {
//       toast.error("Please log in to upload images.");
//       return;
//     }

//     if (!gender || !age) {
//       toast.error("Please fill in gender and age.");
//       return;
//     }

//     if (
//       Object.values(fingerFiles).filter(Boolean).length < 10 ||
//       Object.values(eyeFiles).filter(Boolean).length < 2
//     ) {
//       toast.error("Please upload all required images.");
//       return;
//     }

//     const formData = new FormData();

//     Object.entries(fingerFiles).forEach(([finger, file]) => {
//       if (file) formData.append(`finger_${finger}`, file);
//     });

//     Object.entries(eyeFiles).forEach(([eye, file]) => {
//       if (file) formData.append(`eye_${eye}`, file);
//     });

//     formData.append("userEmail", user.email || "");
//     formData.append("gender", gender);
//     formData.append("age", age);

//     try {
//       setIsUploading(true);
//       setUploadProgress(0);

//       await axios.post(`${getApiURL()}/ml/upload`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           setUploadProgress(percentCompleted);
//         },
//       });

//       toast.success("Images uploaded!");
//       setFingerFiles({});
//       setEyeFiles({});
//       setGender("");
//       setAge("");
//       navigate("/results");
//     } catch (error) {
//       console.error(error);
//       toast.error("Upload failed.");
//     } finally {
//       setIsUploading(false);
//       setUploadProgress(0);
//     }
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-bold mb-6">Upload Fingerprint & Eye Images</h2>

//       {/* Gender & Age */}
//       <div className="grid grid-cols-2 gap-4 mb-6">
//         <div>
//           <label className="block mb-1 font-medium">Gender</label>
//           <select
//             value={gender}
//             onChange={(e) => setGender(e.target.value)}
//             className="w-full border px-3 py-2 rounded"
//             required
//           >
//             <option value="">Select gender</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//           </select>
//         </div>
//         <div>
//           <label className="block mb-1 font-medium">Age</label>
//           <input
//             type="number"
//             value={age}
//             onChange={(e) => setAge(e.target.value)}
//             className="w-full border px-3 py-2 rounded"
//             min="0"
//             max="120"
//             required
//           />
//         </div>
//       </div>

//       <form onSubmit={handleUpload} className="space-y-8">
//         {/* Fingerprint Section */}
//         <section>
//           <h3 className="text-xl font-semibold mb-3">Fingerprint Images</h3>
//           <div className="grid grid-cols-5 gap-4">
//             {fingerLabels.map((finger) => (
//               <div
//                 key={finger}
//                 className="border p-3 rounded shadow flex flex-col items-center cursor-pointer"
//                 onClick={() => openFingerFileDialog(finger)}
//                 onDragOver={handleDragOver}
//                 onDrop={(e) => handleDropFinger(e, finger)}
//               >
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   ref={(el) => (fingerInputRefs.current[finger] = el)}
//                   onChange={(e) => handleFingerChange(e, finger)}
//                   disabled={isUploading}
//                 />
//                 <div className="w-24 h-24 border-2 border-dashed border-gray-400 rounded flex items-center justify-center text-gray-400 text-sm select-none">
//                   {fingerFiles[finger] ? (
//                     <img
//                       src={URL.createObjectURL(fingerFiles[finger])}
//                       alt={finger}
//                       className="w-full h-full object-cover rounded"
//                       onClick={(e) => e.stopPropagation()}
//                     />
//                   ) : (
//                     "Drop or Click"
//                   )}
//                 </div>
//                 <span className="mt-2 font-medium text-center text-sm">{finger}</span>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Eye Section */}
//         <section>
//           <h3 className="text-xl font-semibold mb-3">Eye Images</h3>
//           <div className="flex gap-6">
//             {eyeLabels.map((eye) => (
//               <div
//                 key={eye}
//                 className="border p-3 rounded shadow flex flex-col items-center cursor-pointer"
//                 onClick={() => openEyeFileDialog(eye)}
//                 onDragOver={handleDragOver}
//                 onDrop={(e) => handleDropEye(e, eye)}
//               >
//                 <input
//                   type="file"
//                   accept="image/*"
//                   className="hidden"
//                   ref={(el) => (eyeInputRefs.current[eye] = el)}
//                   onChange={(e) => handleEyeChange(e, eye)}
//                   disabled={isUploading}
//                 />
//                 <div className="w-32 h-32 border-2 border-dashed border-gray-400 rounded flex items-center justify-center text-gray-400 text-sm select-none">
//                   {eyeFiles[eye] ? (
//                     <img
//                       src={URL.createObjectURL(eyeFiles[eye])}
//                       alt={eye}
//                       className="w-full h-full object-cover rounded"
//                       onClick={(e) => e.stopPropagation()}
//                     />
//                   ) : (
//                     "Drop or Click"
//                   )}
//                 </div>
//                 <span className="mt-2 font-medium text-sm">{eye}</span>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* Progress */}
//         {isUploading && (
//           <div className="w-full bg-gray-200 rounded h-4 overflow-hidden mt-4">
//             <div
//               className="bg-blue-600 h-4"
//               style={{ width: `${uploadProgress}%` }}
//             />
//           </div>
//         )}

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={isUploading}
//           className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
//         >
//           {isUploading ? `Uploading... (${uploadProgress}%)` : "Upload All"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default UploadImage;
