module.exports = {
  port: process.env.PORT,
  clientServer: process.env.REMOTE_CLIENT_SERVER,
  allowedDomains: (
    process.env.NODE_ENV === 'production' ?
    [
      process.env.REMOTE_SERVER_API
    ] : 
    [
      process.env.LOCAL_SERVER_API
    ]
  ),
  allowedAuthDomains: (
    process.env.NODE_ENV === 'production' ?
    [
      process.env.REMOTE_AUTH_API
    ] : 
    [
      process.env.AUTH_SERVER_API
    ]
  ),
  allowedSocketDomains: (
    process.env.NODE_ENV === 'production' ?
    [
      process.env.REMOTE_SOCKET_API
    ] : 
    [
      process.env.SOCKET_SERVER_API
    ]
  )
}