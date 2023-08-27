import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Components/Button";
import axios from "../api/axios";
import { useStateContext } from "../context/StateContextProvider";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "react-query";
import Spinner from "../Components/Spinner";

type RegistrationInput = {
  username : string[];
  email : string[];
  password : string[];
}
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<RegistrationInput | null>(null);
  const { handleSnackMessage } = useStateContext();
  const navigate = useNavigate();
  const { mutate: register, isLoading} = useMutation({
    mutationFn: () =>
      axios.post("/register", {
        username,
        email,
        password,
      }),
      onSuccess : () => {
        navigate("/login");
        handleSnackMessage("Registration was successfull, now please login", "error");
      }, 
      onError : (e : any) => {
        if (e.response.data.detail) {
          handleSnackMessage(e.response.data.detail, "error");
        } else {
          handleSnackMessage("registration operation failed", "error");
        }
        setErrorMessage(e.response.data);
      }
  })
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    register()
  };

  return (
    <div>
      <AnimatePresence>
        <motion.form
          className=" w-[95%] md:w-[70%] m-auto mt-[5rem] flex flex-col items-center"
          onSubmit={handleSubmit}
          initial={{
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.5,
          }}
        >
          <div className="text-center font-bold text-3xl mt-5 text-gray-200">
            Welcome To <span className="text-primary">Yellow</span>
          </div>
          <div className="flex flex-col w-full md:w-[65%]">
            <input
              placeholder="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`${
                errorMessage?.username ? "border-red-500" : "border-gray-300"
              } p-2 border-1 mt-4 w-full text-gray-200 bg-transparent rounded-lg focus:shadow-purple-500 focus:border-purple-500 focus:ring-purple-500 `}
            />
            {errorMessage?.username && (
              <div className="w-full p-2 pl-2">
                {errorMessage?.username?.map((message, i) => (
                  <p key={i} className="text-red-500">
                    {message}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col w-full md:w-[65%]">
            <input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${
                errorMessage?.email ? "border-red-500" : "border-gray-300"
              } p-2 border-1 mt-4 w-full text-gray-200 bg-transparent rounded-lg focus:shadow-purple-500 focus:border-purple-500 focus:ring-purple-500 `}
            />
            {errorMessage?.email && (
              <div className="w-full p-2 pl-2">
                {errorMessage?.email?.map((message, i) => (
                  <p key={i} className="text-red-500">
                    {message}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col w-full md:w-[65%]">
            <input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className={`${
                errorMessage?.password ? "border-red-500" : "border-gray-300"
              } p-2 border-1 mt-4 w-full text-gray-200 bg-transparent rounded-lg focus:shadow-purple-500 focus:border-purple-500 focus:ring-purple-500 `}
            />
            {errorMessage?.password && (
              <div className="w-full p-2 pl-2">
                {errorMessage?.password?.map((message, i) => (
                  <p key={i} className="text-red-500">
                    {message}
                  </p>
                ))}
              </div>
            )}
            <p className="text-gray-200 mt-2 mr-auto">
              Already have an account?{" "}
              <Link className="text-primary" to="/login">
                Sign in
              </Link>
            </p>
          </div>
          <Button
            type={2}
            text={isLoading ? "" : "Submit"}
            style="w-[6rem] h-[3rem] mt-3"
            icon={isLoading && <Spinner width="30" height="30" />}
            disabled = {isLoading}
          />
        </motion.form>
      </AnimatePresence>
    </div>
  );
};

export default Register;
