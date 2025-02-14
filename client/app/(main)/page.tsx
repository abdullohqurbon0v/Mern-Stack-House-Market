'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Edit, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { fetchData } from '@/http/api';
import { IHouse } from '@/types';
import { useHouseStore } from '@/store/houses';
import { useUser } from '@/store/user';
import moment from 'moment'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@radix-ui/react-separator';

const MainPage = () => {
  const { toast } = useToast()
  const { user } = useUser()
  const { houses, setAllHouses } = useHouseStore()
  const router = useRouter();
  const [date, setDate] = useState<Date>()
  const [data, setData] = useState<IHouse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isOpenViewModal, setIsOpenViewModal] = useState(false)
  const [viewData, setViewData] = useState<IHouse | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/signin');
    }
    const getHouses = async () => {
      const response = await fetchData.get('/get-all-houses')

      console.log(response)
      setData(response.data.data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
      setTotalItems(response.data.data.length);
      console.log(data)
      setAllHouses(response.data.data)
    }
    getHouses()
    console.log("render")
  }, [router, currentPage, itemsPerPage, setAllHouses]);

  async function onEditHouse(id: string) {
    try {
      const response = await fetchData.get(`/get-house/${id}`)
      console.log(response)
    } catch (error) {
      console.log(error)
      toast({
        title: "Ошибка",
        description: "Ошибка с сервером пожалуйста попытайтесь заново"
      })
    }
  }

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

  async function onOpenViewModal(id: string) {
    setViewData(null)
    setIsOpenViewModal(true)
    try {
      const response = await fetchData.get(`/get-house/${id}`)
      setViewData(response.data.house)
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }



  return (
    <div className='flex flex-col space-y-2'>
      <div className='flex justify-between'>
        <div className='flex items-center space-x-5'>
          <Button color={''}>Очистить фильтр</Button>
          <p>Интервал: 1 - {totalItems}</p>
          <p>Всего: {totalItems}</p>
        </div>
        <div>

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
                  <Select>
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Выберите' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Тип ремонта</SelectLabel>
                        <SelectItem value='euro'>Евро ремонт</SelectItem>
                        <SelectItem value='cosmetic'>Косметический</SelectItem>
                        <SelectItem value='none'>Без ремонта</SelectItem>
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
                    placeholder='Фильтр'
                  />
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Район</p>
                  <Select>
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Выберите' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Район</SelectLabel>
                        <SelectItem value='mirzo'>Мирзо Улугбек</SelectItem>
                        <SelectItem value='yakkasaray'>Яккасарай</SelectItem>
                        <SelectItem value='shaykhantahur'>Шайхантахур</SelectItem>
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
                    placeholder='Фильтр'
                  />
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Сотрудник</p>
                  <Select>
                    <SelectTrigger className='w-[180px]'>
                      <SelectValue placeholder='Выберите' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Владелец</SelectLabel>
                        <SelectItem value='ikhtiyor'>Ихтиёр</SelectItem>
                        <SelectItem value='okhramon'>Охрамон</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {houses.length === 0 ? (
              <TableRow className="text-center">
                <TableCell>Загрузка...</TableCell>
              </TableRow>
            ) : (
              data.map((item) => (
                <TableRow key={item.id} className="text-center cursor-pointer">
                  <TableCell className="font-medium" onClick={() => onOpenViewModal(item._id)}>{item.id}</TableCell>
                  <TableCell onClick={() => onOpenViewModal(item._id)}>
                    {item.files && item.files.length > 0 ? (
                      <Image
                        src={`http://localhost:8080/${item.files[0]}`}
                        alt={`Image ${item.id}`}
                        className="w-[80px] h-[50px] rounded border object-cover"
                        width={100}
                        height={100}
                      />
                    ) : (
                      <div>Нет изображения</div>
                    )}
                  </TableCell>
                  <TableCell onClick={() => onOpenViewModal(item._id)}>{moment(item.date).format("DD.MM.YYYY")}</TableCell>
                  <TableCell onClick={() => onOpenViewModal(item._id)}>{item.repair}</TableCell>
                  <TableCell onClick={() => onOpenViewModal(item._id)} className="uppercase">{`${item.price.toFixed(2)} ${item.valute}`}</TableCell>
                  <TableCell onClick={() => onOpenViewModal(item._id)}>{item.district}</TableCell>
                  <TableCell onClick={() => onOpenViewModal(item._id)}>{item.rooms}</TableCell>
                  <TableCell onClick={() => onOpenViewModal(item._id)}>{item.floor}</TableCell>
                  <TableCell>{item.employee.fullName}</TableCell>
                  <TableCell>
                    {user && item.employee._id === user._id ? (
                      <div className="flex space-x-3 items-center">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" type="button" onClick={() => onEditHouse(item._id)}>
                              <Edit />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit House</DialogTitle>
                              <DialogDescription>
                                Make changes to your profile here. Click save when you're done.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                            </div>
                            <DialogFooter>
                              <Button type="submit">Save changes</Button>
                            </DialogFooter>
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
          </TableBody>
        </Table>
        <Dialog open={isOpenViewModal} onOpenChange={setIsOpenViewModal}>
          <DialogContent className="max-w-3xl p-6 rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-700">
            <DialogTitle className="text-2xl font-semibold text-center mb-4 text-gray-900 dark:text-white">
              Общая информация
            </DialogTitle>
            <div className="space-y-6 overflow-y-auto max-h-[70vh]">
              {viewData && (
                <div>
                  {/* Images */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {viewData.files?.map((item) => (
                      <div key={item} className="rounded-lg overflow-hidden shadow-lg">
                        <Image
                          src={`http://localhost:8080/${item}`}
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
      </form>
    </div>
  );
};

export default MainPage;
