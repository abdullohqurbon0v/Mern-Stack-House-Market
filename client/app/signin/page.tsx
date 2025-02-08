'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchData } from '@/http/api'
import { Loader2 } from 'lucide-react'
import React, { FormEvent, useEffect, useState } from 'react'
import { useToast } from "@/hooks/use-toast"
import { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'


const SignInPage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "" as string,
    password: "" as string,
  })
  const [loading, setLoading] = useState<boolean>(false)
  const { toast } = useToast()

  const handleChangeInput = (e: FormEvent<HTMLInputElement>): void => {
    const { name, value } = e.target as HTMLInputElement
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetchData.post('login', {
        email: formData.email,
        password: formData.password
      })
      console.log(response)
      localStorage.setItem('token', response.data.access_token)
      setLoading(false)
      toast({
        title: 'Успех',
        description: "Вы успешно вошли в систему",
        duration: 3000,
      })
      router.push('/')
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.message) {
          toast({
            title: 'Ошибка',
            variant: "destructive",
            description: error.response.data.message,
            duration: 3000,
          })
        } else {
          toast({
            title: 'Ошибка',
            variant: "destructive",
            description: 'Произошла непредвиденная ошибка.',
            duration: 3000,
          })
        }
      } else {
        console.error('Неожиданная ошибка:', error)
        toast({
          title: 'Ошибка',
          variant: "destructive",
          description: 'Произошла непредвиденная ошибка.',
          duration: 3000,
        })
      }
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      router.push('/')
    }
  }, [router])


  return (
    <div className='bg-gray-900 text-white h-screen'>
      <div className="flex items-center justify-center min-h-[90vh]">
        <div className="p-8 rounded-lg w-full sm:w-[500px] max-h-[80vh]">
          <h2 className="text-2xl font-bold mb-6">Авторизоваться</h2>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">Электронная почта</label>
              <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                placeholder="Введите вашу почту"
                onChange={e => handleChangeInput(e)}
                className="w-full mt-2 py-5 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">Пароль</label>
              <Input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={e => handleChangeInput(e)}
                placeholder="Введите ваш пароль"
                className="w-full mt-2 py-5 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <Button className="w-full mt-4 bg-blue-500 text-white hover:bg-blue-600" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Проверка...
                  </>
                ) : "Войти"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
