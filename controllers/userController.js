const User = require("../models/userSchema");
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({_id: {$ne: req.user.id}}).select("-password");
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// exports.updateUserProfile = async (req, res) => {
//     // console.log("Update profile request body:", req.body);
//     console.log("Update profile file:", req.file);
//   try {
//     const { name } = req.body;

//     let updateFilds = {  };

//     if (name) updateFilds.name = name;
//     if(req.file){
//       const filePath = req.file.path.replace(/\\/g, "/");
//       updateFilds.profilePic = `${req.protocol}://${req.get("host")}/${filePath}`;
//     }
//     const updatedUser = await User.findByIdAndUpdate(req.user.id, { $set: updateFilds },{returnDocument: "after", runValidators: true} ,).select("-password");

//     if (!updatedUser) {
//       return res.status(404).json({
//         message: "User not found",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       message: "User profile updated successfully",
//       data: updatedUser,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "Failed to update user profile",
//       error: error.message,
//     });
//   }
// };


exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id; // From your 'protector' middleware
    const { name, phone } = req.body;

    // 1. Prepare the update object
    let updateFields = {};
    if (name) updateFields.name = name;
    if (phone) updateFields.phone = phone;

    // 2. Handle File Upload (Profile Picture)
    if (req.file) {
      // Normalize path: Replace backslashes with forward slashes for URLs
      const filePath = req.file.path.replace(/\\/g, "/");
      
      // Construct the full URL (e.g., http://localhost:5000/uploads/filename.jpg)
      // Note: Ensure your server.js has app.use("/uploads", express.static("uploads"))
      updateFields.profilePic = `${req.protocol}://${req.get("host")}/${filePath}`;
    }

    // 3. Update the database
    // { new: true } returns the document AFTER the update
    // { runValidators: true } ensures the new data follows your Schema rules
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 4. Send the response
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user profile",
      error: error.message,
    });
  }
};