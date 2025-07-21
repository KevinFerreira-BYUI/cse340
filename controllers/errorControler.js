
exports.notFound = (req, res) => {
    res.status(404).render("error/404", {
        title: "Error 404",
        message: "Sorry, we appear to have lost that page.",
    })
}

exports.serverError = (err, req, res, next) => {
  res.status(500).render('error/500', {
    title: "Server Error",
    message: "O",
  })
}