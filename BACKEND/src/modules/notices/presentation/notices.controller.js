import { noticesService } from '../application/notices.service.js';

export const getNotices = async (req, res, next) => {
  try {
    const notices = await noticesService.fetchNotices();
    res.status(200).json({
      status: 'success',
      data: {
        notices
      }
    });
  } catch (error) {
    next(error);
  }
};
