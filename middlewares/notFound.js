function notFound(request, response, next) {
    response.status(404)
            .json({
                error: 'What you were looking for... sorry, not found!',
                results: null
            });
};

export default notFound;