import User from '../models/User.js';
import uploadImage from '../utils/uploader.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
      
      if (req.body.address) {
        user.address = {
          street: req.body.address.street !== undefined ? req.body.address.street : user.address.street,
          city: req.body.address.city !== undefined ? req.body.address.city : user.address.city,
          state: req.body.address.state !== undefined ? req.body.address.state : user.address.state,
          zip: req.body.address.zip !== undefined ? req.body.address.zip : user.address.zip,
          country: req.body.address.country !== undefined ? req.body.address.country : user.address.country,
        };
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        profileImage: updatedUser.profileImage,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/profile-image
// @access  Private
const uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    const imageUrl = await uploadImage(req.file);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profileImage = imageUrl;
    await user.save();

    res.json({
      message: 'Profile image uploaded successfully',
      imageUrl,
    });
  } catch (error) {
    next(error);
  }
};

export { updateUserProfile, uploadProfileImage };
