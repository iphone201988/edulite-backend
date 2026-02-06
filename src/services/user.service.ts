import User from "../models/user.model";


export const findUserByEmail:any = async (email: string) => await User.findOne({ email }).populate("gradeId", "grade icon")
export const findUserByPhone = async (phoneNumber: string) => await User.findOne({ phoneNumber });
export const findUserById = async (id: string) => await User.findById(id);
export const findUserBySocialId = async (id: string, provider: number) => await User.findOne({
    socialLinkedAccounts: {
        $elemMatch: { id, provider }
    }
});

export const userData = (user: any, token?: any) => {
  const data: any = {
    dob:user.dob|| "",
    phone:user.phone|| "",
    countryCode:user.countryCode|| "",
    address:user.address|| "",
    _id: user._id,
    email: user.email,
    name: user?.name || "",
    preferredLanguage: user?.preferredLanguage,
    role: user.role,
    profilePicture:user?.profilePicture || "",
    isEmailVerified: user.isEmailVerified || false,
    location: user.location,
    status: user.status,
    createdAt:user.createdAt,
    grade:user.grade|| "",
    gradeId:user.gradeId || "",
  };

  // only add token if passed
  if (token) {
    data.token = token;
  }

  return data;
};