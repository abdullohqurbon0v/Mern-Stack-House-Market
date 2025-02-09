'use client';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from '@/components/shared/navbar';
import { ChildProps } from '@/types';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { CalendarIcon, Home, Plus } from 'lucide-react';
import { ModeToggle } from '@/components/shared/mode-toggle';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { fetchData } from '@/http/api';

const MainLayout = ({ children }: ChildProps) => {
  // SELECT VALUES
  const [repair, setRepair] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [userViaOwner, setUserViaOwner] = useState<string>('')
  const [owner, setOwner] = useState<string>('')
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
  const [isMounted, setIsMounted] = useState(false);

  // FILES
  const [files, setFiles] = useState<File[]>([]);
  const { toast } = useToast()

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles(selectedFiles);
    }
  };
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;


  const handleAddHome = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await fetchData.post('/create-house', { repair, address, userViaOwner, owner, valute, landmark, district })
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Ошибка с сервером пожалуста попытайтесь заново"
      })
    }
    console.log(repair)
    console.log(userViaOwner)
    console.log(owner)
    console.log(district)
    console.log(address)
    console.log(landmark)
    console.log(rooms)
    console.log(floor)
    console.log(numberOfFloorOfTheBuildind)
    console.log(square)
    console.log(date)
    console.log(checkConditioner);
    console.log(files)

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
                    <NavigationMenuTrigger className="border">Profile</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className='flex flex-col  '>
                        <button className='px-5 py-2 hover:bg-slate-200 transition-all'>Профиль</button>
                        <button className='px-5 py-2 hover:bg-slate-200 transition-all'>Выйти</button>
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
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
            <main>
              {children}
            </main>
          </div>
        </div>
        <Dialog>
          <DialogTrigger className="absolute left-[95%] top-[91%] border p-3 rounded-xl hover:bg-slate-900 transition-all z-50">
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
                            <SelectItem value="new">Новый</SelectItem>
                            <SelectItem value="old">Старый</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Пользователь как владелец</label>
                        <Select onValueChange={(value) => setUserViaOwner(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите владельца пользователя" />
                          </SelectTrigger>
                          <SelectContent>
                            <form className='flex flex-col space-y-3'>
                              <Input type="text" placeholder="Введите адрес" />
                              <SelectItem value="user1">Пользователь 1</SelectItem>
                              <SelectItem value="user2">Пользователь 2</SelectItem>
                            </form>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium">Владелец</label>
                        <Select onValueChange={(value) => setOwner(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите владельца квартиры" />
                          </SelectTrigger>
                          <SelectContent>
                            <form className='flex flex-col space-y-3'>
                              <Input type="text" placeholder="Введите адрес" />
                              <SelectItem value="ownew1">Пользователь 1</SelectItem>
                              <SelectItem value="ownew2">Пользователь 2</SelectItem>
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
                            <SelectItem value="district1">Район 1</SelectItem>
                            <SelectItem value="district2">Район 2</SelectItem>
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
                        <label className="block text-sm font-medium">Площадь</label>
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
                          <Textarea placeholder='"Ведтье описание дома' value={description} onChange={e => setDescription(e.target.value)} />
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
                      <Button variant="outline">Отмена</Button>
                      <Button type="submit">Создать</Button>
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
