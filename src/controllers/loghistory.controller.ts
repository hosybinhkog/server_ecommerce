import catchAsyncError from "../middleware/catchAsyncError";
import loghistoryModel from "../models/loghistory.model";

export const getAllLogHistory = catchAsyncError(async (_req, res, _next) => {
  const logHistories = await loghistoryModel.find({});

  return res.status(200).json({
    success: true,
    message: "get all logs history",
    logHistories,
  });
});

export const createLogHistory = catchAsyncError(async (req, res, _next) => {
  // @ts-ignore
  if (!req?.user?.id) {
    const logHistory = await loghistoryModel.create({
      message: req.body.message,
      // @ts-ignore
      isNotLoggin: true,
    });

    res.status(200).json({
      success: true,
      message: "Log history created successfully",
      logHistory,
    });
  }

  const logHistory = await loghistoryModel.create({
    message: req.body.message,
    // @ts-ignore
    users: req.user.id,
    // @ts-ignore
    nameUser: req.user.email,
  });

  if (!logHistory) {
    res.status(400).json({
      success: false,
      message: "Create log error",
    });
  }

  res.status(200).json({
    success: true,
    message: "Log history created successfully",
    logHistory,
  });
});

export const deleteLogHistory = catchAsyncError(async (req, res, _next) => {
  await loghistoryModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "delete log error",
  });
});
