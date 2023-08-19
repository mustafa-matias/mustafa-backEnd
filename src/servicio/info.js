export const generateErrorInfo = (user) => {
  return `One or more properties were completed or invalid
    List of required properties:
    *email: needs to be a String, received ${user.email}
    *password: needs to be a String, received ${user.password}`;
};
