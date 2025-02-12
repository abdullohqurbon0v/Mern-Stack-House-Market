'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
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

const MainPage = () => {
  const { houses, setAllHouses } = useHouseStore()
  const router = useRouter();
  const [date, setDate] = useState<Date>()
  const [data, setData] = useState<IHouse[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

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
      setData(houses)
    }
    getHouses()
  }, [router, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className='flex flex-col space-y-2'>
      <div className='flex justify-between'>
        <div className='flex items-center space-x-5'>
          <Button color={''}>Очистить фильтр</Button>
          <p>Интервал: 1 - 20</p>
          <p>Всего: 7999</p>
        </div>
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious onClick={() => handlePageChange(Math.max(1, currentPage - 1))} href='#' />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, index) => (
                <PaginationItem key={index}>
                  <PaginationLink
                    onClick={() => handlePageChange(index + 1)}
                    href='#'
                    className={currentPage === index + 1 ? 'font-bold text-blue-500' : ''}
                  >
                    {index + 1}
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
                        <SelectLabel>Сотрудник</SelectLabel>
                        <SelectItem value='ikhtiyor'>Ихтиёр</SelectItem>
                        <SelectItem value='okhramon'>Охрамон</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </TableHead>
              <TableHead>
                <div>
                  <p>Владелец</p>
                  <Input
                    className='w-[180px] p-1 text-black dark:text-white border rounded'
                    type='text'
                    placeholder='Фильтр'
                  />
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {houses.length === 0 ? (
              <TableRow className='text-center'>
                <TableCell>Загрузка...</TableCell>
              </TableRow>
            ) : houses.map((item) => (
              <TableRow key={item.id} className='text-center'>
                <TableCell className='font-medium'>{item.id}</TableCell>
                <TableCell>
                  <Image
                    src={`http://localhost:8080/${item.files[0]}`}
                    alt={`Image ${item.id}`}
                    className='w-[80px] h-[50px] rounded border object-cover'
                    width={100}
                    height={100}
                  />
                </TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.repair}</TableCell>
                <TableCell className='uppercasex'>{`${item.price.toFixed(2)} ${item.valute}`}</TableCell>
                <TableCell>{item.district}</TableCell>
                <TableCell>{item.rooms}</TableCell>
                <TableCell>{item.floor}</TableCell>
                <TableCell>{item.employee}</TableCell>
                <TableCell>{item.owner}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </form>
    </div>
  );
};

export default MainPage;
