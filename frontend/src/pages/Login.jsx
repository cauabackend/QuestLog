import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser, registerUser } from "../services/api";

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data;
      if (isRegister) {
        data = await registerUser(email, username, password);
      } else {
        data = await loginUser(email, password);
      }
      login(data.access_token, data.user);
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.detail;
      if (msg === "Email already registered") setError("Esse email ja esta cadastrado");
      else if (msg === "Username already taken") setError("Esse nome de usuario ja existe");
      else if (msg === "Invalid email or password") setError("Email ou senha incorretos");
      else setError("Algo deu errado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#DC2626] rounded-xl flex items-center justify-center text-sm font-extrabold text-white mx-auto mb-4">
            QL
          </div>
          <h1 className="text-2xl font-bold text-white">
            Quest<span className="text-[#DC2626]">Log</span>
          </h1>
          <p className="text-[#525252] text-sm mt-2">
            {isRegister ? "Crie sua conta" : "Entre na sua conta"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[12px] text-[#525252] block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-[#E5E5E5] text-sm placeholder-[#525252] focus:outline-none focus:border-[#DC2626]/50"
              placeholder="seu@email.com"
            />
          </div>

          {isRegister && (
            <div>
              <label className="text-[12px] text-[#525252] block mb-1">Nome de usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-[#E5E5E5] text-sm placeholder-[#525252] focus:outline-none focus:border-[#DC2626]/50"
                placeholder="seu_username"
              />
            </div>
          )}

          <div>
            <label className="text-[12px] text-[#525252] block mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-[#141414] border border-[#262626] rounded-lg px-4 py-2.5 text-[#E5E5E5] text-sm placeholder-[#525252] focus:outline-none focus:border-[#DC2626]/50"
              placeholder="minimo 6 caracteres"
            />
          </div>

          {error && (
            <p className="text-[#EF4444] text-xs">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#DC2626] text-white text-sm font-semibold rounded-lg hover:bg-[#B91C1C] transition-all disabled:opacity-50"
          >
            {loading ? "..." : isRegister ? "Criar conta" : "Entrar"}
          </button>
        </form>

        <p className="text-center text-[#525252] text-sm mt-6">
          {isRegister ? "Ja tem conta?" : "Nao tem conta?"}{" "}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
            className="text-[#DC2626] hover:text-[#EF4444] transition-colors font-medium"
          >
            {isRegister ? "Entrar" : "Criar conta"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;