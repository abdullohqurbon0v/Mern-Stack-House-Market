'use client';
import AppSidebar from '@/components/shared/navbar';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ChildProps, IUser } from '@/types';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { ModeToggle } from '@/components/shared/mode-toggle';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList
} from "@/components/ui/breadcrumb";
import { useToast } from '@/hooks/use-toast';
import { fetchData } from '@/http/api';
import { useHouseStore } from '@/store/houses';
import { useUser } from '@/store/user';

import { Home } from 'lucide-react';
import { useRouter } from 'next/navigation';


const MainLayout = ({ children }: ChildProps) => {
  const { user, setUserStore } = useUser()
  const { addHouse } = useHouseStore()
  const router = useRouter()

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
        duration: 2000
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
      </SidebarProvider>
    </div>
  );
};

export default MainLayout;
