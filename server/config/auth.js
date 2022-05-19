export const ensureAdmin = function (request, response, next) {
    if (!request.isAuthenticated() || request.user.rights != 2) {
        return response.status(403).json({ error: 'Action requires administrator autentication.', auth: request.isAuthenticated() });
    }
    next();
}
export const ensureAuth = function (request, response, next) {
    if (!request.isAuthenticated()) {
        return response.status(203).json('Action requires authentication.');
    }
    next();
}