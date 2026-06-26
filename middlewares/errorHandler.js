function errorHandler(error, request, response, next) {
    const statusCode = error.statusCode || 500;

    response.status(500)
        .json({
            error: "Something went wrong. Please try again later",
            results: null
        })


};

export default errorHandler;