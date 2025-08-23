export function sessionAuthMiddleware(req, res, next) {
  try {
    const protectedPaths = ["/api/v1/post", "/api/v1/dalle", "/api/v1/api-key"];
    console.log("sessin auth", req.session, "path:", req.path);

    //all subRoutes allowed from protected paths
    if (!protectedPaths.some((p) => req.path.startsWith(p))) {
      return next();
    }

    /* 
  //only base protected path allowed:: /api/v1/post (good), /api/v1/post/create-x (fails)
  if (!protectedPaths.includes(req.path)) {
   return next(); // skip auth on public routes
 } */
    
    if (req.session && req.session?.user) {
      console.log("AUTHENTICATED: ", req.session.user);
      return next();
    }

    //unauthorized
    res.status(401).json({
      success: false,
      message: "Unauthorized, please log in",
    });
  } catch (error) {
    //unauthorized
    res.status(401).json({
      success: false,
      message: "Error during session authorization, please log in again",
    });
  }
}
