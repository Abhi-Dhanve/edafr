import RegisterForm from "./components/RegisterForm";

export default function () {
  return (
    <div className="flex flex-col items-center p-page py-5">
      <h1 className="text-2xl font-semibold text-center mb-5">
        Register for sessions
      </h1>

      <RegisterForm/>
    </div>
  );
}
