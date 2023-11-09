import { ErrorEnum } from "../enum/error.enum.js";

export const errorMiddleware = (error, req, res, next) => {
  console.error(error);
  switch (error.code) {
    case ErrorEnum.INVALID_TYPES_ERROR:
      res
        .status(400)
        .json({ status: "error", error: error.name, cause: error.cause });
      break;
    case ErrorEnum.PARAM_ERROR:
      res
        .status(400)
        .json({ status: "error", error: error.name, cause: error.cause });
      break;
    default:
      res.status(400).json({ status: "error", mensaje: "error no manejado" });
  }
};
