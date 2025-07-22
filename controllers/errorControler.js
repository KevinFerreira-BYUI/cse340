
exports.notFound = (req, res) => {
    const error404Body = `
        <section>
            <p class="error-message">Sorry, we appear to have lost that page.</p>
            <a href="/" class="back-to-home">Back to home</a>
        </section>
    `
    res.status(404).render("error/404", {
        title: "Error 404",
        nav: res.locals.nav,
        error404: error404Body
    })
}

exports.serverError = (err, req, res, next) => {
    console.error(err.stack)
    const error500Body = `
        <section>
            <p class="error-message">Oh no! There was a crash. Maybe try a different route?</p>
            <a href="/" class="back-to-home">Back to home</a>
        </section>
    `
    res.status(500).render("error/500", {
    title: "Server Error",
    nav: res.locals.nav,
    error500: error500Body
  })
}