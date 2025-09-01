// @ts-ignore
const TryCatch = (handler) => {
    return async (req, res, next) => {
        try {
            // @ts-ignore
            await handler(req, res, next);
        }
        catch (error) {
            // @ts-ignore
            res.status(500).json({
                message: error.message
            });
        }
    };
};
export default TryCatch;
//# sourceMappingURL=TryCatch.js.map