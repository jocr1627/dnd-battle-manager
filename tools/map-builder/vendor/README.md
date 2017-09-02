This vendor folder exists so that we don't need to bring in webpack for the one
external library which decided not to provide a CDN. While I usually dislike CDNs
because they innately pollute the global namespace, I hate webpack config more.
