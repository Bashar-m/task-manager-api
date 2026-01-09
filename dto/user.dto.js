// Data Transfer Object
//شكل البيانات اللي رح تطلع للعميل
module.exports = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});
