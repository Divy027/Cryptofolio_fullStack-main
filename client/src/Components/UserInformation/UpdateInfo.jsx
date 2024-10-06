import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function UpdateInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const userid = location.state.id;

  const [image, setImage] = useState("");

  // Upload Image to Cloudinary
  const uploadImage = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "crypto_profile");
    data.append("cloud_name", "dcth4owgy");

    try {
      const uploadResponse = await fetch("https://api.cloudinary.com/v1_1/dcth4owgy/image/upload", {
        method: "post",
        body: data,
      });

      const uploadData = await uploadResponse.json();

      await updateProfileImage(uploadData.url);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  // Update profile image in the backend
  const updateProfileImage = async (imageUrl) => {
    try {
      const response = await fetch("http://localhost:3001/dashboard/profileupdate", {
        method: "POST",
        body: JSON.stringify({ UserId: userid, ProfileUrl: imageUrl }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const json = await response.json();
      console.log("Profile update response:", json);
      navigate("/dashboard", { state: { id: userid } });
    } catch (error) {
      console.error("Error updating profile image:", error);
    }
  };

  return (
    <div className="bg-[#171b26] h-screen pt-[100px]">
      <div className="mx-auto mt-[150px] w-[70%] md:w-[50%] bg-[#272e41] rounded-lg p-5">
        <div className="mx-auto">
          <div className="sm:w-[30%] mx-auto font-semibold">
            <input
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div className="text-center m-5 text-[#090e1e]">
            {image && (
              <button
                onClick={uploadImage}
                className="bg-[#209fe4] w-full md:w-[30%] p-1 mt-6 rounded-md font-semibold text-[12px] md:text-[15px] mb-4"
              >
                Upload
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
