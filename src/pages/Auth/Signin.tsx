import React, { useState } from 'react'
import { Button, TextField, Checkbox } from '@material-ui/core'
import { useSession } from 'contexts'
import { useHistory } from 'react-router-dom'
import { PrimaryButton } from 'components/PrimaryButton'
import FormControlLabel from '@material-ui/core/FormControlLabel'

interface IError {
  [field: string]: string
}

export const Signin = ({ setIsSignUp, setLogined }: { setIsSignUp: (isSignUp: boolean) => void, setLogined: (logined: boolean) => void }) => {
  const { requestUserSignin } = useSession()
  const history = useHistory()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<IError>({})
  const [loading, setLoading] = useState(false)
  const [isRememberPassword, setIsRemember] = useState(false)

  const handleValidation = (field: string, value: Maybe<string>) => {
    const error: IError = {}
    error[field] = value ? '' : 'This field is required'
    return error
  }

  const handleInputChange = (e: any) => {
    const field = e.target.id
    const value = e.target.value

    if (field === 'email') {
      setEmail(value)
    } else if (field === 'password') {
      setPassword(value)
    }

    setErrors({})
  }

  const handleRememberChange = (event: any) => {
    setIsRemember(event.target.checked)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const error = {
      ...errors,
      ...handleValidation('email', email),
      ...handleValidation('password', password),
    }
    const userCredentialsValid =
      Object.keys(error).filter((field) => error[field] !== '').length === 0
    if (!userCredentialsValid) {
      setErrors(error)
      return
    } else {
      setLoading(true)
      try {
        const res = await requestUserSignin(email, password)
        if (res.errors) {
          setErrors(res.errors)
        } else {          
          if (res.user?.permit === 1) {
            window.location.reload()
          } else {
            setLogined(true)
          }
        }
      } catch (err) {
        console.log(err)
      }
      setLoading(false)
    }
  }

  return (
    <form className='flex flex-col justify-center items-center gap-6 md:gap-8 mt-8 md:mt-16' onSubmit={handleSubmit}>
      <TextField
        id="email"
        type="email"
        label="Email"
        value={email}
        onChange={handleInputChange}
        error={!!errors.email || !!errors.invalidCredentials}
        helperText={errors.email || errors.invalidCredentials}
        className='w-full px-4 py-4'
        disabled={loading}
      />
      <TextField
        id="password"
        type="password"
        label="Password"
        value={password}
        onChange={handleInputChange}
        error={!!errors.password}
        helperText={errors.password}
        className='w-full px-4 py-4'
        disabled={loading}
      />
      <div className='w-full flex justify-between items-center'>
        <FormControlLabel
          control={
            <Checkbox
              checked={isRememberPassword}
              onChange={handleRememberChange}
              color="default"
              inputProps={{ 'aria-label': 'checkbox with default color' }}
            />
          }
          label="Remember me"
        />
        <div className='text-[16px] text-[#949494] cursor-pointer'>
          Forgot Password
        </div>
      </div>
      <div className='mt-10'>
        <PrimaryButton onClick={handleSubmit} width='227px' disabled={loading}>
          Login
        </PrimaryButton>
        <div className='hidden'><Button type="submit" disabled={loading} /></div>
      </div>
      <div className='flex text-[18px] gap-2 mt-2 md:mt-4'>
        <span className="text-[#474747]">Don't have an account?</span>
        <div className="text-[#3FBCE9] cursor-pointer" onClick={() => setIsSignUp(true)}>Sign up</div>
      </div>
    </form>
  )
}
