'use client'
import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { fetchData } from "@/http/api"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { format } from "date-fns";
import { ru } from "date-fns/locale";



interface OwnerState {
  _id: string,
  id: number,
  name: string,
  phone: string,
  createdAt: Date,
  updatedAt: Date
}

const OverviewPage = () => {
  const { toast } = useToast()
  const [owners, setOwners] = useState<OwnerState[]>([])
  const [totalItems, setTotalItems] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [name, setName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [openModal, setOpenModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const [changeName, setChangeName] = useState<string>('')
  const [changePhone, setChangePhone] = useState<string>('')

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const displayedOwners = owners.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);


  const getVisiblePages = (totalPages: number, currentPage: number) => {
    let startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, startPage + 2);
    if (endPage - startPage < 2) {
      startPage = Math.max(1, endPage - 2);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  async function createuser(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    console.log("Working submit")
    try {
      const response = await fetchData.post('/create-owner', {
        name, phone
      })
      setOwners(prev => [...prev, response.data.owner])
      setTotalItems(owners.length + 1)
      setLoading(false)
      setOpenModal(false)
      setPhone('')
      setName('')
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast({
        title: "Ошибка",
        description: "Ошибка с сервером. Попытайтесь заново"
      })
    }
  }

  useEffect(() => {
    const getOwners = async () => {
      const res = await fetchData.get('/get-owners')
      setTotalItems(res.data.owners.length)
      setOwners(res.data.owners)
      console.log(res)
    }
    getOwners()
  }, [])

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 9) value = value.slice(0, 9);
    if (value.length >= 7) {
      value = `(${value.slice(0, 2)})${value.slice(2, 5)}-${value.slice(5, 7)}-${value.slice(7, 9)}`;
    } else if (value.length >= 5) {
      value = `(${value.slice(0, 2)})${value.slice(2, 5)}-${value.slice(5)}`;
    } else if (value.length >= 2) {
      value = `(${value.slice(0, 2)})${value.slice(2)}`;
    }

    setPhone(value);
  };

  const handleFilterData = async () => {
    const res = await fetchData.put('/filter-owners', {
      name: changeName, phone: changePhone
    })
    setOwners(res.data.owners)
    console.log(res)
  }

  useEffect(() => {
    handleFilterData()
  }, [changeName, changePhone])

  return (
    <div className="flex flex-col space-y-4 p-6 ">
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogTrigger className="absolute left-[95%] top-[91%] border p-3 rounded-xl  transition-all z-50">
          <Plus />
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Создать нового владельца</DialogTitle>
          <DialogDescription asChild>
            <div>
              <form onSubmit={createuser} className="flex flex-col space-y-6">
                <div>
                  <label className="block text-sm font-medium">Имя</label>
                  <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium">Номер телефона</label>
                  <div className="flex items-center space-x-3">
                    <p>+998 </p>
                    <Input type="text" placeholder="(99)999-99-99" value={phone} onChange={e => handlePhoneChange(e)} />
                  </div>
                </div>
                <DialogFooter>
                  <Button type={"button"} onClick={() => setOpenModal(false)}>Отмена</Button>
                  <Button type={"submit"} disabled={loading}>{loading ? 'Загрузка...' : 'Создать'}</Button>
                </DialogFooter>
              </form>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
      <div className='flex justify-between items-center  p-4'>
        <div className='flex items-center space-x-6  text-lg font-medium'>
          <p>Страница: <span className="font-semibold ">{currentPage}</span></p>
          <p>Всего: <span className="font-semibold">{totalItems}</span></p>
        </div>
        <div>
          {owners.length === 0 ? null : (
            <Pagination>
              <PaginationContent className="flex items-center space-x-2">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    href='#'
                    className="hover:text-blue-500 transition"
                  />
                </PaginationItem>
                {getVisiblePages(totalPages, currentPage).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-lg transition font-semibold cursor-pointer`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    href='#'
                    className="hover:text-blue-500 transition"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
      <div className="overflow-x-auto max-w-[1000px] xl:max-w-full rounded-lg ">
        <Table className="w-full text-left rounded-lg">
          <TableCaption className="text-sm py-3">Данные владельцев квартир</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px] p-4 font-semibold">#</TableHead>
              <TableHead className="p-4 font-semibold">
                <div>
                  <p>Имя</p>
                  <Input type="string" placeholder="Фильтр" className="max-w-[60%]" value={changeName} onChange={e => setChangeName(e.target.value)} />
                </div>
              </TableHead>
              <TableHead className="p-4 font-semibold">
                <div>
                  <p>Номер Телефона</p>
                  <Input type="string" placeholder="Фильтр" className="max-w-[60%]" value={changePhone} onChange={e => setChangePhone(e.target.value)} />
                </div></TableHead>
              <TableHead className="p-4 font-semibold">Дата обновления</TableHead>
              <TableHead className="p-4 font-semibold">Дата создания</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedOwners.map(item => (
              <TableRow key={item._id} className="border-t transition duration-200">
                <TableCell className="p-4 font-medium">{item.id}</TableCell>
                <TableCell className="p-4">{item.name}</TableCell>
                <TableCell className="p-4">{item.phone}</TableCell>
                <TableCell className="p-4">
                  {format(new Date(item.updatedAt), "d MMM yyyy, H:mm", { locale: ru })}
                </TableCell>
                <TableCell className="p-4">
                  {format(new Date(item.createdAt), "d MMM yyyy, H:mm", { locale: ru })}
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OverviewPage;
