'use client';
import AppSidebar from '@/components/shared/navbar';
import { Input } from '@/components/ui/input';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Textarea } from "@/components/ui/textarea";
import { cn } from '@/lib/utils';
import { ChildProps, IUser } from '@/types';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { ModeToggle } from '@/components/shared/mode-toggle';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList
} from "@/components/ui/breadcrumb";
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { rayons } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { fetchData } from '@/http/api';
import { useHouseStore } from '@/store/houses';
import { useUser } from '@/store/user';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { CalendarIcon, Home, Loader2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';


const MainLayout = ({ children }: ChildProps) => {
  const { user, setUserStore } = useUser()
  const { addHouse } = useHouseStore()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [users, setUsers] = useState<IUser[]>([])
  // SELECT VALUES
  const [repair, setRepair] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [userViaOwner, setUserViaOwner] = useState<string>('')
  const [valute, setValute] = useState<string>('')

  // CHANGE VALUES
  const [landmark, setLandmark] = useState<string>('')
  const [district, setDistrict] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  // NUMERAL CHANGES
  const [square, setSquare] = useState('')
  const [date, setDate] = useState<Date>();
  const [floor, setFloor] = useState<number>(0)
  const [rooms, setRooms] = useState<number>(0)
  const [numberOfFloorOfTheBuildind, setNumberOfFloorOfTheBuildind] = useState<number>(0)
  const [price, setPrice] = useState<number>(0)

  // CHECK BOX
  const [checkConditioner, setCheckConditioner] = useState<boolean>(false)
  const [tv, setTv] = useState<boolean>(false)
  const [washingMaching, setWashingMachine] = useState<boolean>(false)
  const [prepayment, setPrepayment] = useState<boolean>(false)
  const [deposit, setDeposit] = useState<boolean>(false)
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [location, setLocation] = useState<string>('')

  // FILES
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false)
  const { toast } = useToast()

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles(selectedFiles);
    }
  };
  useEffect(() => {
    setIsMounted(true);
    const getUserInfo = async () => {
      const res = await fetchData.get('/get-user-info')
      console.log("User info", res)
      setUserStore(res.data.user)
    }
    getUserInfo()
  }, [setUserStore]);

  const onLogout = () => {
    localStorage.clear()
    router.push('/signin')
  }

  useEffect(() => {
    console.log(window.location.pathname)
    const loc = window.location.pathname
    setLocation(loc)
  }, [])

  if (!isMounted) return null;
  const handleAddHome = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!repair || !address || !userViaOwner || !valute || !landmark || !description || !square || !date || !rooms || !numberOfFloorOfTheBuildind || !price || !files) {
        setLoading(false);
        return toast({
          title: "Ошибка",
          description: "Нужно ввести все данные !!",
        });
      }
      const formData = new FormData();
      formData.append("repair", repair);
      formData.append("address", address);
      formData.append("userViaOwner", userViaOwner);
      formData.append("valute", valute);
      formData.append("landmark", landmark);
      formData.append("district", district);
      formData.append("description", description);
      formData.append("square", square.toString());
      formData.append("date", date.toISOString());
      formData.append("floor", floor.toString());
      formData.append("rooms", rooms.toString());
      formData.append("numberOfFloorOfTheBuildind", numberOfFloorOfTheBuildind.toString());
      formData.append("price", price.toString());
      formData.append("checkConditioner", checkConditioner.toString());
      formData.append("tv", tv.toString());
      formData.append("washingMaching", washingMaching.toString());
      formData.append("prepayment", prepayment.toString());
      formData.append("deposit", deposit.toString());

      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
          formData.append("files[]", file);
        });
      }

      const res = await fetchData.post('/create-house', formData);
      console.log(res)
      addHouse(res.data.house)
      setLoading(false);
      setIsModalOpen(false)
    } catch (error) {
      console.log(error);
      toast({
        title: "Ошибка",
        variant: "destructive",
        description: "Ошибка с сервером, пожалуйста, попытайтесь заново",
        duration:2000
      });
      setLoading(false);
    }
  };

  const handleOpenModal = async () => {
    setIsModalOpen(true)
    try {
      const res = await fetchData.get('/get-all-users')
      setUsers(res.data.users)
      console.log(res)
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Ошибка с сервером, пожалуйста, попытайтесь заново",
      });
      console.log(error)
    }
  }



  return (
    <div className="min-h-screen flex  ">
      <SidebarProvider>
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="w-full flex justify-between items-center p-4 pr-10 shadow-md">
            <div className='flex items-center space-x-2'>
              <SidebarTrigger />
              <h1 className="text-lg font-bold">MyHomeGroup</h1>
            </div>
            <div className='flex space-x-5'>
              <ModeToggle />
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="border">{user && user.fullName}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className='flex flex-col  '>
                        <button className='px-5 py-2 hover:bg-slate-200 transition-all'>Профиль</button>
                        <button className='px-5 py-2 hover:bg-slate-200 transition-all' onClick={onLogout}>Выйти</button>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </header>

          <div className="p-6 flex-1 space-y-5"><Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/"><Home /></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">{location}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
            <main>
              {children}
            </main>
          </div>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger onClick={handleOpenModal} className="absolute left-[95%] top-[91%] border p-3 rounded-xl hover:bg-slate-900 transition-all z-50">
            <Plus />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать новую квартиру</DialogTitle>
              <DialogDescription asChild>
                <div className=''>
                  <form className='' onSubmit={handleAddHome}>
                    <div className='max-h-[500px] px-3 py-5 overflow-y-scroll space-y-4'>
                      <div>
                        <label className="block text-sm font-medium">Ремонт</label>
                        <Select onValueChange={value => setRepair(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Авторский ремонт">Авторский ремонт</SelectItem>
                            <SelectItem value="Хайтек">Хайтек</SelectItem>
                            <SelectItem value="Новый">Новый</SelectItem>
                            <SelectItem value="Евро ремонт">Евро ремонт</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Владелец</label>
                        <Select onValueChange={(value) => setUserViaOwner(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите владельца пользователя" />
                          </SelectTrigger>
                          <SelectContent>
                            <form className='flex flex-col space-y-3'>
                              {users?.map(item => (
                                <SelectItem key={item._id} value={item.fullName}>{item.fullName}</SelectItem>
                              ))}
                            </form>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Район</label>
                        <Select onValueChange={(value) => setDistrict(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите" />
                          </SelectTrigger>
                          <SelectContent>
                            {rayons.map(item => (
                              <SelectItem key={item} value={item}>{item}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Адрес</label>
                        <Input type="text" placeholder="Введите адрес" value={address} onChange={(e) => setAddress(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Ориентир</label>
                        <Input type="text" placeholder="Введите ориентир" value={landmark} onChange={(e) => setLandmark(e.target.value)} />
                      </div>


                      <div>
                        <label className="block text-sm font-medium">Количество комнат</label>
                        <Input type="number" min="1" placeholder="Введите количество комнат" value={rooms} onChange={e => setRooms(Number(e.target.value))} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Этаж</label>
                        <Input type="number" min="1" placeholder="Введите этаж" value={floor} onChange={e => setFloor(Number(e.target.value))} />
                      </div>

                      <div>
                        <label className="block text-sm font-medium">Этажность здания</label>
                        <Input type="number" min="1" placeholder="Введите этажность здания" value={numberOfFloorOfTheBuildind} onChange={(e) => setNumberOfFloorOfTheBuildind(Number(e.target.value))} />
                      </div>

                      <div>
                        <label className="block text-sm font-medium">Площадь m<sup>2</sup></label>
                        <Input type="number" min="1" placeholder="Введите площадь кв.м" value={square} onChange={(e) => setSquare(e.target.value)} />
                      </div>

                      <div className='flex flex-col space-y-5'>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="conditioner" checked={checkConditioner} onCheckedChange={() => setCheckConditioner(!checkConditioner)} />
                          <label
                            htmlFor="conditioner"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Кондиционер
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="tv" checked={tv} onCheckedChange={() => setTv(!tv)} />
                          <label
                            htmlFor="tv"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Телевизор
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="Washing-machine" checked={washingMaching} onCheckedChange={() => setWashingMachine(!washingMaching)} />
                          <label
                            htmlFor="Washing-machine"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Стиральная машина
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="prepayment" onCheckedChange={() => setPrepayment(!prepayment)} />
                          <label
                            htmlFor="prepayment"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Предоплата
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="deposit" checked={deposit} onCheckedChange={() => setDeposit(!deposit)} />
                          <label
                            htmlFor="deposit"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Депозит
                          </label>
                        </div>
                        <div >
                          <label
                            htmlFor="deposit"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Описание
                          </label>
                          <Textarea placeholder='Ведтье описание дома' value={description} onChange={e => setDescription(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Цена</label>
                          <Input type="number" placeholder="Введите цену" onChange={(e) => setPrice(Number(e.target.value))} />
                        </div>
                        <Select onValueChange={value => setValute(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите волюту" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="usd">USD</SelectItem>
                            <SelectItem value="uzs">UZS</SelectItem>
                          </SelectContent>
                        </Select>
                        <div>
                          <p>Дата доступности</p>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-[200px] justify-start text-left font-normal",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : <span>Выберите дату</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Изображение</label>
                          <Input type="file" multiple onChange={handleFileChange} />
                          {files.length > 0 && (
                            <ul className="mt-2">
                              {files.map((file, index) => (
                                <li key={index} className="text-sm">
                                  {file.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <DialogClose asChild>
                        <Button variant="outline" type="button">Отмена</Button>
                      </DialogClose>
                      <Button type="submit" disabled={loading}>
                        {loading ? (
                          <motion.span
                            className="flex items-center space-x-2"
                            initial={{ opacity: 0.5, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "mirror" }}
                          >
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Загрузка...</span>
                          </motion.span>
                        ) : (
                          "Создать"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
