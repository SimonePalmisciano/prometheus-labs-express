function notFound(request, response, next) {
    response.status(404)
            .json({
                error: 'not found',
                results: null
            });
};

export default notFound;