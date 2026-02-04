import "./signin.css"


const SignIn = () => {
    return (
        <div className="container">
            <div className="row">
                
                <div className="d-done d-md-flex col-md-6 d-flex profile-left">
                    <h2>Welcome</h2>
                </div>

                <div className="col-md-6 profile-right">
                     <h2>Sign In</h2>
                    <form className="signin-form">
                       

                        <input
                            type="text"
                            placeholder="Username"
                            className="form-control"
                        />

                        <input
                            type="password"
                            placeholder="Lozinka"
                            className="form-control"
                        />
                        <a href="#">Zaboravili ste lozinku?</a>

                        <button type="submit" className="btn btn-primary">
                            Prijavi se
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default SignIn