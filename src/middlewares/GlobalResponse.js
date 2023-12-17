
export const globalResponse = (err, req, res, next) =>
{
    if (err)
    {
        return res.status(500).json(
        {
            message: "catch error",
            errMsg: err.message
        })
    }
}