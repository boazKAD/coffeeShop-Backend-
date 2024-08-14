export default class Response {
  static succesMessage(res, message, data = null, status, total = null) {
    return res.status(status || 200).json(
      data
        ? {
            status: status || 200,
            result: data.length,
            total: total || data.length,
            message,
            data,
          }
        : { status: status ?? 200, message }
    );
  }

  static errorMessage(res, error, status) {
    return res.status(status || 500).json({
      status: status || 500,
      error,
    });
  }
}
