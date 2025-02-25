'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { rayons } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { fetchData } from '@/http/api';
import { cn } from '@/lib/utils';
import { useHouseStore } from '@/store/houses';
import { useUser } from '@/store/user';
import { IHouse, IUser, OwnersTypes } from '@/types';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Edit, Loader2, Plus, Send } from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

const MainPage = () => {
  const { toast } = useToast()
  const { user } = useUser()
  const { houses, setAllHouses, addHouse } = useHouseStore()
  const router = useRouter();
  const [owners, setOwners] = useState<OwnersTypes[]>([])
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false)
  const [viewData, setViewData] = useState<IHouse | null>(null)
  const [users, setUsers] = useState<IUser[] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [$loading, $setLoading] = useState<boolean>(false)
  const [selectedEditHouse, setSelectedEditHouse] = useState<string>('')
  const [loadingWhenDelete, setLoadingWhenDelete] = useState<boolean>(false)
  // DATE
  const [$date, $setDate] = useState<Date>();
  // CHECKBOX
  const [checkConditioner, setCheckConditioner] = useState<boolean>(false)
  const [tv, setTv] = useState<boolean>(false)
  const [washingMaching, setWashingMachine] = useState<boolean>(false)
  const [prepayment, setPrepayment] = useState<boolean>(false)
  const [deposit, setDeposit] = useState<boolean>(false)

  // NUMBER STATES
  const [rooms, setRooms] = useState<number>(0)
  const [floors, setFloors] = useState<number>(0)
  const [square, setSquare] = useState<number>(0)
  const [price, setPrice] = useState<number>(1)
  const [numberOfFloorOfTheBuildind, setNumberOfFloorOfTheBuildind] = useState<number>(0)

  // INPIT CHANGE ITEMS
  const [address, setAddress] = useState<string>('')
  const [landmark, setLandmark] = useState<string>('')
  const [description, setDescription] = useState<string>('')

  // SELECT ITEMS
  const [repair, setRepair] = useState<string>('')
  const [userViaOwner, setUserViaOwner] = useState<string>('')
  const [district, setDistrict] = useState<string>('')
  const [valute, setValute] = useState<string>('')
  const [selectOwners, setSelectOwners] = useState<string>('')
  const [ownerFilterValue, setOwnerFilterValue] = useState('')

  // FILTER
  const [fId, setFId] = useState<number>(0)
  const [date, setDate] = useState<Date>()
  const [fRepair, setFRepair] = useState('')
  const [fPrice, setFPrice] = useState(0)
  const [fDistrict, setFDistrict] = useState('')
  const [fRooms, setFRooms] = useState(0)
  const [fFloors, setFFloors] = useState(0)
  const [fUserViaOwner, setFUserViaOwner] = useState('')

  // ADD STATES
  const [aRepair, setARepair] = useState<string>('')
  const [aUserViaOwner, setAUserViaOwner] = useState<string>('')
  const [aDistrict, setADistrict] = useState<string>('')
  const [Aaddress, setAaddress] = useState<string>('')
  const [aLandmark, setALandmark] = useState<string>('')
  const [aRooms, setARooms] = useState<number>(0)
  const [aFloor, setAFloor] = useState<number>(0)
  const [AnumberOfFloorOfTheBuildind, setANumberOfFloorOfTheBuildind] = useState<number>(0)
  const [aSquare, setAsquare] = useState<string>('')
  const [aCheckconditioner, setAcheckconditioner] = useState<boolean>(false)
  const [ATV, setATV] = useState<boolean>(false)
  const [AwashingMachine, setAWashingMachine] = useState<boolean>(false)
  const [APrepayment, setAPrepayment] = useState<boolean>(false)
  const [ADeposit, setADeposit] = useState<boolean>(false)
  const [ADescription, setADescription] = useState<string>('')
  const [Aprice, setAPrice] = useState<string>('')
  const [AValute, setAValute] = useState<string>('')
  const [Adate, setADate] = useState<Date>()

  const [addLoading, setAddloading] = useState(false)

  const  [search, setSearch] = useState('')

  const [files, setFiles] = useState<File[]>([]);
  const [isModalAddOpen, setIsModalAddOpen] = useState<boolean>(false)

  const [selectedFilter, setSelectedFilter] = useState('all')



  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles(selectedFiles);
    }
  };

  const handleAddHome = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddloading(true);
    try {
      if (!aRepair || !Aaddress || !aDistrict || !aUserViaOwner || !AValute || !aLandmark || !ADescription || !aSquare || !Adate || !aRooms || !AnumberOfFloorOfTheBuildind || !Aprice || !files) {
        setAddloading(false);
        return toast({
          title: "Ошибка",
          description: "Нужно ввести все данные !!",
        });
      }
      const formData = new FormData();
      formData.append("repair", aRepair);
      formData.append("address", Aaddress);
      formData.append("userViaOwner", aUserViaOwner);
      formData.append("valute", AValute);
      formData.append("landmark", aLandmark);
      formData.append("district", aDistrict);
      formData.append("description", ADescription);
      formData.append("square", aSquare.toString());
      formData.append("date", Adate.toISOString());
      formData.append("floor", aFloor.toString());
      formData.append("rooms", aRooms.toString());
      formData.append("numberOfFloorOfTheBuildind", AnumberOfFloorOfTheBuildind.toString());
      formData.append("price", Aprice.toString());
      formData.append("checkConditioner", aCheckconditioner.toString());
      formData.append("tv", ATV.toString());
      formData.append("washingMaching", AwashingMachine.toString());
      formData.append("prepayment", APrepayment.toString());
      formData.append("deposit", ADeposit.toString());
      formData.append('owner', selectOwners)

      if (files && files.length > 0) {
        Array.from(files).forEach((file) => {
          formData.append("files[]", file);
        });
      }

      const res = await fetchData.post('/create-house', formData);
      console.log(res)
      addHouse(res.data.house)
      setAddloading(false);
      setIsModalAddOpen(false)
    } catch (error) {
      console.log(error);
      toast({
        title: "Ошибка",
        variant: "destructive",
        description: "Ошибка с сервером, пожалуйста, попытайтесь заново",
        duration: 2000
      });
      setAddloading(false);
    }
  };

  const getMyHouses = async () => {
    try {
      const res = await fetchData.get('/my-houses')
      setAllHouses(res.data.houses)

    } catch (error) {
      console.log(error)
      toast({
        title: "Ошибка",
        variant: "destructive",
        description: "Ошибка с сервером, пожалуйста, попытайтесь заново",
        duration: 2000
      });
    }
  }

  useEffect(() => {
    if (selectedFilter === 'my') {
      getMyHouses()
    } else {
      return
    }
  }, [selectedFilter])


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
    }
    const getHouses = async () => {
      const response = await fetchData.get('/get-all-houses')
      setAllHouses(response.data.data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage))
      const res = await fetchData.get('/get-all-users')
      setUsers(res.data.users)
      console.log("All housess  ", response)
      const responseowners = await fetchData.get('/get-owners')
      console.log(responseowners)
      setOwners(responseowners.data.owners)
      setTotalItems(response.data.data.length);
    }
    getHouses()
    console.log("render")
  }, [router, currentPage, itemsPerPage, setAllHouses]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getVisiblePages = (totalPages: number, currentPage: number) => {
    let startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);
    if (endPage - startPage < 2) {
      startPage = Math.max(1, endPage - 2);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  async function onOpenViewModal(id: string, status: string) {
    setLoading(true)
    setViewData(null)
    setSelectedEditHouse(id)
    if (status === 'view') {
      setIsOpenViewModal(true)
    }
    try {
      const response = await fetchData.get(`/get-house/${id}`)
      setAddress(response.data.house.address)
      setLandmark(response.data.house.landmark)
      setDescription(response.data.house.description)
      setRepair(response.data.house.repair)
      setUserViaOwner(response.data.house.userViaOwner)
      setDistrict(response.data.house.district)
      setValute(response.data.house.valute)
      setPrice(response.data.house.price)
      setSquare(response.data.house.square)
      setFloors(response.data.house.floor)
      setRooms(response.data.house.rooms)
      setCheckConditioner(Boolean(response.data.house.checkConditioner))
      setTv(Boolean(response.data.house.tv))
      setWashingMachine(Boolean(response.data.house.washingMaching))
      setPrepayment(Boolean(response.data.house.prepayment))
      setDeposit(Boolean(response.data.house.deposit))
      setNumberOfFloorOfTheBuildind(response.data.house.numberOfFloorOfTheBuildind)
      $setDate(response.data.house.date)

      setViewData(response.data.house)
      setLoading(false)
      console.log(response)
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Ошибка не получилось загрузить данные, попытайтесь заново",
      })
      setLoading(false)
      console.log(error)
    }
  }

  async function handleEditData(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    $setLoading(true)
    try {
      // if (!repair || !address || !userViaOwner || !valute || !landmark || !description || !square || !date || !rooms || !price || !files) {
      //   setLoading(false);
      //   return toast({
      //     title: "Ошибка",
      //     description: "Нужно ввести все данные !!",
      //   });
      // }
      const formData = new FormData()
      formData.append("repair", repair);
      formData.append("address", address);
      formData.append("userViaOwner", userViaOwner);
      formData.append("valute", valute);
      formData.append("landmark", landmark);
      formData.append("district", district);
      formData.append("description", description);
      formData.append("square", square.toString());
      if (date) {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          console.error("Invalid date format:", date);
          setLoading(false);
          return;
        }
        formData.append("date", parsedDate.toISOString());
      }
      formData.append("floor", floors.toString());
      formData.append("rooms", rooms.toString());
      formData.append("numberOfFloorOfTheBuildind", numberOfFloorOfTheBuildind.toString());
      formData.append("price", price.toString());
      formData.append("checkConditioner", checkConditioner.toString());
      formData.append("tv", tv.toString());
      formData.append("washingMaching", washingMaching.toString());
      formData.append("prepayment", prepayment.toString());
      formData.append("deposit", deposit.toString());
      const res = await fetchData.put(`/edit-house/${selectedEditHouse}`, formData)
      toast({
        title: "Успех",
        description: "Данные сохранены",
        duration: 3000
      })
      console.log(res)
      $setLoading(false)
    } catch (error) {
      console.log(error)
      toast({
        title: "Ошибка",
        variant: "destructive",
        description: "Ошибка с сервером, пожалуйста, попытайтесь заново",
        duration: 3000
      })
      $setLoading(false)
    }
  }

  const onDeleteHouse = async (id: string) => {
    setLoadingWhenDelete(true)
    try {
      const response = await fetchData.delete(`/remove-house/${id}`)
      console.log(response)
      toast({
        title: "Успех",
        description: "Успех данные были удолены",
        duration: 3000
      })
      setLoadingWhenDelete(false)
      setIsModalOpen(false)
    } catch (error) {
      console.log(error)
      toast({
        title: "Ошибка",
        variant: "destructive",
        description: "Ошибка с сервером, пожалуйста, попытайтесь заново",
        duration: 3000
      })
      setLoadingWhenDelete(false)
    }
  }
  const handleChangeData = async () => {
    const formData = new FormData();
    formData.append("id", fId.toString());
    formData.append("repair", fRepair);
    formData.append('date', date ? date.toISOString() : '');
    formData.append("price", fPrice.toString());
    formData.append("district", fDistrict);
    formData.append('rooms', fRooms.toString());
    formData.append('floor', fFloors.toString());
    formData.append('userViaOwner', fUserViaOwner);
    formData.append('owner', ownerFilterValue)


    try {
      const response = await fetchData.put('/filter-houses', formData);
      setAllHouses(response.data.houses)
    } catch (error) {
      console.log(error)
      toast({
        title: "Ошибка",
        description: "Ошибка с сервером, пожалуйста, попытайтесь заново",
        duration: 3000
      });
    }
  };

  useEffect(() => {
    handleChangeData()
  }, [fId, date, fRepair, fPrice, fDistrict, fRooms, fFloors, fUserViaOwner, ownerFilterValue])

  const onRemoveFieldData = () => {
    setFId(0)
    setDate(undefined)
    setFRepair('')
    setFPrice(0)
    setFDistrict('')
    setFRooms(0)
    setFFloors(0)
    setFUserViaOwner('')
    setOwnerFilterValue('')
  }
  const onChangeFilter = async (status: string) => {
    setSelectedFilter(status)
  }

  const changeSearch =  async(e:ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    try {
      if(e.target.value.trim()) {
        const response = await fetchData.put(`/search/${e.target.value}`)
        setAllHouses(response.data.houses)
      }
    } catch (error) {
      console.log(error)
      toast({
        title: "Ошибка",
        description: "Ошибка с сервером, пожалуйста, попытайтесь заново",
        duration: 3000
      });
    }
  }
  return (
    <div className='flex flex-col space-y-2'>
      <div className='flex justify-between items-center'>
      <div className='flex space-x-5 mb-5'>
        <Button variant={selectedFilter === 'all' ? 'default' : 'ghost'} onClick={() => onChangeFilter('all')} >Все</Button>
        <Button variant={selectedFilter === 'all' ? 'ghost' : 'default'} onClick={() => onChangeFilter('my')}>Вы владеете</Button>
      </div>
      <form>
        <Input type={"text"} placeholder='Искать...' value={search} onChange={e => changeSearch(e)}/>
      </form>
      </div>
      <div className='flex justify-between'>
        <div className='flex items-center space-x-5'>
          <Button onClick={onRemoveFieldData}>Очистить фильтр</Button>
          <p>Интервал: 1 - {itemsPerPage}</p>
          <p>Всего: {totalItems}</p>
        </div>
        <div>
          <Dialog open={isModalAddOpen} onOpenChange={setIsModalAddOpen}>
            <DialogTrigger className="absolute left-[95%] top-[91%] border p-3 rounded-xl hover:bg-slate-900 transition-all z-50">
              <Plus />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать новую квартиру</DialogTitle>
                <DialogDescription asChild>
                  <div>
                    <form onSubmit={handleAddHome}>
                      <div className='max-h-[500px] px-3 py-5 overflow-y-scroll space-y-4'>
                        <div>
                          <label className="block text-sm font-medium">Ремонт</label>
                          <Select onValueChange={value => setARepair(value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Тип ремонта" />
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
                          <label className="block text-sm font-medium">Сотрудник</label>
                          <Select onValueChange={(value) => setAUserViaOwner(value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите сотрудника " />
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
                          <label className="block text-sm font-medium">Владелец</label>
                          <Select onValueChange={(value) => setSelectOwners(value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Выберите владельца" />
                            </SelectTrigger>
                            <SelectContent>
                              <form className='flex flex-col space-y-3'>
                                {owners?.map(item => (
                                  <SelectItem key={item._id} value={item.name}>{item.name}</SelectItem>
                                ))}
                              </form>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Район</label>
                          <Select onValueChange={(value) => setADistrict(value)}>
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
                          <Input type="text" placeholder="Введите адрес" value={Aaddress} onChange={(e) => setAaddress(e.target.value)} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Ориентир</label>
                          <Input type="text" placeholder="Введите ориентир" value={aLandmark} onChange={(e) => setALandmark(e.target.value)} />
                        </div>


                        <div>
                          <label className="block text-sm font-medium">Количество комнат</label>
                          <Input type="number" min="1" placeholder="Введите количество комнат" value={aRooms} onChange={e => setARooms(Number(e.target.value))} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium">Этаж</label>
                          <Input type="number" min="1" placeholder="Введите этаж" value={aFloor} onChange={e => setAFloor(Number(e.target.value))} />
                        </div>

                        <div>
                          <label className="block text-sm font-medium">Этажность здания</label>
                          <Input type="number" min="1" placeholder="Введите этажность здания" value={AnumberOfFloorOfTheBuildind} onChange={(e) => setANumberOfFloorOfTheBuildind(Number(e.target.value))} />
                        </div>

                        <div>
                          <label className="block text-sm font-medium">Площадь m<sup>2</sup></label>
                          <Input type="number" min="1" placeholder="Введите площадь кв.м" value={aSquare} onChange={(e) => setAsquare(e.target.value)} />
                        </div>

                        <div className='flex flex-col space-y-5'>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="conditioner" checked={aCheckconditioner} onCheckedChange={() => setAcheckconditioner(!aCheckconditioner)} />
                            <label
                              htmlFor="conditioner"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Кондиционер
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="tv" checked={ATV} onCheckedChange={() => setATV(!ATV)} />
                            <label
                              htmlFor="tv"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Телевизор
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="Washing-machine" checked={AwashingMachine} onCheckedChange={() => setAWashingMachine(!AwashingMachine)} />
                            <label
                              htmlFor="Washing-machine"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Стиральная машина
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="prepayment" checked={APrepayment} onCheckedChange={() => setAPrepayment(!APrepayment)} />
                            <label
                              htmlFor="prepayment"
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              Предоплата
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="deposit" checked={ADeposit} onCheckedChange={() => setADeposit(!ADeposit)} />
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
                            <Textarea placeholder='Ведтье описание дома' value={ADescription} onChange={e => setADescription(e.target.value)} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium">Цена</label>
                            <Input type="number" placeholder="Введите цену" value={Aprice} onChange={(e) => setAPrice(e.target.value)} />
                          </div>
                          <Select onValueChange={value => setAValute(value)}>
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
                                    !Adate && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {Adate ? format(Adate, "PPP") : <span>Выберите дату</span>}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0">
                                <Calendar
                                  mode="single"
                                  selected={Adate}
                                  onSelect={setADate}
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
                        <Button type="submit" disabled={addLoading}>
                          {addLoading ? (
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

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => handlePageChange(Math.max(1, currentPage - 1))} href='#' />
              </PaginationItem>
              {getVisiblePages(totalPages, currentPage).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    href='#'
                    className={currentPage === page ? 'font-bold text-blue-500' : ''}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))} href='#' />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

        </div>
      </div>
      <form>
        <Table>
          <TableCaption>Список квартир</TableCaption>
          <TableHeader>
            <TableRow className='p-5'>
              <TableHead className='p-5'>
                <div>
                  <p>ИД</p>
                  <Input
                    className='w-[100px] p-1 text-black dark:text-white border rounded'
                    onChange={(e) => {
                      setFId(Number(e.target.value))
                    }}
                    value={fId}
                    type='number'
                    placeholder='Фильтр'
                  />
                </div>
              </TableHead>
              <TableHead className='pb-9'>Изображение</TableHead>
              <TableHead>
                <div>
                  <p>Дата доступности</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[200px] justify-start text-left font-normal',
                          !date && 'text-muted-foreground'
                        )}
                      >
                        <CalendarIcon className='mr-2 h-4 w-4' />
                        {date ? format(date, 'PPP') : <span>Выберите дату</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0'>
                      <Calendar
                        mode='single'
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Ремонт</p>
                  <Select onValueChange={value => {
                    setFRepair(value)
                  }}>
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Выберите' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Тип ремонта</SelectLabel>
                        <SelectItem value="Авторский ремонт">Авторский ремонт</SelectItem>
                        <SelectItem value="Хайтек">Хайтек</SelectItem>
                        <SelectItem value="Новый">Новый</SelectItem>
                        <SelectItem value="Евро ремонт">Евро ремонт</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Цена</p>
                  <Input
                    className='w-[100px] p-1 text-black dark:text-white border rounded'
                    type='number'
                    onChange={(e) => {
                      setFPrice(Number(e.target.value))
                    }}
                    placeholder='Фильтр'
                  />
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Район</p>
                  <Select onValueChange={value => {
                    setFDistrict(value)
                  }}>
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Выберите' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Район</SelectLabel>
                        {rayons.map(item => (
                          <SelectItem key={item} value={item}>{item}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Комнаты</p>
                  <Input
                    className='w-[100px] p-1 text-black dark:text-white border rounded'
                    type='number'
                    onChange={(e) => {
                      setFRooms(Number(e.target.value))
                    }}
                    placeholder='Фильтр'
                  />
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Этаж</p>
                  <Input
                    className='w-[100px] p-1 text-black dark:text-white border rounded'
                    type='number'
                    onChange={(e) => {
                      setFFloors(Number(e.target.value))
                    }}
                    placeholder='Фильтр'
                  />
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Сотрудник</p>
                  <Select onValueChange={value => {
                    setFUserViaOwner(value)
                  }}>
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Выберите' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Владелец</SelectLabel>
                        {users && users.map(item => (
                          <SelectItem key={item._id} value={item.fullName}>{item.fullName}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Владелец</p>
                  <Select onValueChange={value => setOwnerFilterValue(value)}>
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Выберите' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Владелец</SelectLabel>
                        {owners && owners.map(item => (
                          <SelectItem key={item._id} value={item._id}>{item.phone}</SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='overflow-x-scroll'>
            {houses.length === 0 ? (
              <TableRow className="text-center">
                <TableCell>У вас пока что нету квартир на продажу</TableCell>
              </TableRow>
            ) : (
              houses.map((item) => (
                <TableRow key={item.id} className="text-center cursor-pointer">
                  <TableCell className="font-medium" onClick={() => onOpenViewModal(item._id, 'view')}>{item.id}</TableCell>
                  <TableCell onClick={() => onOpenViewModal(item._id, 'view')}>
                    {item.files && item.files.length > 0 ? (
                      <Image
                        src={`https://apimyhomegroup.onrender.com/${item.files[0]}`}
                        alt={`Image ${item.id}`}
                        className="w-[80px] h-[50px] rounded border object-cover"
                        width={100}
                        height={100}
                      />
                    ) : (
                      <div>Нет изображения</div>
                    )}
                  </TableCell>
                  <TableCell onClick={() => onOpenViewModal(item._id, 'view')}>{moment(item.date).format("DD.MM.YYYY")}</TableCell>
                  <TableCell onClick={() => onOpenViewModal(item._id, 'view')}>{item.repair}</TableCell>
                  <TableCell onClick={() => onOpenViewModal(item._id, 'view')} className="uppercase">{`${item.price.toFixed(2)} ${item.valute}`}</TableCell>
                  <TableCell onClick={() => onOpenViewModal(item._id, 'view')}>{item.district}</TableCell>
                  <TableCell onClick={() => onOpenViewModal(item._id, 'view')}>{item.rooms}</TableCell>
                  <TableCell onClick={() => onOpenViewModal(item._id, 'view')}>{item.floor}</TableCell>
                  <TableCell>{item.employee.fullName}</TableCell>
                  <TableCell>{item.owner.phone}</TableCell>
                  <TableCell>
                    {user && item.employee._id == user._id ? (
                      <div className="flex space-x-3 items-center">
                        <Dialog onOpenChange={setIsModalOpen} open={isModalOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" type="button" onClick={() => onOpenViewModal(item._id, 'edit')}>
                              <Edit />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="">
                            <DialogTitle>Edit House</DialogTitle>
                            <form onSubmit={handleEditData} className=''>
                              {loading ? (
                                <h1>Загрузка...</h1>
                              ) : (
                                <div className='max-h-[500px]  px-3 py-5 overflow-y-scroll space-y-4'>
                                  <div>
                                    <label className="block text-sm font-medium">Ремонт</label>
                                    <Select defaultValue={viewData?.repair} onValueChange={value => setRepair(value)}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          <SelectItem value="Авторский ремонт">Авторский ремонт</SelectItem>
                                          <SelectItem value="Хайтек">Хайтек</SelectItem>
                                          <SelectItem value="Новый">Новый</SelectItem>
                                          <SelectItem value="Евро ремонт">Евро ремонт</SelectItem>
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div >
                                    <label className="block text-sm font-medium ">Владелец</label>
                                    <Select defaultValue={viewData?.userViaOwner} onValueChange={value => setUserViaOwner(value)}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {users && users.map(item => (
                                            <SelectItem key={item._id} value={item.fullName}>{item.fullName}</SelectItem>
                                          ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div >
                                    <label className="block text-sm font-medium ">Район</label>
                                    <Select defaultValue={viewData?.district} onValueChange={value => setDistrict(value)}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectGroup>
                                          {rayons.map(item => (
                                            <SelectItem value={item} key={item}>{item}</SelectItem>
                                          ))}
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mt-3">Адрес</label>
                                    <Input type="text" placeholder="Введите адрес" value={address} onChange={e => setAddress(e.target.value)} />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mt-3">Ориентир</label>
                                    <Input type="text" placeholder="Введите ориентир" value={landmark} onChange={e => setLandmark(e.target.value)} />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium">Количество комнат</label>
                                    <Input type="number" min="1" placeholder="Введите количество комнат" value={rooms} onChange={e => setRooms(Number(e.target.value))} />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium">Этаж</label>
                                    <Input type="number" min="1" placeholder="Введите этаж" value={floors} onChange={(e) => setFloors(Number(e.target.value))} />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium">Этажность здания </label>
                                    <Input type="number" min="1" placeholder="Введите этажность здания" value={numberOfFloorOfTheBuildind} onChange={e => setNumberOfFloorOfTheBuildind(Number(e.target.value))} />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium">Площадь m<sup>2</sup></label>
                                    <Input type="number" min="1" placeholder="Введите площадь кв.м" value={square} onChange={e => setSquare(Number(e.target.value))} />
                                  </div>

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
                                    <Checkbox id="prepayment" checked={prepayment} onCheckedChange={() => setPrepayment(!prepayment)} />
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
                                    <Textarea placeholder='Ведтье описание дома' value={description} onChange={(e) => setDescription(e.target.value)} />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium">Цена</label>
                                    <Input type="number" placeholder="Введите цену" value={price} onChange={e => setPrice(Number(e.target.value))} />
                                  </div>

                                  <Select value={valute} onValueChange={value => setValute(value)}>
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
                                            "w-[200px] justify-start text-left font-normal"
                                          )}
                                        >
                                          <CalendarIcon className="mr-2 h-4 w-4" />
                                          {$date ? format($date, "PPP") : <span>Выберите дату</span>}
                                        </Button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-0">
                                        <Calendar
                                          mode="single"
                                          selected={$date}
                                          onSelect={$setDate}
                                          initialFocus
                                        />
                                      </PopoverContent>
                                    </Popover>
                                  </div>
                                </div>
                              )}

                              <DialogFooter>
                                <Button variant="destructive" type="button" disabled={loadingWhenDelete} onClick={() => onDeleteHouse(item._id)}>{loadingWhenDelete ? 'Изменение...' : 'Удолить'}</Button>
                                <Button disabled={$loading} type="submit" >{$loading ? 'Изменение...' : 'Сохранить'}</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline">
                          <Send />
                        </Button>
                        <Button variant="outline">
                          <Send />
                        </Button>
                      </div>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody >
        </Table >
        <Dialog open={isOpenViewModal} onOpenChange={setIsOpenViewModal}>
          <DialogContent className="max-w-3xl p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-2xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
              Общая информация
            </DialogTitle>
            <div className="space-y-6 overflow-y-auto max-h-[70vh]">
              {viewData && (
                <div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {viewData.files?.map((item) => (
                      <div key={item} className="rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src={`https://apimyhomegroup.onrender.com/${item}`}
                          alt={item}
                          width={300}
                          height={500}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4 text-gray-700 dark:text-gray-300 mt-6">
                    <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
                      <p><span className="font-semibold">ID:</span> {viewData.id}</p>
                      <p><span className="font-semibold">Владелец:</span> {viewData.userViaOwner}</p>
                    </div>

                    <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
                      <p className="font-semibold">Расположение:</p>
                      <p>Район: {viewData.district}</p>
                      <p>Адрес: {viewData.address}</p>
                      <p>Ориентир: {viewData.landmark}</p>
                    </div>

                    <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
                      <p className="font-semibold">Информация о квартире:</p>
                      <ul className="list-disc list-inside">
                        <li>Комнат: {viewData.rooms}</li>
                        <li>Этаж: {viewData.floor} / {viewData.numberOfFloorOfTheBuilding}</li>
                        <li>Площадь: {viewData.square} м²</li>
                        <li>Ремонт: {viewData.repair}</li>
                        <li>Кондиционер: {viewData.checkConditioner ? 'Да' : 'Нет'}</li>
                        <li>Телевизор: {viewData.tv ? 'Да' : 'Нет'}</li>
                        <li>Стиральная машина: {viewData.washingMaching ? 'Да' : 'Нет'}</li>
                      </ul>
                    </div>

                    <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
                      <p className="font-semibold">Способы оплаты:</p>
                      <p>Предоплата: {viewData.prepayment ? 'Да' : 'Нет'}</p>
                      <p>Депозит: {viewData.deposit ? 'Да' : 'Нет'}</p>
                      <p className="font-semibold">Цена:</p>
                      <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                        {viewData.valute === 'usd' ? `$ ${viewData.price}` : `${viewData.price} Сум`}
                      </p>
                    </div>

                    <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
                      <p>Время освобождения: {moment(viewData.date).format("DD.MM.YYYY")}</p>
                      <p>Дата обновления: {moment(viewData.updatedAt).format("DD.MM.YYYY")}</p>
                      <p>Дата создания: {moment(viewData.createdAt).format("DD.MM.YYYY")}</p>
                    </div>

                    <div className="border-t border-gray-300 dark:border-gray-700 pt-4">
                      <p className="font-semibold">Описание:</p>
                      <p className="italic">{viewData.description}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </form >
    </div >
  );
};

export default MainPage;
