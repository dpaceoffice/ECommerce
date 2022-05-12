    login(request, response, next) {
        const {email, password} = request.body;
        console.log(email, password);
        console.log(request.session.id);//express

        const config = {};
        config.successRedirect = '/';
        config.failureRedirect = '/login';
        const authHandler = passport.authenticate('local', config);
        authHandler(request, response, next);//passes body into passport
        response.send('success');
    }

        const requester = request.user.name;
        const data = { store_state, products, categories,  requester};
