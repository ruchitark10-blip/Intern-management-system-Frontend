export const redirectByRole = (role, navigate) => {
  switch (role) {
    case "admin": navigate("/admin/dashboard"); break;
    case "mentor": navigate("/mentor/dashboard"); break;
    case "intern": navigate("/intern/dashboard"); break;
    default: navigate("/"); 
  }
};
