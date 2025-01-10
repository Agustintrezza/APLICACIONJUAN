import { useState, useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, Link } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import * as Yup from 'yup'
import { API_URL } from '../config' // Importa la URL base

const SignInScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useContext(AppContext)
  const navigate = useNavigate()

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Debe ser un correo electrónico válido')
      .required('El correo electrónico es obligatorio'),
    password: Yup.string()
      .min(4, 'La contraseña debe tener al menos 4 caracteres')
      .max(15, 'La contraseña no debe superar los 15 caracteres')
      .required('La contraseña es obligatoria'),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await validationSchema.validate({ email, password }, { abortEarly: false })

      const response = await fetch(`${API_URL}/api/auth/signin`, { // Usa la URL base
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Error en las credenciales')
      }

      const data = await response.json()
      login(data.user)
      navigate('/')
    } catch (error) {
      if (error.name === 'ValidationError') {
        const validationErrors = {}
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message
        })
        setErrors(validationErrors)

        setTimeout(() => {
          setErrors({})
        }, 4000)
      } else {
        alert(error.message)
      }
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 mb-20 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">INICIAR SESIÓN</h2>

        <div className="mb-4">
          <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-2 border text-sm rounded-lg focus:ring-[#293e68] focus:border-[#293e68] ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div className="mb-4 relative">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
            Contraseña
          </label>
          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-2 border text-sm rounded-lg focus:ring-[#293e68] focus:border-[#293e68] pr-10 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        <button
          type="submit"
          className="w-full text-white bg-[#293e68] hover:bg-[#1f2d4b] font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-4"
        >
          Ingresar
        </button>

        <div className="text-center">
          <Link to="/" className="text-[#293e68] hover:underline">
            Olvidé mi contraseña
          </Link>
        </div>
      </form>
    </div>
  )
}

export default SignInScreen
